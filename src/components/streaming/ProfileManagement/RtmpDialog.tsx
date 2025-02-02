import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Youtube, Twitch, Video } from "lucide-react";

interface RtmpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; url: string; icon: string; videoFile?: File; audioFile?: File }) => void;
  initialData?: { name: string; url: string; icon: string };
}

const streamServices = [
  { value: 'youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4 text-red-500" /> },
  { value: 'twitch', label: 'Twitch', icon: <Twitch className="h-4 w-4 text-purple-500" /> },
  { value: 'kick', label: 'Kick', icon: <Video className="h-4 w-4 text-green-500" /> },
  { value: 'custom', label: 'Custom RTMP', icon: <Video className="h-4 w-4 text-gray-500" /> },
];

export const RtmpDialog = ({ isOpen, onClose, onSave, initialData }: RtmpDialogProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    url: initialData?.url || '',
    icon: initialData?.icon || '',
    videoFile: undefined as File | undefined,
    audioFile: undefined as File | undefined
  });
  const { toast } = useToast();

  const handleSave = () => {
    if (!formData.name || !formData.url || !formData.videoFile || !formData.audioFile || !formData.icon) {
      toast({
        title: "Validation Error",
        description: "All fields including video and audio files are required.",
        variant: "destructive"
      });
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Add RTMP Endpoint</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-zinc-200">Service Type</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, icon: value })}>
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter RTMP name"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">RTMP URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Enter RTMP URL"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">Video File (Required)</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setFormData({ ...formData, videoFile: e.target.files?.[0] })}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">Audio File (Required)</Label>
            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => setFormData({ ...formData, audioFile: e.target.files?.[0] })}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Add RTMP</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};