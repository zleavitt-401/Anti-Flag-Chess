# Minimal-Professional Style (Scandinavian)

**Personality:** Clean, calm, functional. Warm minimalism with breathing room.

**Best for:** SaaS dashboards, productivity tools, professional services, fintech

## Visual Characteristics

- **Subtle rounded corners** - 4-8px (intentional, not default)
- **Generous whitespace** - Elements breathe, never cramped
- **Soft shadows** - Layered depth (0-4px blur)
- **Muted color accents** - One color, used sparingly
- **Natural hierarchy** - Size and spacing create order
- **Functional beauty** - Every element has purpose

## Color Philosophy

**Warm neutrals with one accent.** Scandinavian coziness meets digital precision.

### Warm Grays (Base)
```css
--warm-white: hsl(30, 15%, 97%);
--warm-bg: hsl(30, 10%, 95%);
--warm-surface: hsl(30, 8%, 92%);
--warm-border: hsl(30, 6%, 85%);
--warm-text-light: hsl(30, 4%, 60%);
--warm-text: hsl(30, 8%, 30%);
--warm-text-dark: hsl(30, 10%, 15%);
```

### Sage (Primary Accent)
```css
--sage-light: hsl(140, 20%, 88%);
--sage: hsl(140, 18%, 65%);
--sage-dark: hsl(140, 22%, 45%);
--sage-darker: hsl(140, 25%, 35%);
```

### Terracotta (Secondary/Warm Accent)
```css
--terra-light: hsl(15, 45%, 88%);
--terra: hsl(15, 45%, 65%);
--terra-dark: hsl(15, 50%, 50%);
```

### Slate (Cool Accent)
```css
--slate-light: hsl(210, 15%, 88%);
--slate: hsl(210, 15%, 65%);
--slate-dark: hsl(210, 18%, 45%);
```

## Typography

**Clean, readable, generous leading**

- **Primary:** Inter or SF Pro (system fonts for speed)
- **Headers:** Same font, just larger (consistency)
- **Weights:** 400 (regular), 500 (medium), 600 (semibold) only
- **Line-height:** 1.6-1.8 for body, 1.2-1.4 for headers
- **Avoid:** All caps (except labels), tight tracking, bold weights

## Component Patterns

### Button
```css
.btn-minimal {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 15px;
  
  /* Sage primary */
  background: var(--sage-dark);
  color: white;
  
  /* Soft shadow */
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.08);
  
  transition: all 0.2s ease-out;
}

.btn-minimal:hover {
  background: var(--sage-darker);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.08),
    0 3px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.btn-minimal:active {
  transform: translateY(0);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.06);
}

/* Secondary variant */
.btn-minimal-secondary {
  background: var(--warm-surface);
  color: var(--warm-text);
  border: 1px solid var(--warm-border);
}

.btn-minimal-secondary:hover {
  background: var(--warm-bg);
  border-color: var(--sage);
}
```

### Card
```css
.card-minimal {
  padding: 32px;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--warm-border);
  
  /* Layered shadow for depth */
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.04);
  
  transition: all 0.3s ease-out;
}

.card-minimal:hover {
  border-color: var(--sage-light);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.06),
    0 4px 8px rgba(0, 0, 0, 0.06),
    0 8px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.card-minimal h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--warm-text-dark);
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.card-minimal p {
  font-size: 15px;
  font-weight: 400;
  color: var(--warm-text);
  line-height: 1.6;
  margin: 0;
}
```

### Input
```css
.input-minimal {
  padding: 10px 14px;
  border: 1.5px solid var(--warm-border);
  border-radius: 6px;
  background: white;
  font-size: 15px;
  color: var(--warm-text-dark);
  
  transition: all 0.2s ease-out;
}

.input-minimal:hover {
  border-color: var(--sage);
}

.input-minimal:focus {
  outline: none;
  border-color: var(--sage-dark);
  box-shadow: 0 0 0 3px var(--sage-light);
}

.input-minimal::placeholder {
  color: var(--warm-text-light);
}

/* Label */
.label-minimal {
  font-size: 13px;
  font-weight: 500;
  color: var(--warm-text);
  margin-bottom: 6px;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
```

### Divider
```css
.divider-minimal {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--warm-border) 20%,
    var(--warm-border) 80%,
    transparent
  );
  margin: 48px 0;
}
```

## Layout Principles

### Spacing Scale (Consistent rhythm)
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### Grid System
- **Max content width:** 1200px
- **Comfortable reading width:** 680px (65-75 characters)
- **Grid gaps:** 24px (mobile) → 32px (desktop)
- **Margins:** 16px (mobile) → 48px (desktop)

### Visual Hierarchy
1. Size (larger = more important)
2. Weight (semibold for emphasis)
3. Color (darker = more important)
4. Position (top-left = most important in Western layouts)

## Animation Philosophy

**Smooth, gentle, purposeful**

- **Duration:** 200-300ms standard
- **Easing:** ease-out (natural deceleration)
- **Movement:** Subtle (1-2px translations)
- **No bounce** - Keep it dignified

### Timing
- Button feedback: 200ms
- Card hover: 300ms
- Modal entrance: 300ms
- Page transition: 400ms

## Interaction Patterns

### Hover States
- Slight lift (translateY -1px to -2px)
- Shadow deepens slightly
- Color shifts darker/richer
- Border color may accent

### Focus States
- 3px soft glow in accent color (box-shadow)
- Border color changes to accent
- No outline (replaced by glow)
- Clearly visible, not harsh

### Active/Pressed
- Return to ground (translateY 0)
- Shadow reduces
- Feels tactile, responsive

### Disabled States
- 50% opacity
- No hover effects
- Cursor: not-allowed
- Maintain readability

## Key Principles

✅ **Function over form** - Beauty through utility
✅ **Whitespace is content** - Let things breathe
✅ **One accent color** - Used sparingly, creates focus
✅ **Soft, not harsh** - Gentle transitions, layered shadows
✅ **Readable always** - Generous line-height, clear hierarchy
✅ **Consistent rhythm** - Spacing scale creates harmony

❌ **Avoid:**
- Excessive decoration
- Multiple competing accent colors
- Tight line-height (<1.5)
- Heavy borders (>2px)
- Harsh shadows or colors

## Detail Touches

### Subtle Gradients (Optional)
```css
/* Very subtle background texture */
background: linear-gradient(
  180deg,
  hsl(30, 15%, 97%),
  hsl(30, 12%, 95%)
);
```

### Micro-interactions
- Input labels float up on focus
- Success checkmarks fade in
- Loading states use subtle pulse (not spin)

### Icons
- Outlined style (not filled)
- 20-24px standard size
- Same color as adjacent text
- Consistent stroke-width (1.5-2px)

## Accessibility

- Text contrast 4.5:1 minimum (body text)
- Large text 3:1 minimum (18px+)
- Focus indicators clearly visible (3px glow)
- Reduced motion: remove translateY, keep color changes
- Touch targets 44x44px minimum
