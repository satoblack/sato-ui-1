import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const StreamProfile = () => {
  return (
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
            <SelectItem value="rtmp">RTMP Stream Profile</SelectItem>
            <SelectItem value="restream">Restream Profile</SelectItem>
            <SelectItem value="local">Local Recording Profile</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};