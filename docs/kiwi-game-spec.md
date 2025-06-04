# Kiwi Memory Game – Complete Specification

Create a fully functional, accessible, and browser-friendly memory game themed around New Zealand. The game must be secure, self-contained, culturally inclusive, and include all features described below in a single solution.

---

## 🎮 Game Description

Develop a 4x4 memory matching game using only HTML, CSS, and JavaScript. The game should load offline, work on all modern browsers, and provide a welcoming, neutral user experience for all ages.

---

## 🧠 Game Logic

* 16 clickable cards (8 unique pairs)
* Flip to reveal a symbol
* Two flipped cards:
  * If matched: remain face up
  * If unmatched: flip back after delay
* Disable further interaction while cards are face up
* Track:
  * Total attempts
  * Successful matches
* Game ends when all pairs are matched
* Show celebratory modal:
  * “Ka pai! You matched them all!”
  * Total attempts
  * Play Again button (fully accessible)
* Shuffle cards on every new game

---

## 🎨 Visual Style (Kiwi / NZ Theme)

* Use the following emojis for card faces:
  * 🥝 Kiwi
  * 🌿 Silver fern
  * 🐤 Pūkeko
  * 🌀 Koru
  * 🐦 Tui
  * 🌺 Pohutukawa
  * 🏴️‍☠️ NZ flag
  * 🪆 Māori motif
* Card back: 🧩 or koru-inspired SVG
* Background: soft green hill gradients with Southern Alps
* Fonts: Poppins or Comic Neue
* Colors: neutral Kiwi tones (green, flax brown, tui blue)
* Overall tone: welcoming, neutral, and kid-friendly

---

## 🎵 Programmatic Audio Feedback (No external files)

* Use Web Audio API to generate neutral tones:
  * Flip: low-pitch tone (200Hz)
  * Match: medium tone (800Hz)
  * Win: short ascending sequence

---

### 🎨 Color Theme Selector

* Allow player to switch between color themes:
  * Forest Green (default)
  * Tui Blue
  * Sunset Orange
* Implement using CSS variables

---

### 🌐 Language Toggle

* Support English and Te Reo Māori:
  * Attempts → Ngana
  * Matches → Takitahi
  * Restart Game → Tīmata Anō
* Use a simple toggle (buttons or dropdown)

---

### ♿ Accessibility Requirements

* All interactive elements (cards, buttons) must be keyboard-accessible
* Add `aria-label` to cards (e.g., “Card 1 of 16, hidden”)
* Use `aria-live` regions for:
  * Match result
  * Win message
  * Sound state changes
* Ensure all color combinations meet WCAG 2.1 contrast standards

---

### 🔐 Security & Compatibility

* Pure HTML, CSS, JavaScript (no frameworks or CDNs)
* No inline JavaScript in HTML
* All assets must load from relative paths
* Game must work directly from `index.html`
* Compatible with GitHub Pages deployment

---

### ✅ Output Requirements

* Files:
  * `index.html`
  * `style.css`
  * `script.js`
* No build step required
* Code must:
  * Work offline
  * Be fully interactive on first load
  * Include inline comments for key logic
