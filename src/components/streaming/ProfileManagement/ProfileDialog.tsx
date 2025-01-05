import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  onDelete?: () => void;
  title: string;
  initialName?: string;
  showDelete?: boolean;
}

export const ProfileDialog = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  title, 
  initialName = '', 
  showDelete = false 
}: ProfileDialogProps) => {
  const [name, setName] = useState(initialName);
  const { toast } = useToast();

  // Dialog kapanırken formu sıfırla
  useEffect(() => {
    if (!isOpen) {
      setName('');
    }
  }, [isOpen]);

  // initialName değiştiğinde form verilerini güncelle
  useEffect(() => {
    if (initialName) {
      setName(initialName);
    }
  }, [initialName]);

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Profile name is required.",
        variant: "destructive"
      });
      return;
    }
    onSave(name);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">{title}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {showDelete ? 'Edit your streaming profile.' : 'Create a new streaming profile.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-zinc-200">Profile Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter profile name"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          {showDelete && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="mr-auto"
            >
              Delete Profile
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleSave}
              disabled={!name.trim()}
            >
              {showDelete ? 'Save Changes' : 'Create Profile'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};