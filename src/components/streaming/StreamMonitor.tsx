import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";

export const StreamMonitor = () => {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Stream Monitor
          </CardTitle>
          <Badge variant="outline" className="bg-zinc-800">Offline</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
          <VideoIcon className="w-12 h-12 text-zinc-600" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-zinc-400">Duration</p>
            <p className="text-zinc-100">00:00:00</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Bitrate</p>
            <p className="text-zinc-100">0 kb/s</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Video Format</p>
            <p className="text-zinc-100">H.264/MP4</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Audio Format</p>
            <p className="text-zinc-100">AAC</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};