# Stream Control Theme Documentation

## Color Palette

### Background Colors
- Main Background: zinc-950 (#09090B)
- Card Background: zinc-800/50 (semi-transparent)
- Hover States: zinc-700/50 (semi-transparent)
- Border Colors: zinc-700/50 (semi-transparent)

### Text Colors
- Primary Text: zinc-100 (white-ish)
- Secondary Text: zinc-400 (light gray)
- Muted Text: zinc-300 (medium gray)
- Monospace Text: font-mono (for technical data)

### Status Colors
- Success/Good: emerald-400/500
- Warning: amber-400/500
- Error: red-400/500

## Icons
All icons are from the `lucide-react` package:
- `FileText`: Log viewer
- `Play`/`Pause`: Stream control
- `Activity`: Stream health/bitrate
- `Signal`: Connection status
- `Cpu`: FPS indicator
- `Clock`: Uptime display
- `AlertTriangle`: Warnings/errors

## Components

### RtmpEndpointList
Displays streaming endpoints with FFmpeg data in a modern, readable format:
- Stream status with health indicators
- Technical metrics (FPS, bitrate, uptime)
- Frame drop monitoring
- Progress bar for stream health
- Responsive layout (1 column on mobile, 2 columns on desktop)

### Interactive Elements
- Buttons use ghost/outline variants with hover states
- Tooltips provide additional context
- Progress bars indicate stream health with color coding
- Hover effects on cards for better interaction feedback

### Responsive Design
- Grid layout adapts to screen size
- Proper spacing and padding for all devices
- Font sizes remain readable on mobile
- Icon sizing optimized for touch targets

## Backend Integration Guidelines
The components are structured to easily integrate with backend services:

1. Stream Status:
```typescript
interface StreamStatus {
  health: 'good' | 'warning' | 'error';
  currentFps: number;
  bitrate: string;
  uptime: string;
  droppedFrames: number;
  totalFrames: number;
}
```

2. RTMP Endpoint:
```typescript
interface RtmpEndpoint {
  id: number;
  name: string;
  url: string;
  isActive: boolean;
  status: StreamStatus;
}
```

3. Event Handlers:
- `onToggleStream`: Handles stream start/stop
- `onShowLogs`: Displays stream logs
- Health calculations are performed client-side based on frame data

## Accessibility
- Color contrast meets WCAG guidelines
- Interactive elements have hover/focus states
- Icons include tooltips for context
- Semantic HTML structure
- Keyboard navigation support