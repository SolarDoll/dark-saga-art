# Dark Saga Art — Brand Showcase & Portfolio

This repository contains the static, lightweight showcase website for **Dark Saga Art**, an independent brand of handmade ceramic tea pets and one-of-a-kind art dolls.

## Project Purpose & Scope
This website functions as a **brand showcase/portfolio landing page**. It is designed to be:
* Lightweight, fast, and static (plain HTML, CSS, and JS).
* Easy to deploy on services like GitHub Pages, Netlify, or Cloudflare Pages.
* Simple to edit manually by non-frontend developers.

**Etsy vs. This Site:**
* **This Site:** Focuses on atmospheric branding, story-driven portfolios, and directing traffic. It contains only the artwork name, image, and a short atmospheric/mood description.
* **Etsy Shop:** Serves as the transaction platform. It contains all transactional metadata such as prices, dimensions, materials, care instructions, shipping rates, and real-time availability. Do not add these to the portfolio page.

---

## UX Page Structure
1. **Hero Section:** Clear introduction, tagline, atmospheric copy, and CTAs (Etsy, Instagram, Explore).
2. **Tea Pets Section:** Expandable/collapsible gallery containing handmade ceramic tea companions.
3. **Art Dolls Section:** Divided into three series, each containing its own expandable/collapsible gallery:
   * *Bastards of the Fall:* Dark fantasy courtiers and outcasts.
   * *Urban Misfits:* Modern city spirits and rooftop creatures.
   * *Spores:* Tiny portable pocket companions.
4. **Buying & Socials:** Redirects users to active Etsy listings and Instagram updates.
5. **About Section:** A short paragraph about the maker's philosophy and processes.
6. **Footer:** Secondary contacts (email) and copyright.

---

## File Structure
```text
dark_saga_art_site/
│
├── index.html              # Main brand showcase page (HTML, CSS, JS)
├── mobile-preview.html     # Desktop utility to check mobile layout (390px frame)
├── AGENTS.md               # Rules and guidelines for AI coding assistants
├── README.md               # Project documentation (this file)
│
└── assets/                 # Folder containing all site media
    ├── tea-pets/           # Images for Tea Pets
    ├── bastards/           # Images for Bastards of the Fall series
    ├── urban/              # Images for Urban Misfits series
    ├── spores/             # Images for Spores series
    └── logos/              # Logos for the brand and various series
```

---

## How to Work with Content & Media

### How to Open Locally
1. Clone the repository to your machine.
2. Double-click `index.html` or open it with any web browser.
3. To test the mobile responsive version on a desktop, open `mobile-preview.html`.

### How to Replace Images
Place your images in their respective directories in `assets/` and update the `src` attribute in `index.html`.
* Hero Background: `assets/hero.jpg`
* Tea Pets: `assets/tea-pets/tea-pet-01.jpg`, `tea-pet-02.jpg`, etc.
* Art Dolls: 
  * `assets/bastards/bastards-01.jpg` ...
  * `assets/urban/urban-01.jpg` ...
  * `assets/spores/spores-01.jpg` ...
* Keep all logo and item images **square (1:1 ratio)** to ensure correct visual alignment in the grids and collapsible headers.

### How to Edit Links
Search for `href` attributes in `index.html` to update the social networks and Etsy links:
* Etsy CTA: Find `<a href="https://www.etsy.com/...`
* Instagram CTA: Find `<a href="https://www.instagram.com/...`

---

## How to Deploy
1. **GitHub Pages:**
   * Push your changes to the `main` branch.
   * Go to repository **Settings** -> **Pages**.
   * Under **Build and deployment**, select **Deploy from a branch** and set it to `main` and root `/`.
2. **Netlify / Cloudflare Pages:**
   * Link your GitHub repository.
   * Set build command to empty/none and public directory to the root `/`.
   * Trigger the deploy.

---

## Known Pitfalls & Configuration Details
These are documented issues faced during initial setup:
1. **GitHub CLI (`gh`) and PATH in Windows:** After installing `gh` via `winget`, paths might not update in active command sessions. Refresh the `PATH` environment variable or restart your shell.
2. **PowerShell `-f` Flag Conflict:** When writing custom script calls with `gh api`, avoid using the `-f` flag as PowerShell binds it as a format operator. Always use `--raw-field` or `--field` instead.
3. **SSH First Connection Host Fingerprint:** For non-interactive script setups, add `-o StrictHostKeyChecking=accept-new` to standard ssh calls to automatically accept GitHub's key.