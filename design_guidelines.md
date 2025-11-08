# AgroMind Design Guidelines

## Design Approach

**Design System: Material Design + Linear Typography**

**Justification:** AgroMind is a utility-focused, data-intensive agricultural management platform requiring clarity, reliability, and accessibility for users with varying digital literacy. Material Design's proven patterns for data visualization combined with Linear's clean typography hierarchy ensures professional functionality while maintaining approachability.

## Core Design Principles

1. **Clarity Over Decoration** - Every element serves a functional purpose
2. **Glanceable Information** - Critical data visible without scrolling or clicking
3. **Progressive Disclosure** - Simple surface, detailed data on demand
4. **Mobile-First Reliability** - Field workers need mobile access

---

## Typography

**Font Stack:** Inter (primary), Roboto Mono (data/metrics)

**Hierarchy:**
- Page Titles: `text-3xl font-bold` (36px)
- Section Headers: `text-2xl font-semibold` (24px)
- Card Titles: `text-lg font-semibold` (18px)
- Body Text: `text-base` (16px)
- Labels/Meta: `text-sm` (14px)
- Data/Metrics: `text-xl font-mono font-semibold` (20px monospace)

---

## Layout System

**Spacing Units:** Tailwind 4, 6, 8, 12, 16 units
- Component padding: `p-6` (24px)
- Section gaps: `gap-8` (32px)
- Card spacing: `space-y-4` (16px)
- Tight groups: `gap-2` (8px)

**Grid Structure:**
- Dashboard: `grid grid-cols-12 gap-6`
- Cards: 3-column on desktop `lg:grid-cols-3`, 1-column mobile
- Data panels: 2-column split `md:grid-cols-2`

**Container:** `max-w-7xl mx-auto px-6`

---

## Component Library

### Navigation
**Top Bar (Fixed):**
- Logo/Brand left, user profile + notifications right
- Height: `h-16`, shadow: `shadow-sm`
- Weather alert banner below when active (dismissible)

**Sidebar (Dashboard):**
- Width: `w-64`, collapsible to icons on mobile
- Navigation items: icon + label, `py-3 px-4`
- Active state: filled background, semibold text

### Dashboard Layout

**Hero Section (Weather Overview):**
- Full-width banner with current conditions
- Large temperature display (`text-5xl font-mono`)
- 4-column grid: temp, humidity, wind, precipitation
- Height: `min-h-[240px]`
- Alert badge overlays when risks detected

**Primary Dashboard:**
```
┌─────────────────────────────────────────┐
│  Weather Overview (full-width card)     │
├─────────────┬─────────────┬─────────────┤
│ Field Map   │ AI Chat     │ Quick Stats │
│ (col-span-7)│ (col-span-3)│ (col-span-2)│
├─────────────┴─────────────┴─────────────┤
│  Field Status Cards (3-column grid)     │
├─────────────────────────────────────────┤
│  Resource Tracking (responsive grid)    │
└─────────────────────────────────────────┘
```

### Cards

**Data Card Standard:**
- Border: `border rounded-lg`
- Padding: `p-6`
- Header: icon + title + action button
- Content: metrics or chart
- Shadow: `shadow-sm hover:shadow-md transition-shadow`

**Weather Alert Card:**
- Left border accent (4px)
- Icon badge (warning/info)
- Title + timestamp
- Recommendation text
- Dismiss button top-right

**Field Status Card:**
- Thumbnail image or NDVI visualization
- Field name + area (hectares)
- Status badge (healthy/warning/critical)
- 3-4 key metrics in grid
- "View Details" link

### Forms & Inputs

**Input Fields:**
- Height: `h-12`
- Border: `border rounded-lg`
- Focus ring: `focus:ring-2 focus:ring-offset-2`
- Label above: `text-sm font-medium mb-2`
- Helper text below: `text-sm`

**Buttons:**
- Primary: `px-6 py-3 rounded-lg font-semibold`
- Secondary: same with border variant
- Icon buttons: `w-10 h-10` square

**Select/Dropdowns:**
- Match input height, chevron icon right

### AI Chat Interface

**Layout:**
- Fixed height: `h-[500px]` with scroll
- Messages: alternating alignment (user right, AI left)
- User bubble: rounded corners except bottom-right
- AI bubble: rounded except bottom-left
- Avatar icons for AI responses
- Input bar: fixed bottom, `h-14` with send button

**Message Structure:**
- Timestamp: `text-xs` above message
- Text: `text-base`, max-width for readability
- Code blocks: monospace, bordered container

### Map Component

**Interactive Field Map:**
- Height: `h-[600px]` on desktop, `h-[400px]` mobile
- Rounded corners: `rounded-lg`
- Overlay controls: top-right (zoom, layers, location)
- Field polygons: clickable with tooltip on hover
- Legend: bottom-left corner

### Data Visualization

**Chart Cards:**
- Title + time range selector header
- Chart area: `h-[300px]`
- Use chart.js or recharts
- Gridlines: subtle, horizontal only
- Tooltips on hover with precise values

**Metric Displays:**
- Large number: `text-4xl font-mono font-bold`
- Label below: `text-sm uppercase tracking-wide`
- Trend indicator: small arrow + percentage
- Icon badge: circular, 40px diameter

**Status Indicators:**
- Dot badges: `w-3 h-3 rounded-full`
- Progress bars: `h-2 rounded-full` with filled portion
- Ring indicators for circular progress

### Alerts & Notifications

**Toast Notifications:**
- Position: top-right, stacked
- Width: `w-96` max
- Icon + message + close button
- Auto-dismiss after 5 seconds
- Types: success/warning/error/info

**Weather Alert Banner:**
- Full-width below nav
- Icon + alert text + recommended action
- Dismiss 'X' button right
- Height: auto, `py-4`

### Resource Tracking Tables

**Table Structure:**
- Striped rows for readability
- Header: `font-semibold`, sticky on scroll
- Cell padding: `px-4 py-3`
- Row hover: subtle background change
- Action buttons: right column, icon-only
- Mobile: stack as cards

### Authentication Pages

**Login/Register Layout:**
- Centered card: `max-w-md mx-auto`
- Logo + title at top
- Form fields with ample spacing
- Social login buttons if using Replit Auth
- Link to alternate form below

---

## Responsive Breakpoints

- Mobile: `< 768px` - single column, sidebar collapses
- Tablet: `768px - 1024px` - 2-column grids
- Desktop: `> 1024px` - full multi-column layouts

**Mobile Adjustments:**
- Reduce padding: `p-4` instead of `p-6`
- Stack map and chat vertically
- Bottom tab navigation instead of sidebar
- Larger touch targets: minimum `h-12`

---

## Images

**Weather Visualization:**
- Use weather condition icons (sunny, cloudy, rain) via Heroicons or custom weather icon set
- Field thumbnail images (aerial/satellite view) in field status cards
- NDVI heat map overlays on map component

**No large hero image** - this is a dashboard application focused on data and functionality. Visual impact comes from data visualization and interactive map, not decorative imagery.

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus indicators: visible ring on all interactive elements
- Icon buttons: include aria-labels
- Form validation: inline error messages
- Screen reader announcements for real-time alerts
- Keyboard navigation: tab order follows visual hierarchy