# Editorial Style

**Personality:** Bold typography, interesting layouts, magazine-inspired. Confident but refined.

**Best for:** Marketing sites, portfolios, content-heavy sites, creative agencies

## Visual Characteristics

- **Bold typography** - Large, commanding headlines
- **Asymmetric layouts** - Broken grid, intentional imbalance
- **High contrast** - Black/white with one strong color
- **Interesting spacing** - Non-uniform, creates rhythm
- **Pull quotes & callouts** - Typography as design element
- **Structured chaos** - Looks editorial, not messy

## Color Philosophy

**High contrast with one bold accent.** Think Vogue meets Bloomberg.

### Monochrome Base
```css
--editorial-black: hsl(0, 0%, 8%);
--editorial-dark: hsl(0, 0%, 15%);
--editorial-mid: hsl(0, 0%, 50%);
--editorial-light: hsl(0, 0%, 85%);
--editorial-white: hsl(0, 0%, 98%);
```

### Crimson (Primary Accent)
```css
--crimson-light: hsl(350, 75%, 92%);
--crimson: hsl(350, 75%, 55%);
--crimson-dark: hsl(350, 80%, 42%);
--crimson-darker: hsl(350, 85%, 32%);
```

### Gold (Secondary Accent - use sparingly)
```css
--gold-light: hsl(45, 85%, 90%);
--gold: hsl(45, 85%, 60%);
--gold-dark: hsl(45, 90%, 48%);
```

### Navy (Alternative Accent)
```css
--navy-light: hsl(220, 30%, 92%);
--navy: hsl(220, 30%, 35%);
--navy-dark: hsl(220, 35%, 22%);
```

## Typography

**Mix of serif and sans-serif. Big, bold, readable.**

- **Headlines:** Playfair Display, Libre Baskerville, or Merriweather (serif)
- **Body:** Inter, Work Sans, or system fonts (sans-serif)
- **Accents:** Crimson Pro for pull quotes (serif)
- **Scale:** Large jumps between sizes (16px → 24px → 40px → 60px)
- **Weights:** Regular (400) and Bold (700) - no in-between

### Type Scale
```css
--text-xs: 13px;
--text-sm: 15px;
--text-base: 17px;
--text-lg: 21px;
--text-xl: 28px;
--text-2xl: 36px;
--text-3xl: 48px;
--text-4xl: 64px;
--text-5xl: 80px;
```

## Component Patterns

### Hero Headline
```css
.headline-editorial {
  font-family: 'Playfair Display', serif;
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 700;
  line-height: 1.1;
  color: var(--editorial-black);
  letter-spacing: -0.02em;
  margin: 0 0 24px 0;
}

.headline-editorial span {
  display: block;
  color: var(--crimson);
  font-style: italic;
}
```

### Button (Minimal Editorial)
```css
.btn-editorial {
  padding: 16px 32px;
  border: 2px solid var(--editorial-black);
  background: var(--editorial-black);
  color: var(--editorial-white);
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  
  transition: all 0.2s ease-out;
}

.btn-editorial:hover {
  background: var(--crimson);
  border-color: var(--crimson);
}

/* Outline variant */
.btn-editorial-outline {
  background: transparent;
  color: var(--editorial-black);
  border: 2px solid var(--editorial-black);
}

.btn-editorial-outline:hover {
  background: var(--editorial-black);
  color: var(--editorial-white);
}
```

### Article Card
```css
.card-editorial {
  background: var(--editorial-white);
  border-top: 4px solid var(--editorial-black);
  padding: 0;
  transition: border-color 0.3s ease-out;
}

.card-editorial:hover {
  border-top-color: var(--crimson);
}

.card-editorial-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.card-editorial-content {
  padding: 32px 24px;
}

.card-editorial-category {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--crimson);
  margin-bottom: 12px;
}

.card-editorial-title {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--editorial-black);
  margin: 0 0 16px 0;
}

.card-editorial-excerpt {
  font-size: 16px;
  line-height: 1.6;
  color: var(--editorial-mid);
  margin: 0 0 20px 0;
}

.card-editorial-meta {
  font-size: 13px;
  color: var(--editorial-mid);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Pull Quote
```css
.pullquote-editorial {
  font-family: 'Crimson Pro', serif;
  font-size: 32px;
  font-weight: 400;
  font-style: italic;
  line-height: 1.4;
  color: var(--editorial-black);
  border-left: 4px solid var(--crimson);
  padding: 24px 0 24px 32px;
  margin: 48px 0;
}

.pullquote-editorial::before {
  content: '"';
  font-size: 64px;
  color: var(--crimson);
  line-height: 0;
  display: block;
  margin-bottom: 16px;
}
```

### Section Divider
```css
.divider-editorial {
  width: 80px;
  height: 4px;
  background: var(--crimson);
  margin: 64px 0;
  position: relative;
}

.divider-editorial::after {
  content: '';
  position: absolute;
  right: -40px;
  top: 0;
  width: 30px;
  height: 4px;
  background: var(--editorial-mid);
}
```

## Layout Patterns

### Asymmetric Grid
```css
.editorial-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
}

.editorial-grid-featured {
  grid-column: 1;
  grid-row: span 2;
}

/* Alternating pattern */
.editorial-grid:nth-child(even) {
  grid-template-columns: 1fr 2fr;
}
```

### Magazine Layout
```css
.magazine-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.magazine-layout-hero {
  grid-column: 1 / 9;
}

.magazine-layout-sidebar {
  grid-column: 9 / 13;
}

.magazine-layout-full {
  grid-column: 1 / 13;
}
```

### Broken Grid
```css
/* Items intentionally break out of grid */
.broken-grid-item {
  margin-left: -48px; /* Extend into margin */
}

.broken-grid-item:nth-child(even) {
  margin-right: -48px;
  margin-left: 0;
}
```

## Typography Patterns

### Drop Cap
```css
.dropcap::first-letter {
  float: left;
  font-size: 4.5em;
  line-height: 0.85;
  margin: 0 8px 0 0;
  font-weight: 700;
  color: var(--crimson);
}
```

### Overline (Category/Kicker)
```css
.overline {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--crimson);
  margin-bottom: 8px;
  display: block;
}
```

### Byline
```css
.byline {
  font-size: 14px;
  color: var(--editorial-mid);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.byline strong {
  color: var(--editorial-black);
  font-weight: 700;
}
```

## Animation Philosophy

**Confident, deliberate, editorial**

- **Duration:** 300-400ms (slightly slower, more deliberate)
- **Easing:** ease-in-out (smooth both ways)
- **Minimal movement** - Let typography shine
- **Fade-ins preferred** - Opacity + slight translate

### Timing
- Hover effects: 300ms
- Page transitions: 400ms
- Scroll reveals: 600ms
- Modal entrance: 400ms

## Interaction Patterns

### Hover States
- **Underline animations** - Width grows from 0 to 100%
- **Color shifts** - Text color to crimson
- **Border emphasis** - Border thickens or changes color
- **Image zoom** - Subtle scale(1.05) on cards

### Link Styles
```css
.link-editorial {
  color: var(--editorial-black);
  text-decoration: none;
  position: relative;
  font-weight: 700;
}

.link-editorial::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--crimson);
  transition: width 0.3s ease-out;
}

.link-editorial:hover::after {
  width: 100%;
}
```

### Focus States
- 3px solid outline in crimson
- Slightly offset (outline-offset: 2px)
- Bold and visible (editorial confidence)

## Key Principles

✅ **Typography is the hero** - Let it be big and bold
✅ **High contrast** - Black, white, one bold color
✅ **Asymmetry creates interest** - Break the grid intentionally
✅ **Whitespace frames content** - Generous margins
✅ **Editorial confidence** - Bold choices, clear hierarchy
✅ **Mix serif + sans** - Creates visual rhythm

❌ **Avoid:**
- Timid typography (go big or go home)
- Multiple accent colors (one bold color only)
- Perfectly symmetric layouts (too predictable)
- Rounded corners (keep it editorial-sharp)
- Gradient backgrounds (keep it clean)

## Detail Touches

### Numbers & Stats
```css
.stat-editorial {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-weight: 700;
  line-height: 1;
  color: var(--crimson);
}

.stat-editorial-label {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--editorial-mid);
  margin-top: 8px;
}
```

### Accent Bar (Visual interest)
```css
.accent-bar {
  width: 60px;
  height: 6px;
  background: var(--crimson);
  margin: 24px 0;
}
```

### Image Captions
```css
.caption-editorial {
  font-size: 13px;
  font-style: italic;
  color: var(--editorial-mid);
  margin-top: 12px;
  padding-left: 16px;
  border-left: 2px solid var(--editorial-light);
}
```

## Layout Guidelines

### Content Width
- **Narrow (reading):** 680px max
- **Standard:** 960px max
- **Wide (magazine):** 1200px max
- **Full-bleed:** 100% (for impact)

### Spacing Hierarchy
```css
--space-section: 96px; /* Between major sections */
--space-element: 48px; /* Between elements */
--space-related: 24px; /* Related content */
--space-tight: 12px;   /* Tightly coupled items */
```

### Responsive Approach
- Desktop: Bold, wide, asymmetric
- Tablet: Simplified grid, still bold
- Mobile: Single column, typography hero remains

## Accessibility

- Text contrast 4.5:1 minimum (especially with crimson)
- Large headings can be 3:1 (they're 24px+)
- Focus indicators bold and visible (3px)
- Reduced motion: remove fadeIn/translateY
- Reading width maintained (65-75 characters)
- Touch targets 44x44px minimum on mobile
