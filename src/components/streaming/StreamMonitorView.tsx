import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  VideoIcon, 
  AudioWaveform, 
  Signal, 
  Clock, 
  Activity, 
  Cpu, 
  AlertTriangle,
  Waves,
  Gauge,
  HardDrive
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const StreamMonitorView = () => {
  return (
    <div className="p-6 space-y-6">
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <VideoIcon className="w-5 h-5 text-zinc-400" />
              Stream Preview
            </CardTitle>
            <Badge 
              variant="outline" 
              className="bg-zinc-800 animate-pulse"
            >
              Offline
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center border border-zinc-800">
            <VideoIcon className="w-12 h-12 text-zinc-600" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-zinc-400" />
              Stream Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TooltipProvider>
              <div className="grid grid-cols-2 gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Duration</p>
                        <p className="text-zinc-100 font-mono">00:00:00</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Stream Duration</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                      <Activity className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Bitrate</p>
                        <p className="text-zinc-100 font-mono">0 kb/s</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current Bitrate</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                      <VideoIcon className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Video Format</p>
                        <p className="text-zinc-100 font-mono">H.264/MP4</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Video Encoding Format</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                      <AudioWaveform className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Audio Format</p>
                        <p className="text-zinc-100 font-mono">AAC</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Audio Encoding Format</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-zinc-400" />
              Technical Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TooltipProvider>
              <div className="grid grid-cols-2 gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                      <Signal className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Frame Rate</p>
                        <p className="text-zinc-100 font-mono">0 fps</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current Frame Rate</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                      <Cpu className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">CPU Usage</p>
                        <p className="text-zinc-100 font-mono">0%</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>CPU Resource Usage</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                      <AlertTriangle className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Dropped Frames</p>
                        <p className="text-zinc-100 font-mono">0 (0%)</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of Dropped Frames</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                      <HardDrive className="w-4 h-4 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Buffer Size</p>
                        <p className="text-zinc-100 font-mono">0 KB</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current Buffer Size</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <Waves className="w-5 h-5 text-zinc-400" />
              Stream Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-zinc-950 rounded-lg p-4 h-48 overflow-auto font-mono text-sm text-zinc-400 border border-zinc-800">
              <p>Waiting for stream logs...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};