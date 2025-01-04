import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Play, Pause, ArrowBigUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RtmpEndpointList } from "./RtmpEndpointList";
import type { StreamProfile } from "./types";

interface ProfileCardProps {
  profile: StreamProfile;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onToggleStream: (id: number) => void;
  onToggleEndpointStream: (profileId: number, endpointId: number) => void;
  onShowLogs: (name: string) => void;
}

export const ProfileCard = ({
  profile,
  isExpanded,
  onToggleExpand,
  onToggleStream,
  onToggleEndpointStream,
  onShowLogs
}: ProfileCardProps) => {
  const activeStreamsCount = profile.rtmpEndpoints.filter(endpoint => endpoint.isActive).length;

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-zinc-100">{profile.name}</h3>
          <Badge variant={profile.isActive ? "default" : "secondary"} className="animate-pulse">
            {profile.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onToggleStream(profile.id)}
            className={profile.isActive ? 
              "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/50" : 
              "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/50"}
          >
            {profile.isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {profile.isActive ? "Stop" : "Start"}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onToggleExpand(profile.id)}
            className="hover:bg-zinc-800"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <div className="flex items-center gap-2 mb-2">
              <ArrowBigUp className="h-5 w-5 text-blue-400" />
              <span className="text-zinc-400">Total Speed</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {profile.totalSpeed} kbps
            </div>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <span className="text-zinc-400">Active Streams</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {activeStreamsCount}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <RtmpEndpointList 
              endpoints={profile.rtmpEndpoints}
              profileId={profile.id}
              onToggleStream={onToggleEndpointStream}
              onShowLogs={onShowLogs}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};