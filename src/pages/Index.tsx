import { useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { VideoIcon, GearIcon } from "@radix-ui/react-icons";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StreamingForm } from "@/components/streaming/StreamingForm";
import { StreamControlProfile } from "@/components/streaming/StreamControl/StreamProfile";
import { ServerMonitor } from "@/components/streaming/ServerStatus/ServerMonitor";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'control' | 'server'>('profile');
  const { toast } = useToast();

  const handleTabChange = (tab: 'profile' | 'control' | 'server') => {
    setActiveTab(tab);
    const messages = {
      profile: 'Profile management active',
      control: 'Stream control active',
      server: 'Server monitoring active'
    };
    
    toast({
      title: "Tab Changed",
      description: messages[tab],
    });
  };

  return (
    <div className="flex h-screen bg-zinc-950">
      <NavigationMenu.Root className="w-16 border-r border-zinc-800 flex flex-col items-center py-4 gap-4">
        <NavigationMenu.Item>
          <Button 
            variant={activeTab === 'profile' ? "secondary" : "ghost"} 
            size="icon" 
            className="h-10 w-10"
            onClick={() => handleTabChange('profile')}
          >
            <GearIcon className="w-5 h-5 text-zinc-400" />
          </Button>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Button 
            variant={activeTab === 'control' ? "secondary" : "ghost"} 
            size="icon" 
            className="h-10 w-10"
            onClick={() => handleTabChange('control')}
          >
            <VideoIcon className="w-5 h-5 text-zinc-400" />
          </Button>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Button 
            variant={activeTab === 'server' ? "secondary" : "ghost"} 
            size="icon" 
            className="h-10 w-10"
            onClick={() => handleTabChange('server')}
          >
            <Activity className="w-5 h-5 text-zinc-400" />
          </Button>
        </NavigationMenu.Item>
      </NavigationMenu.Root>

      <div className="flex-1 overflow-auto">
        {activeTab === 'profile' && <StreamingForm />}
        {activeTab === 'control' && <StreamControlProfile />}
        {activeTab === 'server' && <ServerMonitor />}
      </div>
    </div>
  );
};

export default Index;