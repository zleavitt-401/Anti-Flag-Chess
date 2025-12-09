# Brutalist-Gaming Style

**Personality:** Sharp, geometric, gaming-inspired. Intentionally raw but sophisticated.

**Best for:** Developer tools, creative agencies, tech-forward brands, gaming-adjacent products

## Visual Characteristics

- **Zero border-radius** - Sharp geometric corners only
- **Clip-path edges** - Beveled, notched, asymmetric (5-10% of dimensions)
- **Angular geometry** - Hexagons, triangles, rhombus shapes
- **Glitch effects** - On interaction only (hover, active)
- **Sharp shadows** - Full color, no blur (4-6px offset)
- **HUD aesthetic** - Terminal vibes, data visualization

## Color Philosophy

**Demure, not neon.** Muted sophistication.

### Deep Twilight (Primary)
```css
--twilight-dark: hsl(240, 30%, 20%);
--twilight-mid: hsl(260, 35%, 30%);
--twilight-accent: hsl(260, 100%, 80%);
--twilight-glow: hsla(260, 100%, 80%, 0.3);
```

### Forest Mist (Success/Secondary)
```css
--forest-dark: hsl(142, 50%, 25%);
--forest-mid: hsl(142, 45%, 35%);
--forest-accent: hsl(142, 76%, 70%);
--forest-glow: hsla(142, 76%, 70%, 0.2);
```

### Warm Earth (Warning/Energy)
```css
--earth-dark: hsl(0, 60%, 15%);
--earth-mid: hsl(25, 70%, 40%);
--earth-light: hsl(45, 85%, 70%);
```

### Slate Ocean (Info)
```css
--ocean-dark: hsl(190, 40%, 12%);
--ocean-accent: hsl(190, 100%, 70%);
--ocean-glow: hsla(190, 100%, 70%, 0.2);
```

## Typography

**Geometric, monospace, technical**

- **Primary:** IBM Plex Mono (free, Google Fonts)
- **Headers:** Rajdhani or Orbitron (bold, condensed)
- **Style:** UPPERCASE for emphasis, wide letter-spacing (0.05-0.1em)
- **Avoid:** Rounded fonts, script fonts, serif fonts

## Component Patterns

### Button
```css
.btn-brutalist {
  border: 2px solid currentColor;
  padding: 16px 32px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  /* Beveled corners */
  clip-path: polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%);
  
  /* Subtle gradient */
  background: linear-gradient(135deg, var(--twilight-dark), var(--twilight-mid));
  
  /* Sharp shadow */
  box-shadow: 4px 4px 0 var(--twilight-glow);
  
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-brutalist:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(139, 92, 246, 0.5);
  animation: glitch 0.3s 2;
}

@keyframes glitch {
  0%, 100% { transform: translate(-2px, -2px); }
  33% { transform: translate(-4px, 0px); }
  66% { transform: translate(0px, -4px); }
}
```

### Card
```css
.card-brutalist {
  padding: 24px;
  border: 1px solid hsl(0, 0%, 20%);
  background: linear-gradient(180deg, hsl(0, 0%, 12%), hsl(0, 0%, 8%));
  
  /* Notched corners */
  clip-path: polygon(
    0 8px, 8px 0, 
    calc(100% - 8px) 0, 100% 8px,
    100% calc(100% - 8px), calc(100% - 8px) 100%,
    8px 100%, 0 calc(100% - 8px)
  );
  
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-brutalist:hover {
  transform: translate(-4px, -4px);
  box-shadow: 4px 4px 0 var(--forest-glow);
}
```

### Input
```css
.input-brutalist {
  padding: 12px 16px;
  border: 2px solid hsl(0, 0%, 25%);
  background: hsl(0, 0%, 8%);
  font-family: 'IBM Plex Mono', monospace;
  
  /* Subtle angular corner */
  clip-path: polygon(0 0, 98% 0, 100% 4px, 100% 100%, 0 100%);
}

.input-brutalist:focus {
  border-color: var(--ocean-accent);
  box-shadow: 0 2px 0 var(--ocean-accent);
  outline: none;
}
```

## Animation Philosophy

**Quick, snappy, purposeful**

- **Duration:** 100-300ms maximum
- **Easing:** ease-out (sharp start, smooth end)
- **Glitch effects:** 2-3 iterations only, on interaction
- **No continuous loops** on static elements

### Timing
- Button feedback: 100ms
- Card hover: 200ms
- Glitch: 300ms (2 iterations)
- Modal/overlay: 300ms

## Interaction Patterns

### Hover States
- **3D push effect** - Shadow grows, element translates
- **Glitch animation** - Quick jitter (300ms, 2x)
- **Color shift** - Accent color brightens

### Focus States
- 2px solid outline in accent color
- 2px outline-offset for breathing room
- No glow/blur (keep it sharp)

### Active/Pressed
- Translate in opposite direction (push down)
- Shadow shrinks
- Instant feedback

## Key Principles

✅ **Sharp over soft** - No rounded corners, no blur
✅ **Geometric precision** - Use angles, clips, notches
✅ **Fast interactions** - Under 300ms
✅ **Honest materials** - Show structure, no fakery
✅ **Functional first** - Animation serves purpose

❌ **Avoid:**
- Smooth organic curves
- Neumorphism (soft shadows)
- Continuous animations
- Excessive ornamentation

## Accessibility

- All glitch animations have reduced-motion alternatives
- Focus states meet 3:1 contrast minimum
- Keyboard navigation fully supported
- Text contrast 4.5:1 minimum
