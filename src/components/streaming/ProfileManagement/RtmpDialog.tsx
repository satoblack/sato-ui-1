import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Youtube, Twitch, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import path from "path";

interface RtmpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { 
    name: string; 
    url: string; 
    icon: string; 
    videoFile?: File; 
    audioFile?: File;
    videoFileId?: number | null;
    audioFileId?: number | null;
    isAutoUpload?: boolean;
  }, onProgress?: {
    video: (progress: number) => void;
    audio: (progress: number) => void;
  }) => Promise<{ videoFileId?: number; audioFileId?: number; } | void>;
  initialData?: { 
    id?: number;
    name: string; 
    url: string; 
    icon: string;
    videoFile?: File;
    audioFile?: File;
  };
}

const streamServices = [
  { value: 'custom', label: 'Custom RTMP', icon: <Video className="h-4 w-4 text-gray-500" /> },
  { value: 'youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4 text-red-500" /> },
  { value: 'twitch', label: 'Twitch', icon: <Twitch className="h-4 w-4 text-purple-500" /> },
  { value: 'kick', label: 'Kick', icon: <Video className="h-4 w-4 text-green-500" /> },
];

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

  // Form verilerini sıfırla
  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      icon: 'custom',
      videoFile: undefined,
      audioFile: undefined
    });
  };

  // Dialog kapanırken formu sıfırla
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // initialData değiştiğinde form verilerini güncelle
  useEffect(() => {
    if (initialData) {
      console.log('Initial data:', initialData);
      setFormData({
        name: initialData.name || '',
        url: initialData.url || '',
        icon: initialData.icon || 'custom',
        videoFile: initialData.videoFile,
        audioFile: initialData.audioFile
      });
    }
  }, [initialData]);

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Dosya kopyasını oluştur
        const newFile = new File([file], file.name, { type: file.type });
        console.log('video dosyası seçildi:', newFile);
        setFormData(prev => ({ ...prev, videoFile: newFile }));
        setVideoProgress(0);

        // Dosya yükleme işlemini başlat
        const result = await onSave({
          name: nameRef.current?.value || '',
          url: urlRef.current?.value || '',
          icon: formData.icon || 'custom',
          videoFile: newFile,
          audioFile: formData.audioFile,
          isAutoUpload: true
        }, {
          video: setVideoProgress,
          audio: () => {}
        });

        if (result && 'videoFileId' in result) {
          setUploadedVideoId(result.videoFileId);
          toast({
            title: "Video Upload Complete",
            description: "Video file has been uploaded successfully."
          });
        }
      } catch (error) {
        console.error('Video işleme hatası:', error);
        toast({
          title: "Error",
          description: "Failed to process video file",
          variant: "destructive"
        });
      }
    }
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Dosya kopyasını oluştur
        const newFile = new File([file], file.name, { type: file.type });
        console.log('audio dosyası seçildi:', newFile);
        setFormData(prev => ({ ...prev, audioFile: newFile }));
        setAudioProgress(0);

        // Dosya yükleme işlemini başlat
        const result = await onSave({
          name: nameRef.current?.value || '',
          url: urlRef.current?.value || '',
          icon: formData.icon || 'custom',
          videoFile: formData.videoFile,
          audioFile: newFile,
          isAutoUpload: true
        }, {
          video: () => {},
          audio: setAudioProgress
        });

        if (result && 'audioFileId' in result) {
          setUploadedAudioId(result.audioFileId);
          toast({
            title: "Audio Upload Complete",
            description: "Audio file has been uploaded successfully."
          });
        }
      } catch (error) {
        console.error('Ses dosyası işleme hatası:', error);
        toast({
          title: "Error",
          description: "Failed to process audio file",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    const name = nameRef.current?.value;
    const url = urlRef.current?.value;

    if (!name || !url) {
      toast({
        title: "Validation Error",
        description: "Name and URL are required.",
        variant: "destructive"
      });
      return;
    }

    // URL formatını kontrol et
    if (!url.startsWith('rtmp://') && !url.startsWith('rtmps://')) {
      toast({
        title: "Invalid URL",
        description: "URL must start with rtmp:// or rtmps://",
        variant: "destructive"
      });
      return;
    }

    // URL'deki fazla boşlukları temizle
    const trimmedUrl = url.trim();

    try {
      await onSave({
        name,
        url: trimmedUrl,
        icon: formData.icon,
        videoFile: formData.videoFile,
        audioFile: formData.audioFile,
        videoFileId: uploadedVideoId,
        audioFileId: uploadedAudioId
      }, {
        video: setVideoProgress,
        audio: setAudioProgress
      });
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Dialog kapanırken ilerleme çubuklarını sıfırla
  useEffect(() => {
    if (!isOpen) {
      setUploadProgress({ video: 0, audio: 0 });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">
            {initialData ? 'Edit RTMP Endpoint' : 'Add RTMP Endpoint'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure your streaming endpoint and media files.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-zinc-200">Service Type</Label>
            <Select 
              value={formData.icon} 
              onValueChange={(value) => setFormData({ ...formData, icon: value })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                <SelectValue placeholder="Select streaming service" />
              </SelectTrigger>
              <SelectContent>
                {streamServices.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    <div className="flex items-center gap-2">
                      {service.icon}
                      <span>{service.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">Name</Label>
            <Input
              ref={nameRef}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter RTMP name"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">RTMP URL</Label>
            <Input
              ref={urlRef}
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Enter RTMP URL"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">Video File (.mp4)</Label>
            <div className="space-y-2">
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4">
                {(formData.videoFile || initialData?.videoFile) ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-zinc-200">
                          {formData.videoFile?.name || initialData?.videoFile?.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.mp4,video/mp4';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              handleVideoChange({ target: { files: [file] } } as any);
                            }
                          };
                          input.click();
                        }}
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        Change Video
                      </Button>
                    </div>
                    {videoProgress > 0 && (
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-1">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            videoProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${videoProgress}%` }}
                        ></div>
                      </div>
                    )}
                    {videoProgress > 0 && (
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>{videoProgress === 100 ? 'Ready to use' : 'Processing...'}</span>
                        <span>{videoProgress}%</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-4 cursor-pointer"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.mp4,video/mp4';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          handleVideoChange({ target: { files: [file] } } as any);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Video className="h-8 w-8 text-zinc-500 mb-2" />
                    <div className="text-sm text-zinc-400">
                      Click to upload video file
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      MP4 format supported
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">Audio File (.aac)</Label>
            <div className="space-y-2">
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4">
                {(formData.audioFile || initialData?.audioFile) ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg 
                          className="h-4 w-4 text-green-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span className="text-sm text-zinc-200">
                          {formData.audioFile?.name || initialData?.audioFile?.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.aac,audio/aac';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              handleAudioChange({ target: { files: [file] } } as any);
                            }
                          };
                          input.click();
                        }}
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        Change Audio
                      </Button>
                    </div>
                    {audioProgress > 0 && (
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-1">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            audioProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${audioProgress}%` }}
                        ></div>
                      </div>
                    )}
                    {audioProgress > 0 && (
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>{audioProgress === 100 ? 'Ready to use' : 'Processing...'}</span>
                        <span>{audioProgress}%</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-4 cursor-pointer"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.aac,audio/aac';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          handleAudioChange({ target: { files: [file] } } as any);
                        }
                      };
                      input.click();
                    }}
                  >
                    <svg 
                      className="h-8 w-8 text-zinc-500 mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <div className="text-sm text-zinc-400">
                      Click to upload audio file
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      AAC format supported
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name || !formData.url || !formData.icon}
          >
            {initialData ? 'Save Changes' : 'Add RTMP'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};