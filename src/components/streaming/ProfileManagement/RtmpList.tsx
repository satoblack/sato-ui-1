import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Youtube, Twitch, Facebook, Video } from "lucide-react";

interface RtmpUrl {
  id: number;
  name: string;
  url: string;
  icon: string;
}

interface RtmpListProps {
  rtmpUrls: RtmpUrl[];
  onNewRtmp: () => void;
}

const getIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'youtube':
      return <Youtube className="h-5 w-5 text-red-500" />;
    case 'twitch':
      return <Twitch className="h-5 w-5 text-purple-500" />;
    case 'facebook':
      return <Facebook className="h-5 w-5 text-blue-500" />;
    default:
      return <Video className="h-5 w-5 text-gray-500" />;
  }
};

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
          <div key={rtmp.id} className="p-4 bg-zinc-800 rounded-lg space-y-2 hover:bg-zinc-700/50 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getIcon(rtmp.icon)}
                <h3 className="font-medium text-zinc-100">{rtmp.name}</h3>
              </div>
            </div>
            <p className="text-sm text-zinc-400 font-mono">{rtmp.url}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};