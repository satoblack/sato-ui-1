import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Pencil, Trash2, Youtube, Twitch, Video } from "lucide-react";

interface RtmpUrl {
  id: number;
  name: string;
  url: string;
  icon: string;
}

interface RtmpListProps {
  rtmpUrls: RtmpUrl[];
  onNewRtmp: () => void;
  onEditRtmp?: (rtmp: RtmpUrl) => void;
  onDeleteRtmp?: (id: number) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'youtube':
      return <Youtube className="h-5 w-5 text-red-500" />;
    case 'twitch':
      return <Twitch className="h-5 w-5 text-purple-500" />;
    case 'kick':
      return <Video className="h-5 w-5 text-green-500" />;
    default:
      return <Video className="h-5 w-5 text-gray-500" />;
  }
};

export const RtmpList = ({ rtmpUrls, onNewRtmp, onEditRtmp, onDeleteRtmp }: RtmpListProps) => {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-zinc-100">
            RTMP Endpoints
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNewRtmp}
            className="hover:bg-zinc-800"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {rtmpUrls.map((rtmp) => (
            <div 
              key={rtmp.id} 
              className="p-4 bg-zinc-800 rounded-lg space-y-2 hover:bg-zinc-700/50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getIcon(rtmp.icon)}
                  <h3 className="font-medium text-zinc-100">{rtmp.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {onEditRtmp && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditRtmp(rtmp)}
                      className="hover:bg-zinc-600"
                    >
                      <Pencil className="h-4 w-4 text-zinc-400" />
                    </Button>
                  )}
                  {onDeleteRtmp && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDeleteRtmp(rtmp.id)}
                      className="hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-zinc-400 font-mono break-all">{rtmp.url}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};