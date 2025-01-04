import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfileCard } from "./ProfileCard";
import type { StreamProfile as StreamProfileType } from "./types";

const sampleProfiles: StreamProfileType[] = [
  {
    id: 1,
    name: "Profile 1",
    totalSpeed: 2500,
    isActive: false,
    rtmpEndpoints: [
      { 
        id: 1, 
        name: "Twitch", 
        url: "rtmp://twitch.tv/live", 
        speed: 1200, 
        isActive: false,
        currentFps: 30,
        bitrate: "2500 kbps",
        droppedFrames: 0,
        totalFrames: 3600,
        uptime: "00:30:00",
        health: 'good'
      },
      { 
        id: 2, 
        name: "YouTube", 
        url: "rtmp://youtube.com/live", 
        speed: 1300, 
        isActive: false,
        currentFps: 30,
        bitrate: "2500 kbps",
        droppedFrames: 12,
        totalFrames: 3600,
        uptime: "00:30:00",
        health: 'warning'
      }
    ]
  },
  {
    id: 2,
    name: "Profile 2",
    totalSpeed: 3000,
    isActive: true,
    rtmpEndpoints: [
      { 
        id: 3, 
        name: "Facebook", 
        url: "rtmp://facebook.com/live", 
        speed: 1500, 
        isActive: true,
        currentFps: 30,
        bitrate: "3000 kbps",
        droppedFrames: 0,
        totalFrames: 7200,
        uptime: "01:00:00",
        health: 'good'
      },
      { 
        id: 4, 
        name: "Custom", 
        url: "rtmp://custom.com/live", 
        speed: 1500, 
        isActive: true,
        currentFps: 28,
        bitrate: "3000 kbps",
        droppedFrames: 45,
        totalFrames: 7200,
        uptime: "01:00:00",
        health: 'error'
      }
    ]
  }
];

export const StreamControlProfile = () => {
  const [profiles, setProfiles] = useState<StreamProfileType[]>(sampleProfiles);
  const [expandedProfile, setExpandedProfile] = useState<number | null>(null);
  const { toast } = useToast();

  const toggleExpand = (profileId: number) => {
    setExpandedProfile(expandedProfile === profileId ? null : profileId);
  };

  const toggleProfileStream = (profileId: number) => {
    setProfiles(profiles.map(profile => {
      if (profile.id === profileId) {
        const newStatus = !profile.isActive;
        return {
          ...profile,
          isActive: newStatus,
          rtmpEndpoints: profile.rtmpEndpoints.map(endpoint => ({
            ...endpoint,
            isActive: newStatus
          }))
        };
      }
      return profile;
    }));

    const profile = profiles.find(p => p.id === profileId);
    toast({
      title: `Profile ${profile?.isActive ? 'Stopped' : 'Started'}`,
      description: `${profile?.name} has been ${profile?.isActive ? 'stopped' : 'started'} successfully.`
    });
  };

  const toggleEndpointStream = (profileId: number, endpointId: number) => {
    setProfiles(profiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          rtmpEndpoints: profile.rtmpEndpoints.map(endpoint => {
            if (endpoint.id === endpointId) {
              return { ...endpoint, isActive: !endpoint.isActive };
            }
            return endpoint;
          })
        };
      }
      return profile;
    }));

    const profile = profiles.find(p => p.id === profileId);
    const endpoint = profile?.rtmpEndpoints.find(e => e.id === endpointId);
    toast({
      title: `Endpoint ${endpoint?.isActive ? 'Stopped' : 'Started'}`,
      description: `${endpoint?.name} has been ${endpoint?.isActive ? 'stopped' : 'started'} successfully.`
    });
  };

  const showLogs = (endpointName: string) => {
    toast({
      title: "Logs Opened",
      description: `Viewing logs for ${endpointName}`
    });
  };

  return (
    <div className="space-y-4 p-6">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isExpanded={expandedProfile === profile.id}
          onToggleExpand={toggleExpand}
          onToggleStream={toggleProfileStream}
          onToggleEndpointStream={toggleEndpointStream}
          onShowLogs={showLogs}
        />
      ))}
    </div>
  );
};