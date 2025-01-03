import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoIcon, MonitorIcon, Mic, Settings2Icon, PlusIcon, MinusIcon, PlayIcon, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const StreamingForm = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Stream Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Profile Selection */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold text-zinc-100">
                  Stream Profile
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue placeholder="Select profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">Gaming Profile</SelectItem>
                  <SelectItem value="webcam">Webcam Profile</SelectItem>
                  <SelectItem value="screen">Screen Share Profile</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Stream Settings */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-100">
                Stream Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">
                  Stream URL
                </label>
                <Input
                  placeholder="rtmp://your-streaming-url"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">
                  Stream Key
                </label>
                <Input
                  type="password"
                  placeholder="Enter your stream key"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Start Stream
                </Button>
                <Button variant="destructive" className="flex-1">
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stream Information */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-100">
                Stream Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Status</p>
                  <Badge variant="outline" className="mt-1 bg-zinc-800">Offline</Badge>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Duration</p>
                  <p className="text-zinc-100">00:00:00</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Bitrate</p>
                  <p className="text-zinc-100">0 kb/s</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">FPS</p>
                  <p className="text-zinc-100">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview and Settings */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Preview Window */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-zinc-100">
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <VideoIcon className="w-12 h-12 text-zinc-600" />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings Tabs */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <Tabs defaultValue="video">
                <TabsList className="bg-zinc-800">
                  <TabsTrigger value="video" className="data-[state=active]:bg-zinc-700">
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="data-[state=active]:bg-zinc-700">
                    <Mic className="w-4 h-4 mr-2" />
                    Audio
                  </TabsTrigger>
                  <TabsTrigger value="output" className="data-[state=active]:bg-zinc-700">
                    <Settings2Icon className="w-4 h-4 mr-2" />
                    Output
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="video" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">Video Device</label>
                      <Select>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select device" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="webcam1">Webcam 1</SelectItem>
                          <SelectItem value="webcam2">Webcam 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">Resolution</label>
                      <Select>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select resolution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1080p">1920x1080</SelectItem>
                          <SelectItem value="720p">1280x720</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="audio" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">Microphone</label>
                      <Select>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select microphone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mic1">Microphone 1</SelectItem>
                          <SelectItem value="mic2">Microphone 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">Audio Quality</label>
                      <Select>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High (320 kbps)</SelectItem>
                          <SelectItem value="medium">Medium (160 kbps)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="output" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">Output Quality</label>
                      <Select>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select quality preset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quality">Quality</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">Encoder</label>
                      <Select>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select encoder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="x264">x264</SelectItem>
                          <SelectItem value="nvenc">NVENC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};