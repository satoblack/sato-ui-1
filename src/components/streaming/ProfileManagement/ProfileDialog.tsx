import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  title: string;
  initialName?: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

export const ProfileDialog = ({
  isOpen,
  onClose,
  onSave,
  title,
  initialName = '',
  showDelete,
  onDelete
}: ProfileDialogProps) => {
  const [name, setName] = React.useState(initialName);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">{title}</DialogTitle>
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
            <Button variant="destructive" onClick={onDelete}>
              Delete Profile
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSave(name)}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};