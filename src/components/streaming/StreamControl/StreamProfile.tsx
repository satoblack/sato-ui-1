import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Play, Pause, Settings, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface RtmpEndpoint {
  id: number;
  name: string;
  url: string;
  speed: number;
  isActive: boolean;
}

interface StreamProfile {
  id: number;
  name: string;
  totalSpeed: number;
  isActive: boolean;
  rtmpEndpoints: RtmpEndpoint[];
}

const sampleProfiles: StreamProfile[] = [
  {
    id: 1,
    name: "Profile 1",
    totalSpeed: 2500,
    isActive: false,
    rtmpEndpoints: [
      { id: 1, name: "Twitch", url: "rtmp://twitch.tv/live", speed: 1200, isActive: false },
      { id: 2, name: "YouTube", url: "rtmp://youtube.com/live", speed: 1300, isActive: false }
    ]
  },
  {
    id: 2,
    name: "Profile 2",
    totalSpeed: 3000,
    isActive: true,
    rtmpEndpoints: [
      { id: 3, name: "Facebook", url: "rtmp://facebook.com/live", speed: 1500, isActive: true },
      { id: 4, name: "Custom", url: "rtmp://custom.com/live", speed: 1500, isActive: true }
    ]
  }
];

export const StreamControlProfile = () => {
  const [profiles, setProfiles] = useState<StreamProfile[]>(sampleProfiles);
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

  const openSettings = (endpointName: string) => {
    toast({
      title: "Settings Opened",
      description: `Configure settings for ${endpointName}`
    });
  };

  return (
    <div className="space-y-4 p-6">
      {profiles.map((profile) => (
        <Card key={profile.id} className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-zinc-100">{profile.name}</h3>
              <Badge variant={profile.isActive ? "default" : "secondary"}>
                {profile.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => toggleExpand(profile.id)}>
                {expandedProfile === profile.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-zinc-400">
                Total Speed: {profile.totalSpeed} kbps
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleProfileStream(profile.id)}
                  className={profile.isActive ? "bg-red-500/10 hover:bg-red-500/20 text-red-500" : "bg-green-500/10 hover:bg-green-500/20 text-green-500"}
                >
                  {profile.isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {profile.isActive ? "Stop" : "Start"}
                </Button>
              </div>
            </div>

            {expandedProfile === profile.id && (
              <div className="space-y-3 mt-4 pt-4 border-t border-zinc-800">
                {profile.rtmpEndpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className="p-3 bg-zinc-800 rounded-lg flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium text-zinc-100">{endpoint.name}</h4>
                      <p className="text-sm text-zinc-400">{endpoint.speed} kbps</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => showLogs(endpoint.name)}
                        className="hover:bg-zinc-700"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openSettings(endpoint.name)}
                        className="hover:bg-zinc-700"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleEndpointStream(profile.id, endpoint.id)}
                        className={endpoint.isActive ? "bg-red-500/10 hover:bg-red-500/20 text-red-500" : "bg-green-500/10 hover:bg-green-500/20 text-green-500"}
                      >
                        {endpoint.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};