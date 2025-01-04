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
}

export interface StreamProfile {
  id: number;
  name: string;
  totalSpeed: number;
  isActive: boolean;
  rtmpEndpoints: RtmpEndpoint[];
}