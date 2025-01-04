import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface RtmpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; url: string; videoFile?: File; audioFile?: File }) => void;
}

export const RtmpDialog = ({ isOpen, onClose, onSave }: RtmpDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    videoFile: undefined as File | undefined,
    audioFile: undefined as File | undefined
  });
  const { toast } = useToast();

  const handleSave = () => {
    if (!formData.name || !formData.url || !formData.videoFile || !formData.audioFile) {
      toast({
        title: "Validation Error",
        description: "All fields including video and audio files are required.",
        variant: "destructive"
      });
      return;
    }
    onSave(formData);
  };

  const handleFileUpload = (type: 'video' | 'audio', file?: File) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        [type === 'video' ? 'videoFile' : 'audioFile']: file
      }));
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} File Selected`,
        description: `${file.name} has been selected successfully.`
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Add RTMP Endpoint</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-zinc-200">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter RTMP name"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">RTMP URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Enter RTMP URL"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">Video File (Required)</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload('video', e.target.files?.[0])}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-200">Audio File (Required)</Label>
            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => handleFileUpload('audio', e.target.files?.[0])}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              required
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