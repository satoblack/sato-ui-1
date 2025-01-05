import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfileList } from "./ProfileManagement/ProfileList";
import { RtmpList } from "./ProfileManagement/RtmpList";
import { ProfileDialog } from "./ProfileManagement/ProfileDialog";
import { RtmpDialog } from "./ProfileManagement/RtmpDialog";
import { Youtube, Twitch, Video } from "lucide-react";
import path from 'path';

interface RtmpUrl {
  id: number;
  name: string;
  url: string;
  icon: string;
  videoFile?: File;
  audioFile?: File;
}

interface Profile {
  id: number;
  name: string;
  rtmpUrls: RtmpUrl[];
}

const defaultProfiles: Profile[] = [];

const API_URL = 'http://localhost:3001';

export const StreamProfile = () => {
  const [profiles, setProfiles] = useState<Profile[]>(defaultProfiles);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [isNewProfileDialogOpen, setIsNewProfileDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isNewRtmpDialogOpen, setIsNewRtmpDialogOpen] = useState(false);
  const [selectedRtmp, setSelectedRtmp] = useState<RtmpUrl | null>(null);
  const { toast } = useToast();

  const handleAddProfile = async (name: string) => {
    console.log('handleAddProfile called');
    console.log('Profile name:', name);
    
    if (!name.trim()) {
      console.log('Profile name is empty');
      return;
    }
    
    try {
      console.log('Sending request to:', `${API_URL}/api/profile`);
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name
        }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Profil oluşturulurken bir hata oluştu');
      }
    
    const newProfile = {
        id: responseData.id,
        name: responseData.username,
      rtmpUrls: []
    };
    
      setProfiles(prevProfiles => [...prevProfiles, newProfile]);
      setSelectedProfile(newProfile.id);
    setIsNewProfileDialogOpen(false);
      
    toast({
      title: "Profile Added",
      description: "New streaming profile has been created."
    });
    } catch (error) {
      console.error('Profil oluşturma hatası:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteProfile = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/profile/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Profil silinirken bir hata oluştu');
      }

      setProfiles(prevProfiles => {
        const updatedProfiles = prevProfiles.filter(profile => profile.id !== id);
        if (updatedProfiles.length > 0) {
          const lastProfile = updatedProfiles[updatedProfiles.length - 1];
          setSelectedProfile(lastProfile.id);
        } else {
    setSelectedProfile(null);
        }
        return updatedProfiles;
      });

    setIsEditProfileDialogOpen(false);
    toast({
      title: "Profile Deleted",
      description: "The streaming profile has been removed."
    });
    } catch (error) {
      console.error('Profil silme hatası:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const uploadFile = async (
    file: File,
    profileId: number,
    type: 'video' | 'audio',
    onProgress?: (progress: number) => void
  ) => {
    try {
      // Dosya kopyasını oluştur
      const newFile = new File([file], file.name, { type: file.type });

      // Hash hesapla
      const fileBuffer = await newFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Önce hash kontrolü yap
      const checkResponse = await fetch(`${API_URL}/api/media/check-hash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash: hashHex,
          fileType: type
        }),
      });

      if (checkResponse.ok) {
        const existingFile = await checkResponse.json();
        console.log('Hash kontrolü sonucu:', existingFile);
        
        if (existingFile.exists) {
          console.log('Aynı hash değerine sahip dosya bulundu:', existingFile);
          if (onProgress) onProgress(100);
          return existingFile;
        }
      }

      // Dosya yoksa veya hash kontrolü başarısız olduysa yükle
      const formData = new FormData();
      formData.append('file', newFile);
      formData.append('fileHash', hashHex);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/api/media/upload/${profileId}`, true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              console.log('Dosya yükleme başarılı:', response);
              resolve(response);
            } catch (error) {
              console.error('Sunucu yanıtı parse hatası:', error);
              reject(new Error('Sunucu yanıtı geçersiz format'));
            }
          } else {
            console.error('Dosya yükleme hatası:', xhr.status, xhr.statusText, xhr.responseText);
            reject(new Error(`Dosya yükleme hatası: ${xhr.status} ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => {
          console.error('XHR hata:', xhr.status, xhr.statusText);
          reject(new Error('Dosya yükleme hatası: Ağ hatası'));
        };

        xhr.send(formData);
      });
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      throw error;
    }
  };

  // Dosyadan hash oluştur
  const generateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleAddRtmpUrl = async (data: { 
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
  }) => {
    if (!data.isAutoUpload && (!selectedProfile || !data.name || !data.url)) {
      console.error('Gerekli alanlar eksik:', { selectedProfile, data });
      toast({
        title: "Validation Error",
        description: "Profile, name and URL are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('RTMP ekleme başlıyor...');
      console.log('Seçili profil:', selectedProfile);
      console.log('Gelen veri:', data);

      // Eğer dosyalar önceden yüklenmemişse yükle
      let videoFileId = data.videoFileId;
      let audioFileId = data.audioFileId;

      if (data.videoFile && !videoFileId) {
        console.log('Video dosyası yükleniyor...');
        const videoResult = await uploadFile(data.videoFile, selectedProfile!, 'video', 
          (progress) => {
            console.log('Video upload progress:', progress);
            onProgress?.video(progress);
            if (progress === 100) {
              toast({
                title: "Video Upload Complete",
                description: `Video file "${data.videoFile?.name}" has been uploaded successfully.`
              });
            }
          }
        );
        videoFileId = videoResult.id;
        console.log('Video dosyası yüklendi:', videoResult);
      }

      if (data.audioFile && !audioFileId) {
        console.log('Ses dosyası yükleniyor...');
        const audioResult = await uploadFile(data.audioFile, selectedProfile!, 'audio',
          (progress) => {
            console.log('Audio upload progress:', progress);
            onProgress?.audio(progress);
            if (progress === 100) {
              toast({
                title: "Audio Upload Complete",
                description: `Audio file "${data.audioFile?.name}" has been uploaded successfully.`
              });
            }
          }
        );
        audioFileId = audioResult.id;
        console.log('Ses dosyası yüklendi:', audioResult);
      }

      // Otomatik yükleme sırasında RTMP kaydetme işlemini atla
      if (data.isAutoUpload) {
        return {
          videoFileId,
          audioFileId
        };
      }

      console.log('RTMP bilgileri kaydediliyor...');
      // RTMP bilgilerini kaydet
      const rtmpData = {
        profile_id: selectedProfile,
        name: data.name,
        url: data.url.trim(),
        icon: data.icon,
        video_file_id: videoFileId,
        audio_file_id: audioFileId,
        is_active: false
      };
      console.log('Gönderilecek RTMP verisi:', rtmpData);

      const response = await fetch(`${API_URL}/api/rtmp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rtmpData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('RTMP kaydetme hatası:', error);
        throw new Error(error.error || 'RTMP eklenirken bir hata oluştu');
      }

      const newRtmp = await response.json();
      console.log('RTMP kaydedildi:', newRtmp);

      // RTMP listesini yeniden yükle
      if (selectedProfile) {
        await loadRtmpList(selectedProfile);
      }

      setIsNewRtmpDialogOpen(false);
      toast({
        title: "RTMP Added",
        description: "The RTMP endpoint has been added."
      });

      return {
        videoFileId,
        audioFileId
      };
    } catch (error) {
      console.error('RTMP ekleme hatası:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleEditRtmp = (rtmp: RtmpUrl) => {
    setSelectedRtmp(rtmp);
    setIsNewRtmpDialogOpen(true);
    toast({
      title: "Edit RTMP",
      description: "Edit the RTMP endpoint settings."
    });
  };

  const handleDeleteRtmp = async (rtmpId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/rtmp/${rtmpId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'RTMP silinirken bir hata oluştu');
      }

    setProfiles(profiles.map(profile => {
      if (profile.id === selectedProfile) {
        return {
          ...profile,
          rtmpUrls: profile.rtmpUrls.filter(url => url.id !== rtmpId)
        };
      }
      return profile;
    }));
    
    toast({
      title: "RTMP Deleted",
      description: "The RTMP endpoint has been removed."
    });

      // RTMP listesini yeniden yükle
      if (selectedProfile) {
        await loadRtmpList(selectedProfile);
      }
    } catch (error) {
      console.error('RTMP silme hatası:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Profil güncelleme
  const handleEditProfile = async (name: string) => {
    if (!selectedProfile || !name.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/profile/${selectedProfile}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Profil güncellenirken bir hata oluştu');
      }

      setProfiles(profiles.map(p => 
        p.id === selectedProfile ? { ...p, name } : p
      ));
      setIsEditProfileDialogOpen(false);
      toast({
        title: "Profile Updated",
        description: "The streaming profile has been updated."
      });
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // RTMP güncelleme
  const handleEditRtmpUrl = async (data: { 
    name: string; 
    url: string; 
    icon: string;
    videoFile?: File;
    audioFile?: File;
  }) => {
    if (!selectedProfile || !selectedRtmp || !data.name || !data.url) return;
    
    try {
      console.log('RTMP güncelleme başlıyor...');
      console.log('Seçili RTMP:', selectedRtmp);
      console.log('Gelen veri:', data);

      // Sadece dosya değişikliği varsa yükle
      let videoFileId = undefined;
      let audioFileId = undefined;

      if (data.videoFile && data.videoFile !== selectedRtmp.videoFile) {
        console.log('Yeni video dosyası yükleniyor...');
        const videoResult = await uploadFile(data.videoFile, selectedProfile!, 'video', 
          (progress) => {
            console.log('Video upload progress:', progress);
            if (progress === 100) {
              toast({
                title: "Video Upload Complete",
                description: `Video file "${data.videoFile?.name}" has been uploaded successfully.`
              });
            }
          }
        );
        videoFileId = videoResult.id;
      }

      if (data.audioFile && data.audioFile !== selectedRtmp.audioFile) {
        console.log('Yeni ses dosyası yükleniyor...');
        const audioResult = await uploadFile(data.audioFile, selectedProfile!, 'audio',
          (progress) => {
            console.log('Audio upload progress:', progress);
            if (progress === 100) {
              toast({
                title: "Audio Upload Complete",
                description: `Audio file "${data.audioFile?.name}" has been uploaded successfully.`
              });
            }
          }
        );
        audioFileId = audioResult.id;
      }

      // RTMP bilgilerini güncelle
      const updateData: any = {
        name: data.name,
        url: data.url,
        icon: data.icon,
        is_active: false
      };

      // Sadece yeni dosya yüklendiyse ID'leri ekle
      if (videoFileId !== undefined) updateData.video_file_id = videoFileId;
      if (audioFileId !== undefined) updateData.audio_file_id = audioFileId;

      console.log('Güncellenecek RTMP verisi:', updateData);

      const response = await fetch(`${API_URL}/api/rtmp/${selectedRtmp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'RTMP güncellenirken bir hata oluştu');
      }

      const updatedRtmp = await response.json();
      console.log('RTMP güncellendi:', updatedRtmp);

      // RTMP listesini yeniden yükle
      if (selectedProfile) {
        await loadRtmpList(selectedProfile);
      }

      setIsNewRtmpDialogOpen(false);
      setSelectedRtmp(null);
      toast({
        title: "RTMP Updated",
        description: "The RTMP endpoint has been updated."
      });
    } catch (error) {
      console.error('RTMP güncelleme hatası:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Profilleri yükle
  const loadProfiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile`);
      if (!response.ok) {
        throw new Error('Profiller yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      // Profilleri eski oluşturulandan yeniye doğru sırala
      const sortedProfiles = data
        .map((profile: any) => ({
          id: profile.id,
          name: profile.username,
          rtmpUrls: []
        }))
        .sort((a: Profile, b: Profile) => a.id - b.id); // ID'ye göre artan sıralama
      
      setProfiles(sortedProfiles);
      // İlk profili otomatik seç (en eski oluşturulan)
      if (sortedProfiles.length > 0 && !selectedProfile) {
        setSelectedProfile(sortedProfiles[0].id);
      }
    } catch (error) {
      console.error('Profil yükleme hatası:', error);
      toast({
        title: "Error",
        description: "Profiles could not be loaded",
        variant: "destructive"
      });
    }
  };

  // RTMP listesini yükle
  const loadRtmpList = async (profileId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/rtmp/profile/${profileId}`);
      if (!response.ok) {
        throw new Error('RTMP listesi yüklenirken bir hata oluştu');
      }
      const rtmpData = await response.json();
      
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => {
          if (profile.id === profileId) {
            return {
              ...profile,
              rtmpUrls: rtmpData.map((rtmp: any) => ({
                id: rtmp.id,
                name: rtmp.name,
                url: rtmp.url,
                icon: rtmp.icon || 'custom',
                videoFile: rtmp.video_path ? new File([], rtmp.video_name) : undefined,
                audioFile: rtmp.audio_path ? new File([], rtmp.audio_name) : undefined
              }))
            };
          }
          return profile;
        })
      );
    } catch (error) {
      console.error('RTMP listesi yükleme hatası:', error);
      toast({
        title: "Error",
        description: "RTMP list could not be loaded",
        variant: "destructive"
      });
    }
  };

  // Seçili profil değiştiğinde RTMP listesini yükle
  useEffect(() => {
    if (selectedProfile) {
      loadRtmpList(selectedProfile);
    }
  }, [selectedProfile]);

  // Component mount olduğunda profilleri yükle
  useEffect(() => {
    loadProfiles();
  }, []);

  return (
    <div className="space-y-6">
      <ProfileList
        profiles={profiles}
        selectedProfile={selectedProfile}
        onSelectProfile={setSelectedProfile}
        onNewProfile={() => setIsNewProfileDialogOpen(true)}
        onEditProfile={() => setIsEditProfileDialogOpen(true)}
      />

      {selectedProfile && (
        <RtmpList
          rtmpUrls={profiles.find(p => p.id === selectedProfile)?.rtmpUrls || []}
          onNewRtmp={() => {
            setSelectedRtmp(null);
            setIsNewRtmpDialogOpen(true);
          }}
          onEditRtmp={handleEditRtmp}
          onDeleteRtmp={handleDeleteRtmp}
        />
      )}

      <ProfileDialog
        isOpen={isNewProfileDialogOpen}
        onClose={() => setIsNewProfileDialogOpen(false)}
        onSave={handleAddProfile}
        title="Create New Profile"
      />

      <ProfileDialog
        isOpen={isEditProfileDialogOpen}
        onClose={() => setIsEditProfileDialogOpen(false)}
        onSave={handleEditProfile}
        title="Edit Profile"
        initialName={profiles.find(p => p.id === selectedProfile)?.name || ''}
        showDelete
        onDelete={() => selectedProfile && handleDeleteProfile(selectedProfile)}
      />

      <RtmpDialog
        isOpen={isNewRtmpDialogOpen}
        onClose={() => {
          setIsNewRtmpDialogOpen(false);
          setSelectedRtmp(null);
        }}
        onSave={selectedRtmp ? handleEditRtmpUrl : handleAddRtmpUrl}
        initialData={selectedRtmp}
      />
    </div>
  );
};
