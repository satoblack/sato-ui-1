# Streaming Components Theme Documentation

## Color Palette

### Background Colors
- Main Background: zinc-950 (#09090B)
- Card Background: zinc-900 (#18181B)
- Secondary Background: zinc-800 (#27272A)
- Hover States: zinc-800/70 (semi-transparent)
- Input Background: zinc-800 (#27272A)

### Text Colors
- Primary Text: zinc-100 (white-ish)
- Secondary Text: zinc-400 (light gray)
- Label Text: zinc-200 (medium gray)
- Placeholder Text: zinc-500 (darker gray)

### Status Colors
- Success/Start: emerald-600/700
- Error/Stop: red-500/600
- Warning: amber-500
- Info: blue-500

## Component Structure

### StreamMonitorView
- Stream preview with offline/online status
- Technical metrics with tooltips
- Real-time statistics display
- Log viewer with monospace font

### InputSettings
- File upload interface
- Toggle switches for audio settings
- Save functionality with success feedback
- Tooltips for additional information

### StreamControls
- RTMP URL and Stream Key inputs
- Start/Stop streaming buttons
- Visual feedback for actions
- Secure password field for stream key

## Icons and Visual Elements

### Icon Usage
- All icons from lucide-react
- Consistent sizing (w-4 h-4 for content, w-5 h-5 for headers)
- Semantic icon choices for better UX
- Color-coded icons for status indication

### Interactive Elements
- Hover states for all clickable elements
- Tooltips for additional context
- Animated transitions for smooth UX
- Progress indicators where applicable

## Responsive Design

### Layout
- Grid system for larger screens
- Stack layout for mobile devices
- Flexible card components
- Proper spacing and padding

### Typography
- Monospace font for technical data
- Clear hierarchy with consistent sizing
- Good contrast ratios for readability
- Responsive font sizes

## Animation Guidelines

### Transitions
- Color transitions: transition-colors
- Smooth hover effects
- Fade animations for appearing elements
- Loading states with animation

## Best Practices

### Accessibility
- Clear focus states
- Proper ARIA labels
- Sufficient color contrast
- Keyboard navigation support

### Performance
- Optimized rendering
- Efficient state updates
- Minimal layout shifts
- Proper error handling

## Backend Integration

### Data Structure
```typescript
interface StreamStats {
  fps: number;
  bitrate: string;
  uptime: string;
  droppedFrames: number;
  cpuUsage: number;
  bufferSize: number;
  health: 'good' | 'warning' | 'error';
}

interface StreamSettings {
  rtmpUrl: string;
  streamKey: string;
  videoInput: File | null;
  audioInput: File | null;
  separateAudio: boolean;
}
```

### API Integration Points
- Stream status monitoring
- Settings management
- File upload handling
- Real-time metrics updates