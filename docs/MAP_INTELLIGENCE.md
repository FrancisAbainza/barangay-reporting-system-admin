# Map Intelligence Feature

## Overview
The Map Intelligence page provides geographic visualization and analysis of complaints and projects across the barangay. It features an interactive Google Maps interface with markers showing the locations of reported issues and ongoing development initiatives.

## Features

### Two Main Tabs
1. **Complaints Tab**: Displays all submitted complaints with location data
2. **Transparency Tab**: Shows all infrastructure and development projects

### Interactive Map Display
- **Dynamic Markers**: Color-coded markers indicating different statuses and priorities
- **Info Windows**: Click on markers to view detailed information including:
  - Title and description
  - Status and priority/progress
  - Category
  - Location address
  - Date information
  - Budget (for projects)
  
### Filtering System
Users can filter displayed items by:
- **Search Query**: Text search through titles and descriptions
- **Status**: Multiple status selection (submitted, ongoing, completed, etc.)
- **Category**: Filter by complaint/project category
- **Priority**: (Complaints only) Filter by urgency level (low, medium, high, urgent)

### Statistics Dashboard
Real-time stats displayed at the top of each tab:
- **Complaints Tab**:
  - Total locations marked
  - Urgent issues count
  - Pending complaints
  - Resolved complaints
  
- **Transparency Tab**:
  - Total projects
  - Ongoing projects
  - Completed projects
  - Total budget

### Map Legends
Visual guides showing:
- **Complaints**: Color coding by priority (red = urgent, orange = high, yellow = medium, green = low)
- **Projects**: Color coding by status with distinct arrow markers

## Technical Implementation

### Components Structure
```
map-intelligence/
├── page.tsx                    # Main page with tabs and state management
└── components/
    ├── map-display.tsx        # Google Maps integration with markers
    ├── map-filters.tsx        # Filter controls
    └── map-stats.tsx          # Statistics cards
```

### Key Technologies
- **Google Maps API**: For map rendering and marker placement
- **@react-google-maps/api**: React wrapper for Google Maps
- **React Context**: For accessing complaint and project data
- **TypeScript**: Full type safety across components

### Data Flow
1. Data is fetched from ComplaintDbContext and ProjectDbContext
2. Filters are applied using useMemo for performance
3. Filtered data is passed to MapDisplay component
4. Markers are rendered based on location data
5. Statistics are calculated from filtered datasets

## Usage

### Setting up Google Maps API
1. Obtain a Google Maps API key from Google Cloud Console
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API

### Viewing the Map
1. Navigate to `/admin-dashboard/map-intelligence`
2. Select either "Complaints" or "Transparency" tab
3. Use filters to narrow down displayed items
4. Click markers to view detailed information
5. Use map controls to zoom and pan

### Adding Location Data
Complaints and projects must have location data (latitude, longitude, address) to appear on the map. Items without location information are automatically filtered out.

## Future Enhancements
- Heat map visualization for complaint density
- Route planning for field visits
- Clustering markers in dense areas
- Export map data as reports
- Comparison view (side-by-side complaints and projects)
- Time-based animation showing progress over time
