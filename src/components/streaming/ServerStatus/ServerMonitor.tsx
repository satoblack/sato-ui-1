import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Cpu, HardDrive, Database } from "lucide-react";

interface ServerMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: string;
  activeStreams: number;
}

const sampleMetrics: ServerMetrics = {
  cpuUsage: 45,
  memoryUsage: 60,
  diskUsage: 75,
  uptime: "5d 12h 30m",
  activeStreams: 2,
};

export const ServerMonitor = () => {
  return (
    <div className="space-y-6 p-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Server Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={<Cpu className="h-5 w-5" />}
              title="CPU Usage"
              value={`${sampleMetrics.cpuUsage}%`}
              status={sampleMetrics.cpuUsage > 80 ? 'error' : 'good'}
            />
            <MetricCard
              icon={<Database className="h-5 w-5" />}
              title="Memory Usage"
              value={`${sampleMetrics.memoryUsage}%`}
              status={sampleMetrics.memoryUsage > 80 ? 'error' : 'good'}
            />
            <MetricCard
              icon={<HardDrive className="h-5 w-5" />}
              title="Disk Usage"
              value={`${sampleMetrics.diskUsage}%`}
              status={sampleMetrics.diskUsage > 90 ? 'error' : 'good'}
            />
            <MetricCard
              icon={<Activity className="h-5 w-5" />}
              title="Active Streams"
              value={sampleMetrics.activeStreams.toString()}
              status="info"
            />
          </div>
          <div className="mt-6">
            <div className="text-sm text-zinc-400">Server Uptime</div>
            <div className="text-xl font-semibold text-zinc-100">{sampleMetrics.uptime}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  status: 'good' | 'warning' | 'error' | 'info';
}

const MetricCard = ({ icon, title, value, status }: MetricCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-zinc-100';
    }
  };

  return (
    <div className="p-4 bg-zinc-800 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className={getStatusColor()}>{icon}</span>
        <span className="text-zinc-400">{title}</span>
      </div>
      <div className={`text-2xl font-bold ${getStatusColor()}`}>{value}</div>
    </div>
  );
};