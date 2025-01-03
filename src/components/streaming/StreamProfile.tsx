import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface RtmpUrl {
  id: number;
  name: string;
  url: string;
  videoFile?: File;
  audioFile?: File;
}

interface Profile {
  id: number;
  name: string;
  rtmpUrls: RtmpUrl[];
}

export const StreamProfile = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [isNewProfileDialogOpen, setIsNewProfileDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isNewRtmpDialogOpen, setIsNewRtmpDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newRtmpData, setNewRtmpData] = useState({ name: '', url: '' });
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

  const handleAddRtmpUrl = () => {
    if (!selectedProfile || !newRtmpData.name || !newRtmpData.url) return;
    
    setProfiles(profiles.map(profile => {
      if (profile.id === selectedProfile) {
        return {
          ...profile,
          rtmpUrls: [...profile.rtmpUrls, {
            id: Date.now(),
            name: newRtmpData.name,
            url: newRtmpData.url
          }]
        };
      }
      return profile;
    }));
    
    setNewRtmpData({ name: '', url: '' });
    setIsNewRtmpDialogOpen(false);
    toast({
      title: "RTMP Added",
      description: "New RTMP endpoint has been added to the profile."
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
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsNewProfileDialogOpen(true)}>
                <PlusIcon className="h-4 w-4" />
              </Button>
              {selectedProfile && (
                <Button variant="ghost" size="icon" onClick={() => setIsEditProfileDialogOpen(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
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
                RTMP Endpoints
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsNewRtmpDialogOpen(true)}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profiles.find(p => p.id === selectedProfile)?.rtmpUrls.map((rtmp) => (
              <div key={rtmp.id} className="p-4 bg-zinc-800 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-zinc-100">{rtmp.name}</h3>
                </div>
                <p className="text-sm text-zinc-400">{rtmp.url}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* New Profile Dialog */}
      <Dialog open={isNewProfileDialogOpen} onOpenChange={setIsNewProfileDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Create New Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-zinc-200">Profile Name</Label>
              <Input
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Enter profile name"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsNewProfileDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProfile}>Create Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-zinc-200">Profile Name</Label>
              <Input
                value={profiles.find(p => p.id === selectedProfile)?.name || ''}
                onChange={(e) => {
                  setProfiles(profiles.map(p => 
                    p.id === selectedProfile ? { ...p, name: e.target.value } : p
                  ));
                }}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => selectedProfile && handleDeleteProfile(selectedProfile)}
            >
              Delete Profile
            </Button>
            <Button onClick={() => setIsEditProfileDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New RTMP Dialog */}
      <Dialog open={isNewRtmpDialogOpen} onOpenChange={setIsNewRtmpDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Add RTMP Endpoint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-zinc-200">Name</Label>
              <Input
                value={newRtmpData.name}
                onChange={(e) => setNewRtmpData({ ...newRtmpData, name: e.target.value })}
                placeholder="Enter RTMP name"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">RTMP URL</Label>
              <Input
                value={newRtmpData.url}
                onChange={(e) => setNewRtmpData({ ...newRtmpData, url: e.target.value })}
                placeholder="Enter RTMP URL"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Video File (Optional)</Label>
              <Input
                type="file"
                accept="video/*"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Audio File (Optional)</Label>
              <Input
                type="file"
                accept="audio/*"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsNewRtmpDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRtmpUrl}>Add RTMP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};