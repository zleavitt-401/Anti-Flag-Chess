# Distinctive UI Generator

**A Claude Skill for creating intentional, non-generic UI components**

Version 2.0 - Multi-Style System

## What This Skill Does

Generates production-ready UI components with **three distinct styles**:

### 🔷 Brutalist-Gaming
Sharp, geometric, gaming-inspired. Zero rounded corners.
- Clip-path edges, glitch effects
- Gaming HUD aesthetic
- Sharp shadows (no blur)
- **Best for:** Developer tools, creative agencies, tech brands

### 🔶 Minimal-Professional (Scandinavian)
Clean, calm, warm minimalism. Generous whitespace.
- Subtle rounded corners (4-8px)
- Soft layered shadows
- Warm neutral palette
- **Best for:** SaaS dashboards, productivity tools, professional services

### 🔸 Editorial
Bold typography, magazine-inspired layouts. High contrast.
- Large commanding headlines
- Asymmetric layouts
- Serif + sans-serif mix
- **Best for:** Marketing sites, portfolios, content-heavy sites

## Core Philosophy

All styles share these principles:
- ✅ **Intentional, not generic** - No default templates
- ✅ **Subtle, not loud** - "Thoughtful" not "LOOK AT ME!"
- ✅ **Accessible by default** - WCAG 2.2 compliant
- ✅ **Production-ready** - Complete code, all states

## How to Use

### Choose Your Style

Just tell Claude which style you want:

```
"Create a primary button in brutalist style"
"Make a card component with minimal-professional aesthetic"  
"Generate an editorial hero section"
```

Or just describe what you need:
```
"Create a button for my dev tool" → Claude suggests Brutalist
"Make a clean dashboard card" → Claude suggests Minimal
"Design a bold article header" → Claude suggests Editorial
```

### What You'll Get

Every component includes:
1. **Complete HTML** - Semantic, accessible
2. **Full CSS** - All states (hover, focus, active)
3. **Animations** - With reduced-motion alternatives
4. **Color palette** - HSL values for easy tweaking
5. **Typography** - Font recommendations
6. **Accessibility notes** - What's implemented

### Examples

**Simple:**
```
"Use the distinctive-ui-generator skill to create a button"
```

**Specific:**
```
"Create a warning card in editorial style with bold typography"
"Make a form input with brutalist aesthetic"
"Generate a stat card with minimal-professional design"
```

## File Structure

```
distinctive-ui-generator/
├── SKILL.md                # Main coordinator (Claude reads this first)
├── style-brutalist.md      # Brutalist-Gaming patterns
├── style-minimal.md        # Minimal-Professional patterns  
├── style-editorial.md      # Editorial patterns
├── templates.md            # Quick reference (brutalist examples)
├── palettes.md             # Color systems (brutalist palettes)
└── README.md               # This file (for you)
```

**How it works:**
- Claude reads `SKILL.md` first
- Based on your request, Claude reads the appropriate style file
- Generates component following that style's rules

## Style Quick Reference

### Brutalist-Gaming
- **Colors:** Deep Twilight, Forest Mist, Warm Earth, Slate Ocean
- **Corners:** Zero (clip-path for bevels/notches)
- **Shadows:** Sharp, no blur (4-6px offset)
- **Animation:** Fast (100-300ms), glitch effects
- **Typography:** IBM Plex Mono, Rajdhani, Orbitron

### Minimal-Professional
- **Colors:** Warm grays, sage green, terracotta, slate
- **Corners:** Subtle (4-8px border-radius)
- **Shadows:** Soft, layered (0-4px blur)
- **Animation:** Smooth (200-300ms), gentle lifts
- **Typography:** Inter, SF Pro (system fonts)

### Editorial
- **Colors:** High contrast (black/white + crimson/gold/navy)
- **Corners:** Varies (sharp for impact, subtle for cards)
- **Shadows:** Minimal (let typography shine)
- **Animation:** Deliberate (300-400ms), fade-ins
- **Typography:** Playfair Display (serif) + Inter (sans)

## For Your Setup (Next.js + Vercel)

Perfect! This skill works great with:
- **Next.js** ✅ (you use this)
- **Tailwind CSS** - Recommended for all styles
- **Vercel** ✅ (you deploy here)
- **Google Fonts** - Free fonts via next/font

All styles are framework-agnostic - just HTML + CSS.

## Accessibility (All Styles)

Every component includes:
- ✅ **Focus states** - 2px outlines, 3:1 contrast
- ✅ **Reduced motion** - @media alternatives for animations
- ✅ **Contrast** - 4.5:1 for text, 3:1 for UI
- ✅ **Keyboard nav** - All interactions work without mouse

## Best Practices

### DO
✅ Use one style consistently per project  
✅ Test on mobile and desktop  
✅ Check keyboard navigation  
✅ Verify contrast ratios  
✅ Keep animations purposeful  

### DON'T
❌ Mix incompatible style patterns  
❌ Sacrifice accessibility for aesthetics  
❌ Use continuous looping animations  
❌ Forget reduced-motion alternatives  
❌ Make it scream "I'M DIFFERENT!"

## Getting Started

1. Ask Claude to create a component: *"Create a button in minimal style"*
2. Copy the HTML + CSS into your project
3. Add recommended fonts (via Google Fonts or next/font)
4. Test accessibility (keyboard nav, contrast)
5. Customize colors/spacing as needed

## Questions?

Ask Claude:
- "Which style should I use for [project type]?"
- "Show me all three styles for a button"
- "How do I customize the colors?"
- "What fonts work best with [style]?"

## Version History

**2.0** (Nov 2025)
- Three distinct styles (Brutalist, Minimal, Editorial)
- Multi-file skill structure
- Universal accessibility standards
- Intentional, non-generic philosophy

**1.1** (Previous)
- Single brutalist-gaming style
- Refined colors (demure over neon)
- Gradient improvements
