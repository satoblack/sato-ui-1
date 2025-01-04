import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RtmpUrl {
  id: number;
  name: string;
  url: string;
}

interface RtmpListProps {
  rtmpUrls: RtmpUrl[];
  onNewRtmp: () => void;
}

export const RtmpList = ({ rtmpUrls, onNewRtmp }: RtmpListProps) => {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-zinc-100">
            RTMP Endpoints
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onNewRtmp}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rtmpUrls.map((rtmp) => (
          <div key={rtmp.id} className="p-4 bg-zinc-800 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-zinc-100">{rtmp.name}</h3>
            </div>
            <p className="text-sm text-zinc-400">{rtmp.url}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};