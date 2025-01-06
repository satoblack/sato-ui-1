import { 
  ArrowBigUp, Users, Signal, AlertCircle, Clock, 
  Wifi, Gauge, Server, Activity, Eye, Timer,
  Database, Shield, Zap, Radio
} from "lucide-react";
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
          <MetricCard
            icon={<ArrowBigUp className="text-blue-400" />}
            label="Total Speed"
            value={`${totalSpeed} kbps`}
            tooltip="Total streaming speed across all endpoints"
            valueColor="text-blue-400"
          />
          <MetricCard
            icon={<Users className="text-emerald-400" />}
            label="Active Streams"
            value={activeStreamsCount.toString()}
            tooltip="Number of active streaming endpoints"
            valueColor="text-emerald-400"
          />
          <MetricCard
            icon={<Signal className="text-purple-400" />}
            label="Average FPS"
            value={averageFps.toFixed(1)}
            tooltip="Average frames per second across all endpoints"
            valueColor="text-purple-400"
          />
          <MetricCard
            icon={<AlertCircle className={getHealthColor()} />}
            label="Dropped Frames"
            value={totalDroppedFrames.toString()}
            tooltip="Total dropped frames across all endpoints"
            valueColor={getHealthColor()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={<Clock className="text-amber-400" />}
            label="Uptime"
            value={uptime}
            tooltip="Total streaming duration"
            valueColor="text-amber-400"
          />
          <MetricCard
            icon={<Wifi className="text-cyan-400" />}
            label="Network Status"
            value="Stable"
            tooltip="Current network connection status"
            valueColor="text-cyan-400"
          />
          <MetricCard
            icon={<Server className="text-indigo-400" />}
            label="Server Load"
            value="45%"
            tooltip="Current server resource usage"
            valueColor="text-indigo-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={<Gauge className="text-rose-400" />}
            label="CPU Usage"
            value="32%"
            tooltip="Current CPU utilization"
            valueColor="text-rose-400"
          />
          <MetricCard
            icon={<Activity className="text-teal-400" />}
            label="Stream Health"
            value="Good"
            tooltip="Overall stream health status"
            valueColor="text-teal-400"
          />
          <MetricCard
            icon={<Eye className="text-violet-400" />}
            label="Viewers"
            value="1.2K"
            tooltip="Current total viewers"
            valueColor="text-violet-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={<Timer className="text-orange-400" />}
            label="Latency"
            value="2.3s"
            tooltip="Current stream latency"
            valueColor="text-orange-400"
          />
          <MetricCard
            icon={<Database className="text-sky-400" />}
            label="Storage"
            value="45 GB"
            tooltip="Total storage used"
            valueColor="text-sky-400"
          />
          <MetricCard
            icon={<Radio className="text-pink-400" />}
            label="Bandwidth"
            value="8.5 Mbps"
            tooltip="Current bandwidth usage"
            valueColor="text-pink-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            icon={<Shield className="text-lime-400" />}
            label="Backup Status"
            value="Ready"
            tooltip="Backup stream status"
            valueColor="text-lime-400"
          />
          <MetricCard
            icon={<Zap className="text-yellow-400" />}
            label="Transcoding"
            value="Active"
            tooltip="Transcoding status"
            valueColor="text-yellow-400"
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  tooltip: string;
  valueColor: string;
}

const MetricCard = ({ icon, label, value, tooltip, valueColor }: MetricCardProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
        <div className="flex items-center gap-2 mb-2">
          {React.cloneElement(icon as React.ReactElement, { className: `h-5 w-5 ${(icon as React.ReactElement).props.className}` })}
          <span className="text-zinc-400">{label}</span>
        </div>
        <div className={`text-xl font-semibold ${valueColor}`}>
          {value}
        </div>
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);