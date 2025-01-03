import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlayIcon, Square } from "lucide-react";

export const StreamControls = () => {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-zinc-100">
          Stream Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">
            RTMP URL
          </label>
          <Input
            placeholder="rtmp://your-streaming-url"
            className="bg-zinc-800 border-zinc-700 text-zinc-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">
            Stream Key
          </label>
          <Input
            type="password"
            placeholder="Enter your stream key"
            className="bg-zinc-800 border-zinc-700 text-zinc-100"
          />
        </div>
        <div className="flex gap-2">
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            <PlayIcon className="w-4 h-4 mr-2" />
            Start Stream
          </Button>
          <Button variant="destructive" className="flex-1">
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};