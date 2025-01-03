import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export const StreamSettings = () => {
  return (
    <div className="p-6 space-y-6">
      {/* FFMPEG Settings */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            FFMPEG Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-200">FFMPEG Path</Label>
              <Input 
                placeholder="/usr/bin/ffmpeg" 
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Additional FFMPEG Arguments</Label>
              <Input 
                placeholder="-threads 4" 
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Settings */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Video Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-200">Video Codec</Label>
              <Select>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue placeholder="Select codec" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copy">Copy (No Transcoding)</SelectItem>
                  <SelectItem value="h264">H.264</SelectItem>
                  <SelectItem value="h265">H.265/HEVC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Frame Rate</Label>
              <Select>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue placeholder="Select FPS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="source">Source FPS</SelectItem>
                  <SelectItem value="30">30 FPS</SelectItem>
                  <SelectItem value="60">60 FPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-200">Hardware Acceleration</Label>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Video Bitrate (kb/s)</Label>
              <Slider defaultValue={[3000]} max={10000} step={100} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Audio Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-200">Audio Codec</Label>
              <Select>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue placeholder="Select codec" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copy">Copy (No Transcoding)</SelectItem>
                  <SelectItem value="aac">AAC</SelectItem>
                  <SelectItem value="mp3">MP3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Sample Rate</Label>
              <Select>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue placeholder="Select rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="44100">44.1 kHz</SelectItem>
                  <SelectItem value="48000">48 kHz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-200">Audio Bitrate (kb/s)</Label>
            <Slider defaultValue={[128]} max={320} step={32} />
          </div>
        </CardContent>
      </Card>

      {/* Buffer Settings */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Buffer Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-200">Buffer Size (KB)</Label>
              <Input 
                type="number" 
                placeholder="1024" 
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-200">Max Retry Count</Label>
              <Input 
                type="number" 
                placeholder="3" 
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          Save Settings
        </Button>
      </div>
    </div>
  );
};