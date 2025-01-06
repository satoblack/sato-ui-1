export interface RtmpEndpoint {
  id: number;
  name: string;
  url: string;
  speed: number;
  isActive: boolean;
  currentFps: number;
  bitrate: string;
  droppedFrames: number;
  totalFrames: number;
  uptime: string;
  health: 'good' | 'warning' | 'error';
  networkStatus?: 'stable' | 'unstable' | 'error';
  cpuUsage?: number;
  serverLoad?: number;
  streamQuality?: 'high' | 'medium' | 'low';
  bandwidth?: number;
  protocol?: string;
  region?: string;
}

export interface StreamProfile {
  id: number;
  name: string;
  totalSpeed: number;
  isActive: boolean;
  rtmpEndpoints: RtmpEndpoint[];
  createdAt?: string;
  lastActive?: string;
  description?: string;
  maxBitrate?: number;
  preferredServer?: string;
  settings?: {
    autoReconnect: boolean;
    lowLatencyMode: boolean;
    qualityPreset: string;
  };
}