import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

export const InputSettings = () => {
  const [separateAudio, setSeparateAudio] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (type: 'video' | 'audio') => {
    // File upload logic will be implemented here
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} File Selected`,
      description: `Your ${type} file has been selected successfully.`
    });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-zinc-100">
          Input Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">
            Video Input
          </label>
          <div className="flex gap-2">
            <Input
              type="file"
              accept="video/*"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 file:bg-zinc-700 file:text-zinc-100 file:border-0 file:mr-2"
              onChange={() => handleFileUpload('video')}
            />
            <Button variant="secondary" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={separateAudio}
            onCheckedChange={setSeparateAudio}
          />
          <Label className="text-zinc-200">Use separate audio file</Label>
        </div>

        {separateAudio && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">
              Audio Input
            </label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="audio/*"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 file:bg-zinc-700 file:text-zinc-100 file:border-0 file:mr-2"
                onChange={() => handleFileUpload('audio')}
              />
              <Button variant="secondary" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={() => toast({
            title: "Settings Saved",
            description: "Your input settings have been saved successfully."
          })}
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};