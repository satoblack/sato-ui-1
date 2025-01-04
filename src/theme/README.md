# Theme Documentation

## Color Palette
Our application uses a dark theme with carefully selected colors for maximum visibility:

### Background Colors
- Main Background: zinc-950 (#09090B)
- Card Background: zinc-900 (#18181B)
- Input Background: zinc-800 (#27272A)

### Text Colors
- Primary Text: zinc-100 (#F4F4F5)
- Secondary Text: zinc-400 (#A1A1AA)
- Muted Text: zinc-500 (#71717A)

### Accent Colors
- YouTube: red-500 (#EF4444)
- Twitch: purple-500 (#A855F7)
- Kick: green-500 (#22C55E)
- Custom RTMP: gray-500 (#6B7280)

### Interactive Elements
- Button Hover: Opacity transition for smooth interaction
- Card Hover: Slight background lightening effect
- Active States: Uses primary colors with increased opacity

## Component Structure
Components are organized for easy backend integration:

### Streaming
- ProfileManagement/: Contains all profile-related components
  - ProfileList.tsx: Displays and manages streaming profiles
  - RtmpList.tsx: Handles RTMP endpoint display and management
  - ProfileDialog.tsx: Profile creation/editing modal
  - RtmpDialog.tsx: RTMP endpoint creation/editing modal

### Future Backend Integration
Each component is structured with clear data interfaces and state management, making it easy to integrate with backend services:

1. Profile Management:
   - GET /api/profiles: Fetch user profiles
   - POST /api/profiles: Create new profile
   - PUT /api/profiles/:id: Update profile
   - DELETE /api/profiles/:id: Delete profile

2. RTMP Endpoints:
   - GET /api/profiles/:id/rtmp: Fetch RTMP endpoints
   - POST /api/profiles/:id/rtmp: Add new RTMP endpoint
   - PUT /api/profiles/:id/rtmp/:rtmpId: Update RTMP endpoint
   - DELETE /api/profiles/:id/rtmp/:rtmpId: Delete RTMP endpoint