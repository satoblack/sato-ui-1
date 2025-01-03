import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const StreamingForm = () => {
  const [streamKey, setStreamKey] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const { toast } = useToast();

  const handleStartStream = () => {
    if (!streamKey || !streamUrl) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Stream settings saved successfully",
    });
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto bg-zinc-900 border-zinc-800">
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
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
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
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <Button 
            onClick={handleStartStream}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Start Stream
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};