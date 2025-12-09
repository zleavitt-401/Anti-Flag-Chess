# Component Templates

Quick-reference templates for common UI patterns.

## Button Variants

### Primary CTA (Deep Twilight)

```html
<button class="btn-primary">
  Get Started
</button>
```

```css
.btn-primary {
  /* Reset */
  border: none;
  cursor: pointer;
  
  /* Typography */
  font-family: 'IBM Plex Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: white;
  
  /* Spacing */
  padding: 16px 32px;
  
  /* Geometric Edge */
  clip-path: polygon(
    0 0, 95% 0, 100% 5%, 
    100% 100%, 5% 100%, 0 95%
  );
  
  /* Gradient Background */
  background: linear-gradient(
    135deg, 
    hsl(240, 30%, 20%), 
    hsl(260, 35%, 30%)
  );
  
  /* Sharp Shadow */
  box-shadow: 4px 4px 0 rgba(139, 92, 246, 0.3);
  
  /* Animation */
  transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
}

.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(139, 92, 246, 0.5);
  animation: glitch 0.3s 2;
}

.btn-primary:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(139, 92, 246, 0.3);
}

.btn-primary:focus-visible {
  outline: 2px solid hsl(260, 100%, 80%);
  outline-offset: 2px;
}

@keyframes glitch {
  0%, 100% { transform: translate(-2px, -2px); }
  33% { transform: translate(-4px, 0px); }
  66% { transform: translate(0px, -4px); }
}

@media (prefers-reduced-motion: reduce) {
  .btn-primary {
    transition: background-color 0.2s ease-out;
  }
  .btn-primary:hover {
    animation: none;
    background: linear-gradient(
      135deg, 
      hsl(240, 35%, 25%), 
      hsl(260, 40%, 35%)
    );
  }
}
```

### Secondary Button (Forest Mist)

```html
<button class="btn-secondary">
  Learn More
</button>
```

```css
.btn-secondary {
  /* Reset */
  cursor: pointer;
  
  /* Typography */
  font-family: 'IBM Plex Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(142, 76%, 70%);
  
  /* Spacing */
  padding: 16px 32px;
  
  /* Border */
  background: transparent;
  border: 2px solid hsl(142, 76%, 36%);
  
  /* Geometric Edge */
  clip-path: polygon(
    0 0, 95% 0, 100% 5%, 
    100% 100%, 5% 100%, 0 95%
  );
  
  /* Animation */
  transition: border-color 0.2s ease-out, color 0.2s ease-out;
}

.btn-secondary:hover {
  border-color: hsl(142, 76%, 70%);
  color: hsl(142, 100%, 85%);
}

.btn-secondary:focus-visible {
  outline: 2px solid hsl(142, 76%, 70%);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .btn-secondary:hover {
    background: hsla(142, 76%, 36%, 0.1);
  }
}
```

## Card Variants

### Info Card (Notched Corners)

```html
<div class="card-info">
  <h3>Feature Title</h3>
  <p>Feature description with subtle geometric treatment.</p>
</div>
```

```css
.card-info {
  /* Spacing */
  padding: 24px;
  
  /* Border */
  border: 1px solid hsl(0, 0%, 20%);
  
  /* Background Gradient */
  background: linear-gradient(
    180deg, 
    hsl(0, 0%, 12%), 
    hsl(0, 0%, 8%)
  );
  
  /* Shadows for Depth */
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.2);
  
  /* Notched Corners */
  clip-path: polygon(
    0 8px, 8px 0, 
    calc(100% - 8px) 0, 100% 8px,
    100% calc(100% - 8px), calc(100% - 8px) 100%,
    8px 100%, 0 calc(100% - 8px)
  );
  
  /* Animation */
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.card-info:hover {
  transform: translate(-4px, -4px);
  box-shadow: 
    4px 4px 0 rgba(34, 197, 94, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.3);
}

.card-info h3 {
  font-family: 'Rajdhani', sans-serif;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 12px 0;
  color: hsl(142, 76%, 70%);
}

.card-info p {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: hsl(0, 0%, 70%);
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .card-info:hover {
    transform: none;
    border-color: hsl(142, 76%, 36%);
  }
}
```

### Warning Card (Warm Earth)

```html
<div class="card-warning">
  <h3>Important Notice</h3>
  <p>Critical information requiring attention.</p>
</div>
```

```css
.card-warning {
  /* Spacing */
  padding: 24px;
  
  /* Border with Accent */
  border: 2px solid hsl(25, 70%, 40%);
  
  /* Gradient Background */
  background: linear-gradient(
    135deg,
    hsl(0, 60%, 15%),
    hsl(0, 50%, 10%)
  );
  
  /* Sharp Shadow */
  box-shadow: 4px 4px 0 rgba(234, 88, 12, 0.3);
  
  /* Asymmetric Corners */
  clip-path: polygon(
    0 0, 100% 0, 100% calc(100% - 12px), 
    calc(100% - 12px) 100%, 0 100%
  );
  
  /* Animation */
  transition: box-shadow 0.2s ease-out;
}

.card-warning:hover {
  box-shadow: 6px 6px 0 rgba(234, 88, 12, 0.5);
}

.card-warning h3 {
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 12px 0;
  color: hsl(45, 85%, 70%);
}

.card-warning p {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: hsl(0, 0%, 85%);
  margin: 0;
}
```

## Form Input

```html
<div class="form-group">
  <label for="email">Email Address</label>
  <input 
    type="email" 
    id="email" 
    class="form-input"
    placeholder="your@email.com"
  >
</div>
```

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(0, 0%, 70%);
}

.form-input {
  /* Reset */
  border-radius: 0;
  
  /* Typography */
  font-family: 'IBM Plex Mono', monospace;
  font-size: 16px;
  color: white;
  
  /* Spacing */
  padding: 12px 16px;
  
  /* Border */
  border: 2px solid hsl(0, 0%, 25%);
  background: hsl(0, 0%, 8%);
  
  /* Geometric Corner (subtle) */
  clip-path: polygon(
    0 0, 98% 0, 100% 4px, 
    100% 100%, 0 100%
  );
  
  /* Animation */
  transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
}

.form-input:focus {
  outline: none;
  border-color: hsl(190, 100%, 70%);
  box-shadow: 0 2px 0 hsl(190, 100%, 70%);
}

.form-input::placeholder {
  color: hsl(0, 0%, 40%);
}

@media (prefers-reduced-motion: reduce) {
  .form-input {
    transition: border-color 0s;
  }
}
```

## Navigation Tab

```html
<nav class="nav-tabs">
  <button class="nav-tab nav-tab--active">Overview</button>
  <button class="nav-tab">Features</button>
  <button class="nav-tab">Pricing</button>
</nav>
```

```css
.nav-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid hsl(0, 0%, 20%);
}

.nav-tab {
  /* Reset */
  background: transparent;
  border: none;
  cursor: pointer;
  
  /* Typography */
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(0, 0%, 60%);
  
  /* Spacing */
  padding: 12px 24px;
  
  /* Animation */
  transition: color 0.2s ease-out, background-color 0.2s ease-out;
  
  /* Clip bottom corners for angular effect */
  clip-path: polygon(
    0 0, 100% 0, 
    calc(100% - 8px) 100%, 8px 100%
  );
}

.nav-tab:hover {
  color: hsl(0, 0%, 90%);
  background: hsla(0, 0%, 100%, 0.05);
}

.nav-tab--active {
  color: hsl(190, 100%, 70%);
  background: hsl(190, 100%, 10%);
  position: relative;
}

.nav-tab--active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 8px;
  right: 8px;
  height: 2px;
  background: hsl(190, 100%, 70%);
}

.nav-tab:focus-visible {
  outline: 2px solid hsl(190, 100%, 70%);
  outline-offset: -2px;
}

@media (prefers-reduced-motion: reduce) {
  .nav-tab {
    transition: color 0s, background-color 0s;
  }
}
```

## Stat Card (HUD-Inspired)

```html
<div class="stat-card">
  <div class="stat-label">Active Users</div>
  <div class="stat-value">24,591</div>
  <div class="stat-change">+12.3%</div>
</div>
```

```css
.stat-card {
  /* Spacing */
  padding: 20px;
  
  /* Background */
  background: linear-gradient(
    135deg,
    hsl(190, 40%, 12%),
    hsl(190, 30%, 8%)
  );
  
  /* Border with Glow */
  border: 1px solid hsl(190, 50%, 30%);
  box-shadow: 
    0 0 20px rgba(34, 211, 238, 0.1),
    inset 0 1px 0 rgba(34, 211, 238, 0.1);
  
  /* Diagonal Corner Cut */
  clip-path: polygon(
    12px 0, 100% 0, 100% 100%, 0 100%, 0 12px
  );
  
  /* Animation */
  transition: box-shadow 0.3s ease-out;
}

.stat-card:hover {
  box-shadow: 
    0 0 30px rgba(34, 211, 238, 0.2),
    inset 0 1px 0 rgba(34, 211, 238, 0.2);
}

.stat-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: hsl(190, 60%, 60%);
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: hsl(190, 100%, 80%);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-change {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  color: hsl(142, 76%, 70%);
}

.stat-change::before {
  content: '▲ ';
}

@media (prefers-reduced-motion: reduce) {
  .stat-card:hover {
    border-color: hsl(190, 70%, 50%);
  }
}
```
