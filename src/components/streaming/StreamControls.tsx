import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlayIcon, Square, Link2, Key, Settings2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

export const StreamControls = () => {
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-zinc-400" />
          Stream Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TooltipProvider>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-zinc-400" />
                RTMP URL
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    placeholder="rtmp://your-streaming-url"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500
                      hover:bg-zinc-800/70 transition-colors"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enter your RTMP streaming URL</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <Key className="w-4 h-4 text-zinc-400" />
                Stream Key
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    type="password"
                    placeholder="Enter your stream key"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500
                      hover:bg-zinc-800/70 transition-colors"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enter your secure stream key</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Start Stream
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start streaming to RTMP server</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" className="flex-1 hover:bg-red-600 transition-colors">
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stop current stream</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};