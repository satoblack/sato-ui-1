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
      stream: 'Yayın yönetimi aktif',
      monitor: 'Monitör görünümü aktif',
      settings: 'Ayarlar görünümü aktif'
    };
    
    toast({
      title: "Sekme Değiştirildi",
      description: messages[tab],
    });
  };

  return (
    <div className="flex h-screen bg-zinc-950">
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

      <div className="flex-1 overflow-auto">
        {activeTab === 'stream' && <StreamingForm />}
        {activeTab === 'monitor' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Monitör</h2>
            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              <p className="text-zinc-400">Monitör görünümü henüz uygulanmadı</p>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Ayarlar</h2>
            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              <p className="text-zinc-400">Ayarlar görünümü henüz uygulanmadı</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;