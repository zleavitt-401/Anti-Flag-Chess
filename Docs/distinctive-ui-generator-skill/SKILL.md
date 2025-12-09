---
name: distinctive-ui-generator-skill
description: Generate production-ready UI components in three distinct styles (Brutalist-Gaming, Minimal-Professional, Editorial) with intentional design and full accessibility.
---

# Distinctive UI Generator

## Purpose
Generate production-ready UI components with **intentional, distinctive design** that eschews generic templates. All styles prioritize subtlety over loudness - the goal is "someone put thought into this UI" not "LOOK AT ME!"

## Core Philosophy
- ✅ Clean and professional
- ✅ Subtle, intentional details
- ✅ Distinctive without screaming
- ✅ Full accessibility built-in
- ❌ Never generic/default templates

## Available Styles

This skill provides **three distinct UI styles**. When user requests a component, determine which style to use based on their request or ask them to choose.

### 1. Brutalist-Gaming
**Personality:** Sharp, geometric, gaming-inspired  
**When to use:** Developer tools, creative agencies, tech-forward brands  
**Read:** `style-brutalist.md`

**Quick ID:**
- Zero border-radius, clip-path edges
- Glitch effects on hover
- Sharp shadows (no blur)
- Gaming HUD aesthetic
- Keywords: "brutalist," "gaming," "geometric," "sharp," "angular"

### 2. Minimal-Professional (Scandinavian)
**Personality:** Clean, calm, warm minimalism  
**When to use:** SaaS dashboards, productivity tools, professional services  
**Read:** `style-minimal.md`

**Quick ID:**
- Subtle rounded corners (4-8px)
- Generous whitespace
- Soft layered shadows
- Warm neutral palette
- Keywords: "minimal," "clean," "professional," "Scandinavian," "simple"

### 3. Editorial
**Personality:** Bold typography, magazine-inspired layouts  
**When to use:** Marketing sites, portfolios, content-heavy sites  
**Read:** `style-editorial.md`

**Quick ID:**
- Large, commanding headlines
- Asymmetric layouts
- High contrast (black/white + bold color)
- Serif + sans-serif mix
- Keywords: "editorial," "magazine," "bold," "typography," "content"

## How to Use This Skill

### Step 1: Determine Style
If user specifies: Use that style
If unclear: Ask "Which style? Brutalist-Gaming / Minimal-Professional / Editorial"
If they say "whatever you think": Choose based on use case

### Step 2: Read Style File
**Always read the appropriate style file before generating:**
- Brutalist → Read `style-brutalist.md`
- Minimal → Read `style-minimal.md`
- Editorial → Read `style-editorial.md`

### Step 3: Generate Component
Follow the patterns, colors, and principles in that style file

## Universal Principles (All Styles)

These apply regardless of which style you're using:

### Accessibility Requirements (Non-Negotiable)

**Focus States (WCAG 2.4.13)**
- Minimum 2px outline/indicator thickness
- 3:1 contrast ratio vs surrounding elements
- 2px outline-offset for breathing room
- Visible for keyboard users at all times
- Use :focus-visible for buttons/links
- Always show :focus for form inputs

**Contrast (WCAG 1.4.11)**
- 4.5:1 minimum for normal text
- 3:1 minimum for large text (18px+) and UI components
- Test gradients at lightest/darkest points
- Ensure text over images/gradients meets standards

**Motion (WCAG 2.3.3)**
- Provide @media (prefers-reduced-motion) alternatives
- Reduced motion: slower animations or instant color changes
- Limit motion to <1/3 of screen area
- Duration <1 second for UX animations
- No more than 3 flashes per second

**Keyboard Navigation**
- All functionality operable via keyboard
- Logical tab order maintained
- No keyboard traps
- Skip links for long pages

**Performance**
- Animate only transform and opacity (GPU-accelerated)
- Avoid animating: width, height, position, margin, padding
- Use IntersectionObserver for scroll animations
- Target 90+ Lighthouse performance score

### Tech Stack Recommendations

**For Your Setup (Next.js + Vercel):**
- Tailwind CSS - Utility-first with custom classes per style
- Framer Motion - For React animations (optional)
- System fonts or Google Fonts - Keep it fast

**Deployment:**
- Vercel handles it (you're already set up)
- Ensure fonts are optimized (next/font)
- Test on mobile and desktop

## Output Format

When generating components, always provide:

1. **HTML structure** - Semantic, accessible markup
2. **Complete CSS** including:
   - Base styles
   - Hover/active states
   - Focus-visible states
   - Animations (if applicable)
   - Reduced-motion alternatives
3. **Color palette used** - With HSL/hex values
4. **Accessibility notes** - What's implemented and why
5. **Typography** - Font recommendations

## Example Request Flow

**User:** "Create a primary button"  
**You:** 
1. Determine style (ask if unclear)
2. Read appropriate style file
3. Generate button following that style's patterns
4. Include all states and accessibility

**User:** "Make it more [adjective]"  
**You:**
1. Adjust within that style's principles
2. Maintain accessibility
3. Explain what you changed

## Anti-Patterns (All Styles)

❌ Generic default templates
❌ Screaming "I'M DIFFERENT!"  
❌ Sacrificing accessibility for style
❌ Mixing incompatible style patterns
❌ Forgetting reduced-motion alternatives
❌ Using animations without purpose
❌ Low contrast for aesthetics

## Version
**2.0** - Multi-style system with universal accessibility standards
