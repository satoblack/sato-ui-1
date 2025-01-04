import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Play, Pause, Activity, Signal, Cpu, Clock, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      return 'text-emerald-400';
    case 'warning':
      return 'text-amber-400';
    case 'error':
      return 'text-red-400';
    default:
      return 'text-zinc-400';
  }
};

const getHealthIcon = (health: 'good' | 'warning' | 'error') => {
  switch (health) {
    case 'good':
      return <Signal className="w-4 h-4 text-emerald-400" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'error':
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    default:
      return <Signal className="w-4 h-4 text-zinc-400" />;
  }
};

export const RtmpEndpointList = ({
  endpoints,
  profileId,
  onToggleStream,
  onShowLogs
}: RtmpEndpointListProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <div
            key={endpoint.id}
            className="p-4 bg-zinc-800/50 rounded-lg space-y-4 hover:bg-zinc-700/50 transition-colors border border-zinc-700/50"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-zinc-100">{endpoint.name}</h4>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {getHealthIcon(endpoint.health)}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stream Health: {endpoint.health}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-zinc-400 font-mono">{endpoint.url}</p>
              </div>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onShowLogs(endpoint.name)}
                      className="hover:bg-zinc-700 text-zinc-300"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Logs</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onToggleStream(profileId, endpoint.id)}
                      className={endpoint.isActive ? 
                        "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/50" : 
                        "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/50"}
                    >
                      {endpoint.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{endpoint.isActive ? "Stop Stream" : "Start Stream"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Cpu className="w-4 h-4" />
                  <span className="text-zinc-400">FPS:</span>
                  <span className="ml-auto font-mono">{endpoint.currentFps}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Activity className="w-4 h-4" />
                  <span className="text-zinc-400">Bitrate:</span>
                  <span className="ml-auto font-mono">{endpoint.bitrate}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-zinc-400">Uptime:</span>
                  <span className="ml-auto font-mono">{endpoint.uptime}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <AlertTriangle className={`w-4 h-4 ${endpoint.droppedFrames > 0 ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span className="text-zinc-400">Dropped:</span>
                  <span className={`ml-auto font-mono ${endpoint.droppedFrames > 0 ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {endpoint.droppedFrames}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-400">Stream Health</span>
                </div>
                <span className={`font-mono ${getHealthColor(endpoint.health)}`}>
                  {((endpoint.totalFrames - endpoint.droppedFrames) / endpoint.totalFrames * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={((endpoint.totalFrames - endpoint.droppedFrames) / endpoint.totalFrames * 100)} 
                className={`h-1.5 ${
                  endpoint.health === 'good' ? 'bg-emerald-950 [&>div]:bg-emerald-500' :
                  endpoint.health === 'warning' ? 'bg-amber-950 [&>div]:bg-amber-500' :
                  'bg-red-950 [&>div]:bg-red-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};