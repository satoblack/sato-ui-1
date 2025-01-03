import { useState } from "react";
import { StreamingForm } from "@/components/streaming/StreamingForm";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { VideoIcon, GearIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { MonitorIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'stream' | 'monitor' | 'settings'>('stream');
  const { toast } = useToast();

  const handleTabChange = (tab: 'stream' | 'monitor' | 'settings') => {
    setActiveTab(tab);
    const messages = {
      stream: 'Streaming management active',
      monitor: 'Monitor view active',
      settings: 'Settings view active'
    };
    
    toast({
      title: "Tab Changed",
      description: messages[tab],
    });
  };

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Left Menu */}
      <NavigationMenu.Root className="w-16 border-r border-zinc-800 flex flex-col items-center py-4 gap-4">
        <NavigationMenu.Item>
          <Button 
            variant={activeTab === 'stream' ? "secondary" : "ghost"} 
            size="icon" 
            className="h-10 w-10"
            onClick={() => handleTabChange('stream')}
          >
            <VideoIcon className="w-5 h-5 text-zinc-400" />
          </Button>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Button 
            variant={activeTab === 'monitor' ? "secondary" : "ghost"} 
            size="icon" 
            className="h-10 w-10"
            onClick={() => handleTabChange('monitor')}
          >
            <MonitorIcon className="w-5 h-5 text-zinc-400" />
          </Button>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Button 
            variant={activeTab === 'settings' ? "secondary" : "ghost"} 
            size="icon" 
            className="h-10 w-10"
            onClick={() => handleTabChange('settings')}
          >
            <GearIcon className="w-5 h-5 text-zinc-400" />
          </Button>
        </NavigationMenu.Item>
      </NavigationMenu.Root>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'stream' && <StreamingForm />}
        {activeTab === 'monitor' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Monitor</h2>
            {/* Monitor content will go here */}
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Settings</h2>
            {/* Settings content will go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;