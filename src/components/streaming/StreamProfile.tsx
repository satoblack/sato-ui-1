import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const StreamProfile = () => {
  const [profiles, setProfiles] = useState([
    { id: 1, name: 'RTMP Stream Profile', rtmpUrls: ['rtmp://server1/live'] },
    { id: 2, name: 'Restream Profile', rtmpUrls: ['rtmp://server1/live', 'rtmp://server2/live'] }
  ]);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [newRtmpUrl, setNewRtmpUrl] = useState('');
  const { toast } = useToast();

  const handleAddProfile = () => {
    const newProfile = {
      id: Date.now(),
      name: `New Profile ${profiles.length + 1}`,
      rtmpUrls: []
    };
    setProfiles([...profiles, newProfile]);
    toast({
      title: "Profile Added",
      description: "New streaming profile has been created."
    });
  };

  const handleDeleteProfile = (id: number) => {
    setProfiles(profiles.filter(profile => profile.id !== id));
    toast({
      title: "Profile Deleted",
      description: "The streaming profile has been removed."
    });
  };

  const handleAddRtmpUrl = (profileId: number) => {
    if (!newRtmpUrl) return;
    setProfiles(profiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          rtmpUrls: [...profile.rtmpUrls, newRtmpUrl]
        };
      }
      return profile;
    }));
    setNewRtmpUrl('');
    toast({
      title: "RTMP URL Added",
      description: "New RTMP URL has been added to the profile."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-zinc-100">
              Stream Profiles
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleAddProfile}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setSelectedProfile(Number(value))}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
              <SelectValue placeholder="Select profile" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map(profile => (
                <SelectItem key={profile.id} value={profile.id.toString()}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedProfile && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-zinc-100">
                Profile Settings
              </CardTitle>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => handleDeleteProfile(selectedProfile)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">
                  RTMP URLs
                </label>
                <Tabs defaultValue="rtmp1" className="w-full">
                  <TabsList className="bg-zinc-800">
                    {profiles.find(p => p.id === selectedProfile)?.rtmpUrls.map((_, index) => (
                      <TabsTrigger key={index} value={`rtmp${index + 1}`}>
                        RTMP {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {profiles.find(p => p.id === selectedProfile)?.rtmpUrls.map((url, index) => (
                    <TabsContent key={index} value={`rtmp${index + 1}`}>
                      <Input
                        value={url}
                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                        readOnly
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new RTMP URL"
                  value={newRtmpUrl}
                  onChange={(e) => setNewRtmpUrl(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
                <Button 
                  variant="secondary"
                  onClick={() => handleAddRtmpUrl(selectedProfile)}
                >
                  Add RTMP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};