import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Profile {
  id: number;
  name: string;
  rtmpUrls: any[];
}

interface ProfileListProps {
  profiles: Profile[];
  selectedProfile: number | null;
  onSelectProfile: (id: number) => void;
  onNewProfile: () => void;
  onEditProfile: () => void;
}

export const ProfileList = ({
  profiles,
  selectedProfile,
  onSelectProfile,
  onNewProfile,
  onEditProfile
}: ProfileListProps) => {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Stream Profiles
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNewProfile} 
              className="hover:bg-zinc-800 text-zinc-100"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
            {selectedProfile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onEditProfile} 
                className="hover:bg-zinc-800 text-zinc-100"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedProfile?.toString()} 
          onValueChange={(value) => onSelectProfile(Number(value))}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
            <SelectValue placeholder="Select profile" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {profiles.map(profile => (
              <SelectItem 
                key={profile.id} 
                value={profile.id.toString()}
                className="text-zinc-100 hover:bg-zinc-700"
              >
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};