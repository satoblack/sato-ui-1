import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const InputSettings = () => {
  const [separateAudio, setSeparateAudio] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your input settings have been saved successfully."
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
            Video Input (.mp4)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Select video file"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
            <Button variant="secondary">Browse</Button>
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
              Audio Input (.aac)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Select audio file"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
              <Button variant="secondary">Browse</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">
            FFMPEG Preset
          </label>
          <Select>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="copy">Copy (No Transcoding)</SelectItem>
              <SelectItem value="veryfast">Very Fast</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};