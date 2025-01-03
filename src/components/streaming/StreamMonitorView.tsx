import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoIcon, Waveform, Signal, Clock, Activity, Cpu } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const StreamMonitorView = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Stream Preview */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-zinc-100">
              Stream Preview
            </CardTitle>
            <Badge variant="outline" className="bg-zinc-800">Offline</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <VideoIcon className="w-12 h-12 text-zinc-600" />
          </div>
        </CardContent>
      </Card>

      {/* Stream Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stream Information */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-zinc-100">
              Stream Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-400">Duration</p>
                  <p className="text-zinc-100">00:00:00</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-400">Bitrate</p>
                  <p className="text-zinc-100">0 kb/s</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <VideoIcon className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-400">Video Format</p>
                  <p className="text-zinc-100">H.264/MP4</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Waveform className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-400">Audio Format</p>
                  <p className="text-zinc-100">AAC</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Stats */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-zinc-100">
              Technical Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Signal className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-400">Frame Rate</p>
                  <p className="text-zinc-100">0 fps</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-400">CPU Usage</p>
                  <p className="text-zinc-100">0%</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Dropped Frames</p>
                <p className="text-zinc-100">0 (0%)</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Buffer Size</p>
                <p className="text-zinc-100">0 KB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stream Logs */}
        <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-zinc-100">
              Stream Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4 h-48 overflow-auto font-mono text-sm text-zinc-400">
              <p>Waiting for stream logs...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};