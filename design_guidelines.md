# PUBG Scrim Registration Platform - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from gaming and esports platforms (Discord, Twitch, Liquipedia, FaceIt) combined with modern SaaS admin panels. This creates a professional esports aesthetic that resonates with the PUBG competitive community.

**Core Design Principles**:
- Dark, immersive gaming aesthetic with strategic blue accents
- Clear information hierarchy for competitive data
- Professional tournament-grade interface
- Mobile-first responsive design

## Color System
**Background Palette**:
- Primary background: Pure black (#000000) or near-black (#0a0a0a)
- Secondary backgrounds: Dark gray (#1a1a1a, #151515)
- Card/elevated surfaces: #1e1e1e, #242424

**Blue Accent System**:
- Primary blue: Electric/cyber blue (#0ea5e9, #3b82f6)
- Secondary blue: Darker blue for hover states (#0284c7, #2563eb)
- Highlight blue: Bright accent for CTAs (#06b6d4)
- VIP gold accent: #fbbf24 for premium features

**Status Colors**:
- Success/Approved: Muted green (#10b981)
- Warning/Pending: Amber (#f59e0b)
- Danger/Rejected: Red (#ef4444)
- Blocked: Dark red (#991b1b)

## Typography
**Font Stack**:
- Primary: "Inter" or "Outfit" from Google Fonts - clean, modern gaming aesthetic
- Headings: Bold weights (700-800) for strong hierarchy
- Body: Regular (400) and Medium (500) weights

**Hierarchy**:
- Page titles: 3xl to 4xl, bold, blue accent color
- Section headings: 2xl to 3xl, semibold
- Card titles: xl, medium weight
- Body text: base, light gray (#d1d5db)
- Labels/metadata: sm, muted gray (#9ca3af)

## Layout System
**Spacing Units**: Tailwind primitives - 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Container Strategy**:
- Max width: max-w-7xl for main content areas
- Admin panel: Full width with max-w-screen-2xl
- Forms: max-w-2xl centered
- Reading content: max-w-4xl

**Grid Patterns**:
- Team cards: 3-column desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), 1-column mobile
- Stats/features: 4-column desktop (lg:grid-cols-4)
- Admin tables: Full-width responsive tables with horizontal scroll on mobile

## Component Library

### Navigation
**Desktop Header**:
- Fixed top navigation with semi-transparent black background (bg-black/80) and backdrop blur
- Logo on left with PUBG branding
- Horizontal menu items with blue underline hover effect
- Discord icon button on right (blue on hover)
- User avatar/profile dropdown on far right
- Admin panel link visible only for administrators (blue badge)

**Mobile Navigation**:
- Hamburger menu icon (animated to X)
- Full-screen overlay menu with staggered fade-in animations
- Large touch targets (minimum 48px height)

### Hero Section (Home Page)
**Visual Treatment**:
- Full-width banner with PUBG-themed background image (battle royale aesthetic, action shot, or map overlay)
- Gradient overlay (black to transparent) for text readability
- Centered content with blur background for text/buttons area

**Content Structure**:
- Bold headline: "PUBG Scrim Registration" in Georgian
- Subheading explaining platform purpose
- Two CTAs: Primary "რეგისტრაცია" (Register), Secondary "წესების ნახვა" (View Rules)
- Quick stats counter: Total teams, Active scrims, VIP teams (animated count-up)

### Cards & Containers
**Team Cards**:
- Dark background (#1e1e1e) with subtle blue border (border-l-4)
- Team name (bold, xl)
- Player count and status badge (approved/pending/rejected)
- Slot number (if assigned) in top-right corner with blue background
- VIP teams: Gold border-l-4, gold badge, elevated shadow

**Info Cards**:
- Rounded corners (rounded-lg)
- Padding: p-6
- Hover effect: Lift with shadow and blue border glow
- Icons: Use Heroicons (outline style) in blue accent color

### Forms
**Input Fields**:
- Dark background (#1a1a1a) with blue border on focus
- Floating labels or top-aligned labels in gray
- Error states with red border and message
- Success states with green border
- Consistent height: h-12 for inputs, h-32 for textareas

**Buttons**:
- Primary: Blue background with white text, rounded-lg, px-6 py-3
- Secondary: Transparent with blue border and blue text
- Danger: Red background for delete/block actions
- Disabled: Gray background with reduced opacity

### Tables (Admin Panel)
**Structure**:
- Dark striped rows for readability (alternate #1a1a1a and #0a0a0a)
- Blue header row with semibold text
- Action buttons (icon-only) in last column: approve (green), reject (red), block (dark red), delete (red), edit slot (blue)
- Sticky header on scroll
- Mobile: Card-based layout instead of table

### Status Badges
- Small rounded-full pills with colored backgrounds and darker text
- Approved: Green background
- Pending: Amber background
- Rejected: Red background
- Blocked: Dark red background
- VIP: Gold background with star icon

### Image Upload Component (Admin)
- Drag-and-drop zone with dashed blue border
- Preview thumbnails in grid layout
- Delete button overlay on hover
- File size/type restrictions displayed

## Page-Specific Layouts

### Home Page Sections
1. Hero (described above)
2. Featured Scrims: 3-column grid of upcoming matches
3. Recent Results: Carousel or grid of match results with images
4. Quick Stats: 4-column stats display
5. How It Works: 3-step process with icons
6. Discord CTA: Large section with Discord logo and join button

### Teams Page
- Filter controls (status, VIP, search) in sticky top bar
- Grid of team cards
- Pagination at bottom

### Schedule Page
- Calendar view or timeline layout
- Each scrim as a card with date, time, teams count, status
- Filter by date range

### Results Page
- Grid of result cards with uploaded images
- Each card: Match date, winning team, scoreboard link, full result image on click (modal)

### VIP Page
- Hero explaining VIP benefits
- Grid of VIP teams with enhanced styling
- How to get VIP section

### Admin Panel
**Dashboard**:
- Stats cards at top (pending registrations, total teams, blocked count)
- Recent activity feed
- Quick actions section

**Team Management**:
- Filterable/searchable table
- Bulk actions toolbar
- Inline editing for slots
- Quick status toggle buttons

## Animations
**Subtle & Purposeful Only**:
- Page transitions: Fade-in on route change (200ms)
- Card hover: Lift effect with transform scale(1.02) and shadow
- Button hover: Slight scale and color shift
- Menu open/close: Slide and fade
- Stats counter: Number count-up on scroll into view
- NO continuous animations, NO distracting effects

## Responsive Breakpoints
- Mobile: < 768px (base)
- Tablet: 768px - 1024px (md)
- Desktop: > 1024px (lg)

**Mobile Adjustments**:
- Stack all multi-column layouts
- Larger touch targets (minimum 44px)
- Simplified navigation (hamburger menu)
- Tables convert to card layouts
- Reduce padding/spacing by 25-50%

## Images
**Hero Image**: Dynamic PUBG battle scene, darkened with gradient overlay for text contrast (place in hero section full-width)

**Team Logos**: User-uploaded square avatars (use placeholder if none provided)

**Result Screenshots**: Match result images uploaded by admin (display in Results page grid and modal lightbox)

**Background Patterns**: Subtle tactical/military grid patterns or circuit board textures at 5% opacity on certain sections

## Accessibility
- High contrast ratios (white/light gray text on black meets WCAG AA)
- Keyboard navigation for all interactive elements
- Focus indicators with blue outline ring
- Screen reader labels for icon-only buttons
- Form validation messages clearly visible