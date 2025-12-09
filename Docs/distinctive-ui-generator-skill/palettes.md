# Color Palettes - Demure Sophistication

All palettes use HSL format for easy adjustments. These are **muted, sophisticated colors** - not bright neon.

## Deep Twilight
*Muted indigo, soft purple, lavender*

Perfect for: Primary CTAs, headers, professional tech interfaces

```css
:root {
  --twilight-darkest: hsl(240, 30%, 15%);
  --twilight-dark: hsl(240, 30%, 20%);
  --twilight-mid: hsl(260, 35%, 30%);
  --twilight-light: hsl(280, 40%, 50%);
  --twilight-accent: hsl(260, 100%, 80%);
  --twilight-glow: hsla(260, 100%, 80%, 0.3);
}
```

**Use cases:**
- Button backgrounds: `--twilight-dark` to `--twilight-mid` gradient
- Focus outlines: `--twilight-accent`
- Shadows: `--twilight-glow`
- Text on dark: `--twilight-accent`

---

## Warm Earth
*Deep red, burnt orange, amber*

Perfect for: Warnings, energy, calls-to-action that need warmth

```css
:root {
  --earth-darkest: hsl(0, 60%, 15%);
  --earth-dark: hsl(0, 60%, 25%);
  --earth-mid: hsl(25, 70%, 40%);
  --earth-light: hsl(45, 85%, 55%);
  --earth-accent: hsl(25, 100%, 70%);
  --earth-glow: hsla(25, 100%, 70%, 0.3);
}
```

**Use cases:**
- Warning cards: `--earth-dark` to `--earth-darkest` gradient
- Accent borders: `--earth-mid`
- Highlighted text: `--earth-light`
- Shadows: `--earth-glow`

---

## Forest Mist
*Forest green, emerald, mint*

Perfect for: Success states, secondary actions, nature/sustainability themes

```css
:root {
  --forest-darkest: hsl(142, 50%, 15%);
  --forest-dark: hsl(142, 50%, 25%);
  --forest-mid: hsl(142, 45%, 35%);
  --forest-light: hsl(142, 40%, 45%);
  --forest-accent: hsl(142, 76%, 70%);
  --forest-glow: hsla(142, 76%, 70%, 0.2);
}
```

**Use cases:**
- Secondary buttons: `--forest-mid` borders
- Success indicators: `--forest-accent`
- Card hover effects: `--forest-glow`
- Subtle backgrounds: `--forest-darkest`

---

## Slate Ocean
*Deep cyan, teal variations*

Perfect for: Info states, links, data visualization

```css
:root {
  --ocean-darkest: hsl(190, 40%, 12%);
  --ocean-dark: hsl(190, 40%, 20%);
  --ocean-mid: hsl(190, 45%, 30%);
  --ocean-light: hsl(190, 50%, 40%);
  --ocean-accent: hsl(190, 100%, 70%);
  --ocean-glow: hsla(190, 100%, 70%, 0.2);
}
```

**Use cases:**
- Form focus states: `--ocean-accent`
- Info cards: `--ocean-dark` to `--ocean-darkest` gradient
- HUD-inspired elements: `--ocean-glow` for subtle glow
- Links: `--ocean-accent`

---

## Monochrome Base
*Grayscale for structure*

Always pair with one accent palette above.

```css
:root {
  --mono-black: hsl(0, 0%, 5%);
  --mono-darkest: hsl(0, 0%, 8%);
  --mono-darker: hsl(0, 0%, 12%);
  --mono-dark: hsl(0, 0%, 20%);
  --mono-mid: hsl(0, 0%, 40%);
  --mono-light: hsl(0, 0%, 60%);
  --mono-lighter: hsl(0, 0%, 70%);
  --mono-lightest: hsl(0, 0%, 85%);
  --mono-white: hsl(0, 0%, 95%);
}
```

**Use cases:**
- Body backgrounds: `--mono-black` to `--mono-darkest`
- Card backgrounds: `--mono-darker` to `--mono-darkest` gradient
- Borders: `--mono-dark`
- Body text: `--mono-lighter`
- Headings: `--mono-white`
- Disabled states: `--mono-mid`

---

## Gradient Recipes

### Subtle Two-Color Gradient
```css
background: linear-gradient(
  135deg,
  var(--color-dark),
  var(--color-mid)
);
```

### Three-Color Depth Gradient
```css
background: linear-gradient(
  135deg,
  var(--color-darkest),
  var(--color-dark),
  var(--color-mid)
);
```

### Grainy Gradient (Recommended)
Adds texture to avoid banding:

```html
<!-- Add to your HTML once -->
<svg style="position: absolute; width: 0; height: 0;">
  <filter id="grainy">
    <feTurbulence 
      type="fractalNoise" 
      baseFrequency="0.65" 
      numOctaves="3" 
      stitchTiles="stitch"
    />
    <feColorMatrix type="saturate" values="0"/>
  </filter>
</svg>
```

```css
.grainy-gradient {
  background: linear-gradient(
    135deg,
    var(--color-dark),
    var(--color-mid)
  );
  filter: url(#grainy) brightness(1.1) contrast(1.05);
}
```

---

## Accessibility Contrast Guide

### Text on Backgrounds
- **Normal text** (16px): Minimum 4.5:1 contrast
- **Large text** (18px+ or 14px+ bold): Minimum 3:1 contrast

### UI Components
- **Buttons, borders, icons**: Minimum 3:1 contrast vs adjacent colors
- **Focus indicators**: Minimum 3:1 contrast, 2px minimum thickness

### Testing Your Colors
Use browser DevTools or online tools:
- Chrome DevTools Contrast Checker
- WebAIM Contrast Checker
- Stark plugin for Figma

### Safe Combinations
On dark backgrounds (mono-black, mono-darkest):
- ✅ Any accent color (twilight-accent, forest-accent, etc.)
- ✅ mono-lighter, mono-lightest, mono-white
- ❌ mono-mid, mono-dark (too low contrast)

On accent backgrounds:
- ✅ mono-black, mono-darkest
- ✅ mono-white (test first)
- ❌ Other accent colors (usually clash)

---

## Quick Color Selection Guide

**Need a button?**
- Primary: Deep Twilight
- Secondary: Forest Mist
- Danger: Warm Earth

**Need a card?**
- Info: Slate Ocean
- Warning: Warm Earth
- Success: Forest Mist
- Neutral: Monochrome with any accent border

**Need text colors?**
- Headings: mono-white
- Body: mono-lighter
- Labels: mono-light
- Muted/disabled: mono-mid
- Accents: Use accent from chosen palette

**Need shadows?**
- Dark shadows: `rgba(0, 0, 0, 0.3)` - structural depth
- Colored glows: Use `--*-glow` variable from palette
- Sharp brutalist shadow: `4px 4px 0 var(--*-glow)`
