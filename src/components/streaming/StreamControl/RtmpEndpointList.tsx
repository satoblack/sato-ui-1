import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, FileText } from "lucide-react";
import type { RtmpEndpoint } from "./types";

interface RtmpEndpointListProps {
  endpoints: RtmpEndpoint[];
  profileId: number;
  onToggleStream: (profileId: number, endpointId: number) => void;
  onShowLogs: (name: string) => void;
}

const getHealthColor = (health: 'good' | 'warning' | 'error') => {
  switch (health) {
    case 'good':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const RtmpEndpointList = ({
  endpoints,
  profileId,
  onToggleStream,
  onShowLogs
}: RtmpEndpointListProps) => {
  return (
    <>
      {endpoints.map((endpoint) => (
        <div
          key={endpoint.id}
          className="p-4 bg-zinc-800 rounded-lg space-y-3 hover:bg-zinc-700/50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-zinc-100">{endpoint.name}</h4>
                <div className={`w-2 h-2 rounded-full ${getHealthColor(endpoint.health)}`} />
              </div>
              <p className="text-sm text-zinc-400 font-mono">{endpoint.url}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onShowLogs(endpoint.name)}
                className="hover:bg-zinc-700"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onToggleStream(profileId, endpoint.id)}
                className={endpoint.isActive ? "bg-red-500/10 hover:bg-red-500/20 text-red-500" : "bg-green-500/10 hover:bg-green-500/20 text-green-500"}
              >
                {endpoint.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">FPS</span>
                <span className="text-zinc-100">{endpoint.currentFps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Bitrate</span>
                <span className="text-zinc-100">{endpoint.bitrate}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Uptime</span>
                <span className="text-zinc-100">{endpoint.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Dropped Frames</span>
                <span className={`${endpoint.droppedFrames > 0 ? 'text-yellow-500' : 'text-zinc-100'}`}>
                  {endpoint.droppedFrames}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">Stream Health</span>
              <span className="text-zinc-100">
                {((endpoint.totalFrames - endpoint.droppedFrames) / endpoint.totalFrames * 100).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={((endpoint.totalFrames - endpoint.droppedFrames) / endpoint.totalFrames * 100)} 
              className="h-1.5"
            />
          </div>
        </div>
      ))}
    </>
  );
};