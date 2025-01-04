import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Video, Music, Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const InputSettings = () => {
  const [separateAudio, setSeparateAudio] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (type: 'video' | 'audio') => {
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} File Selected`,
      description: `Your ${type} file has been selected successfully.`
    });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
          <Video className="w-5 h-5 text-zinc-400" />
          Input Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TooltipProvider>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <Video className="w-4 h-4 text-zinc-400" />
                Video Input
              </Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="video/*"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 file:bg-zinc-700 file:text-zinc-100 file:border-0 
                    file:mr-2 hover:bg-zinc-800/70 transition-colors file:hover:bg-zinc-600"
                  onChange={() => handleFileUpload('video')}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" size="icon" className="hover:bg-zinc-700">
                      <Upload className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload Video File</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={separateAudio}
                onCheckedChange={setSeparateAudio}
                className="data-[state=checked]:bg-emerald-500"
              />
              <Label className="text-zinc-200 flex items-center gap-2">
                <Music className="w-4 h-4 text-zinc-400" />
                Use separate audio file
              </Label>
            </div>

            {separateAudio && (
              <div className="space-y-2 animate-fade-in">
                <Label className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                  <Music className="w-4 h-4 text-zinc-400" />
                  Audio Input
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="audio/*"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 file:bg-zinc-700 file:text-zinc-100 file:border-0 
                      file:mr-2 hover:bg-zinc-800/70 transition-colors file:hover:bg-zinc-600"
                    onChange={() => handleFileUpload('audio')}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="secondary" size="icon" className="hover:bg-zinc-700">
                        <Upload className="h-4 w-4 text-zinc-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload Audio File</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>

          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2
              transition-colors"
            onClick={() => toast({
              title: "Settings Saved",
              description: "Your input settings have been saved successfully."
            })}
          >
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};