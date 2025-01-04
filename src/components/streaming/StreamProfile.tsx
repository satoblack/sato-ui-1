import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfileList } from "./ProfileManagement/ProfileList";
import { RtmpList } from "./ProfileManagement/RtmpList";
import { ProfileDialog } from "./ProfileManagement/ProfileDialog";
import { RtmpDialog } from "./ProfileManagement/RtmpDialog";
import { Youtube, Twitch, Facebook, Video } from "lucide-react";

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

const defaultProfiles: Profile[] = [
  {
    id: 1,
    name: "Gaming Stream",
    rtmpUrls: [
      {
        id: 11,
        name: "Twitch Main",
        url: "rtmp://live.twitch.tv/app/",
        icon: "twitch",
      },
      {
        id: 12,
        name: "YouTube Gaming",
        url: "rtmp://a.rtmp.youtube.com/live2/",
        icon: "youtube",
      }
    ]
  },
  {
    id: 2,
    name: "Social Media",
    rtmpUrls: [
      {
        id: 21,
        name: "Facebook Live",
        url: "rtmp://live-api-s.facebook.com:80/rtmp/",
        icon: "facebook",
      },
      {
        id: 22,
        name: "Custom RTMP",
        url: "rtmp://custom.streaming.server/live/",
        icon: "video",
      }
    ]
  }
];

export const StreamProfile = () => {
  const [profiles, setProfiles] = useState<Profile[]>(defaultProfiles);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [isNewProfileDialogOpen, setIsNewProfileDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isNewRtmpDialogOpen, setIsNewRtmpDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const { toast } = useToast();

  const handleAddProfile = () => {
    if (!newProfileName.trim()) return;
    
    const newProfile = {
      id: Date.now(),
      name: newProfileName,
      rtmpUrls: []
    };
    
    setProfiles([...profiles, newProfile]);
    setNewProfileName('');
    setIsNewProfileDialogOpen(false);
    toast({
      title: "Profile Added",
      description: "New streaming profile has been created."
    });
  };

  const handleDeleteProfile = (id: number) => {
    setProfiles(profiles.filter(profile => profile.id !== id));
    setSelectedProfile(null);
    setIsEditProfileDialogOpen(false);
    toast({
      title: "Profile Deleted",
      description: "The streaming profile has been removed."
    });
  };

  const handleAddRtmpUrl = (data: { name: string; url: string; icon: string; videoFile?: File; audioFile?: File }) => {
    if (!selectedProfile || !data.name || !data.url) return;
    
    setProfiles(profiles.map(profile => {
      if (profile.id === selectedProfile) {
        return {
          ...profile,
          rtmpUrls: [...profile.rtmpUrls, {
            id: Date.now(),
            name: data.name,
            url: data.url,
            icon: data.icon,
            videoFile: data.videoFile,
            audioFile: data.audioFile
          }]
        };
      }
      return profile;
    }));
    
    setIsNewRtmpDialogOpen(false);
    toast({
      title: "RTMP Added",
      description: "New RTMP endpoint has been added to the profile."
    });
  };

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
          onNewRtmp={() => setIsNewRtmpDialogOpen(true)}
        />
      )}

      <ProfileDialog
        isOpen={isNewProfileDialogOpen}
        onClose={() => setIsNewProfileDialogOpen(false)}
        onSave={handleAddProfile}
        title="Create New Profile"
        initialName={newProfileName}
      />

      <ProfileDialog
        isOpen={isEditProfileDialogOpen}
        onClose={() => setIsEditProfileDialogOpen(false)}
        onSave={(name) => {
          setProfiles(profiles.map(p => 
            p.id === selectedProfile ? { ...p, name } : p
          ));
          setIsEditProfileDialogOpen(false);
        }}
        title="Edit Profile"
        initialName={profiles.find(p => p.id === selectedProfile)?.name || ''}
        showDelete
        onDelete={() => selectedProfile && handleDeleteProfile(selectedProfile)}
      />

      <RtmpDialog
        isOpen={isNewRtmpDialogOpen}
        onClose={() => setIsNewRtmpDialogOpen(false)}
        onSave={handleAddRtmpUrl}
      />
    </div>
  );
};