import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const API_URL = 'http://localhost:3001';

interface RtmpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, onProgress?: any) => Promise<any>;
  initialData?: any;
}

export const RtmpDialog = ({ isOpen, onClose, onSave, initialData }: RtmpDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: 'custom',
    videoFile: undefined as File | undefined,
    audioFile: undefined as File | undefined
  });
  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    audio: 0
  });
  const { toast } = useToast();
  const nameRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [uploadedVideoId, setUploadedVideoId] = useState<number | null>(null);
  const [uploadedAudioId, setUploadedAudioId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form verilerini sıfırla
  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      icon: 'custom',
      videoFile: undefined,
      audioFile: undefined
    });
    setUploadProgress({ video: 0, audio: 0 });
    setVideoProgress(0);
    setAudioProgress(0);
    setUploadedVideoId(null);
    setUploadedAudioId(null);
    setIsUploading(false);
  };

  // Yüklenen dosyaları temizle
  const cleanupUploadedFiles = async () => {
    const fileIdsToDelete = [];
    if (uploadedVideoId) fileIdsToDelete.push(uploadedVideoId);
    if (uploadedAudioId) fileIdsToDelete.push(uploadedAudioId);

    if (fileIdsToDelete.length > 0) {
      try {
        console.log('İptal edilen dosyalar:', fileIdsToDelete);
        const response = await fetch(`${API_URL}/api/media/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileIds: fileIdsToDelete
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Dosya iptal hatası:', errorText);
          throw new Error(errorText);
        }
      } catch (error) {
        console.error('Dosya iptal hatası:', error);
        toast({
          title: "Error",
          description: "Dosyalar iptal edilirken bir hata oluştu",
          variant: "destructive"
        });
      }
    }
  };

  // Dialog kapatma işlemi
  const handleClose = async () => {
    if (isUploading) {
      const confirm = window.confirm('Dosya yükleme işlemi devam ediyor. İptal etmek istediğinize emin misiniz?');
      if (!confirm) return;
    }

    try {
      // Yüklenmiş dosyaları temizle
      await cleanupUploadedFiles();
    } catch (error) {
      console.error('İptal işlemi hatası:', error);
    } finally {
      resetForm();
      onClose();
    }
  };

  // useEffect ile dialog kapanırken temizlik yap
  useEffect(() => {
    if (!isOpen && (uploadedVideoId || uploadedAudioId)) {
      cleanupUploadedFiles();
      resetForm();
    }
  }, [isOpen]);

  // Dosya yükleme işlemi
  const uploadFile = async (file: File, type: 'video' | 'audio') => {
    try {
      // Hash hesapla
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // FormData oluştur
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileHash', hashHex);

      // Dosyayı geçici olarak yükle
      const response = await fetch(`${API_URL}/api/media/upload/temp`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Dosya yükleme hatası: ${response.status}`);
      }

      const result = await response.json();
      console.log('Geçici dosya yüklendi:', result);
      return result;
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      throw error;
    }
  };

  // Dosya seçme işlemi
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'audio') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      console.log(`${type} dosyası seçildi:`, file);

      // Dosya boyutu kontrolü (örn: 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: `Dosya boyutu çok büyük (Maksimum: ${maxSize / 1024 / 1024}MB)`,
          variant: "destructive"
        });
        return;
      }

      // Önceki dosyayı temizle
      if (type === 'video' && uploadedVideoId) {
        await cleanupUploadedFiles();
        setUploadedVideoId(null);
      } else if (type === 'audio' && uploadedAudioId) {
        await cleanupUploadedFiles();
        setUploadedAudioId(null);
      }

      // Yeni dosyayı geçici olarak yükle
      const result = await uploadFile(file, type);

      // Dosya ID'sini kaydet
      if (type === 'video') {
        setUploadedVideoId(result.id);
        setFormData(prev => ({ ...prev, videoFile: file }));
      } else {
        setUploadedAudioId(result.id);
        setFormData(prev => ({ ...prev, audioFile: file }));
      }

      toast({
        title: "Success",
        description: `${type === 'video' ? 'Video' : 'Ses'} dosyası başarıyla yüklendi`,
      });
    } catch (error) {
      console.error(`${type} dosyası yükleme hatası:`, error);
      toast({
        title: "Error",
        description: `${type === 'video' ? 'Video' : 'Ses'} dosyası yüklenemedi`,
        variant: "destructive"
      });

      // Hata durumunda form verilerini temizle
      if (type === 'video') {
        setFormData(prev => ({ ...prev, videoFile: undefined }));
      } else {
        setFormData(prev => ({ ...prev, audioFile: undefined }));
      }
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Input'u temizle
    }
  };

  // ... rest of the code ...
}; 