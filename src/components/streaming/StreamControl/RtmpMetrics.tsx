import { ArrowBigUp, Users, Signal, AlertCircle, Clock, HardDrive } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RtmpMetricsProps {
  totalSpeed: number;
  activeStreamsCount: number;
  averageFps: number;
  totalDroppedFrames: number;
  uptime: string;
}

export const RtmpMetrics = ({
  totalSpeed,
  activeStreamsCount,
  averageFps,
  totalDroppedFrames,
  uptime
}: RtmpMetricsProps) => {
  const getHealthStatus = () => {
    if (totalDroppedFrames > 100) return "error";
    if (totalDroppedFrames > 50) return "warning";
    return "good";
  };

  const getHealthColor = () => {
    switch (getHealthStatus()) {
      case "error":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      default:
        return "text-emerald-500";
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowBigUp className="h-5 w-5 text-blue-400" />
                  <span className="text-zinc-400">Total Speed</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {totalSpeed} kbps
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total streaming speed across all endpoints</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-emerald-400" />
                  <span className="text-zinc-400">Active Streams</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  {activeStreamsCount}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Number of active streaming endpoints</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Signal className="h-5 w-5 text-purple-400" />
                  <span className="text-zinc-400">Average FPS</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {averageFps.toFixed(1)}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Average frames per second across all endpoints</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={`h-5 w-5 ${getHealthColor()}`} />
                  <span className="text-zinc-400">Dropped Frames</span>
                </div>
                <div className={`text-2xl font-bold ${getHealthColor()}`}>
                  {totalDroppedFrames}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total dropped frames across all endpoints</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <span className="text-zinc-400">Uptime</span>
                </div>
                <div className="text-xl font-semibold text-amber-400">{uptime}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total streaming duration</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-5 w-5 text-cyan-400" />
                  <span className="text-zinc-400">Storage Usage</span>
                </div>
                <div className="text-xl font-semibold text-cyan-400">
                  0 MB
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Storage usage for media files</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};