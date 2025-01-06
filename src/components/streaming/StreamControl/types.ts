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
  latency?: number;
  viewers?: number;
  peakViewers?: number;
  streamStartTime?: string;
  lastErrorTime?: string;
  lastErrorMessage?: string;
  transcoding?: {
    enabled: boolean;
    quality: string[];
    format: string;
  };
  backup?: {
    enabled: boolean;
    url: string;
    status: 'active' | 'standby' | 'error';
  };
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
    redundancy: boolean;
    errorRecovery: 'automatic' | 'manual';
    bandwidth: {
      limit: number;
      dynamic: boolean;
      priority: 'quality' | 'stability';
    };
    recording: {
      enabled: boolean;
      format: string;
      storage: string;
    };
    notifications: {
      onError: boolean;
      onWarning: boolean;
      onReconnect: boolean;
    };
  };
}