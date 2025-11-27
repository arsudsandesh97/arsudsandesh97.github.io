# Visual Specification: Blog Section

## Layout & Spacing

- **Container Padding**:
  - Desktop: `100px 0 60px 0`
  - Mobile: `80px 0 40px 0`
- **Max Width**: `1350px` (Inner Wrapper)
- **Grid Gap**:
  - Desktop: `32px`
  - Mobile: `24px`
- **Card Height**: `100%` (Flex column)

## Typography

- **Hero Title**:
  - Font Size: `52px` (Desktop), `38px` (Mobile)
  - Weight: `700`
  - Letter Spacing: `-1px`
- **Hero Subtitle**:
  - Font Size: `19px` (Desktop), `17px` (Mobile)
  - Color: `theme.text_secondary`
- **Section Title**:
  - Font Size: `28px`
  - Weight: `600`
- **Card Title**:
  - Font Size: `20px`
  - Weight: `700`
  - Line Height: `1.4`
- **Card Excerpt**:
  - Font Size: `14px`
  - Color: `theme.text_secondary` (with opacity)

## Colors & Theming

- **Background**: `theme.bg`
- **Card Background**: `theme.card_light` + opacity/blur
- **Primary Accent**: `theme.primary`
- **Text Primary**: `theme.text_primary`
- **Text Secondary**: `theme.text_secondary`

## Components

### Search Bar
- **Height**: `~50px`
- **Border Radius**: `12px`
- **Focus State**: `theme.primary` border + shadow

### Tag Pills
- **Padding**: `8px 16px`
- **Border Radius**: `20px`
- **Active State**: `theme.primary` background (low opacity) + border
- **Hover State**: `theme.primary` text + border

### Blog Card
- **Border Radius**: `20px`
- **Image Height**: `200px`
- **Hover Effect**:
  - Translate Y: `-12px`
  - Scale: `1.02`
  - Shadow increase
  - Border highlight

## Breakpoints

- **Mobile**: `< 768px` (1 column grid)
- **Tablet**: `768px - 1024px` (2 column grid)
- **Desktop**: `> 1024px` (3+ column grid)
