# AI Agents Guidelines

This file outlines instructions and rules that AI coding assistants (such as Antigravity, Claude, etc.) must adhere to when working in this repository.

## Core Rules
1. **Always commit and push your work:** Every time you complete a task or make significant changes, stage all modified files, commit them with a clear, descriptive commit message, and push the branch to the remote repository (`origin`).
2. **Always answer in Russian.**

---

## Project Purpose & Context
This repository contains a static showcase/author landing page for **Dark Saga Art**, an independent brand of handmade ceramic tea pets and one-of-a-kind art dolls. 
* This is a **brand showcase/portfolio**, not an e-commerce online shop. The shop itself lives on Etsy.
* The site must remain lightweight, static (plain HTML/CSS/vanilla JS), easy to deploy (GitHub Pages/Netlify), and easy to edit manually.
* Do not make final visual design locks (color palettes, specific typography mockups) in `README.md` or `AGENTS.md`. These docs focus on UX, structure, behavior, and maintenance.

## Core UX Hierarchy
The page structure must guide the user in a clear, non-chaotic way:
1. Hero Section (Introduction, background image, links to Etsy/Instagram)
2. Tea Pets Section (Handmade ceramic companions)
3. Art Dolls Section (Handmade dolls divided into three series):
   * **Bastards of the Fall** (Dark fantasy / decadent fantasy)
   * **Urban Misfits** (Modern city spirits / weirdos)
   * **Spores** (Tiny portable pocket companion dolls)
4. "How to Buy" / Social Links Section (Redirection to Etsy & Instagram)
5. About the Maker Section (Concise process-focused summary)
6. Footer (Secondary contact options, copyright)

## Hard UX Rules
* **No Shop Metadata:** Do NOT add prices, dimensions, materials, care instructions, shipping info, or availability statuses. This information belongs on Etsy.
* **Separation of Sections:** Keep Tea Pets completely separate from Art Dolls.
* **Art Dolls Series Subdivision:** Art Dolls must be divided into three distinct collapsible series: *Bastards of the Fall*, *Urban Misfits*, and *Spores*.
* **Collapsible Sections & Sticky Headers:** 
  * Tea Pets gallery and each of the three Art Dolls series must be expandable/collapsible.
  * When a section is open and the user is scrolling through it, its header must become sticky under the main site header.
  * The user must be able to collapse the section from the sticky header without scrolling back to the top of the section.
  * Use a modern chevron/icon-based control for expanding/collapsing.
* **Work Cards constraints:** 
  * Cards must be simple and clean: image, name, and short atmospheric description.
  * Do NOT add a third level of detail/accordions or popups unless explicitly requested by the user.
  * Keep section logos/images square and consistent in size regardless of whether the section is collapsed or expanded.
* **Layout Cleanliness:** Shorten or clamp item descriptions so that cards remain visually aligned.
* **Mobile-First UX:** 
  * Sticky section headers must be compact on mobile screens.
  * Cards must adapt (e.g., 1 or 2 columns) on narrow screens.
  * Provide `mobile-preview.html` to easily view the site inside a 390px-wide frame.

## Asset Naming Conventions
* Hero Image: `assets/hero.jpg`
* Tea Pets Images: `assets/tea-pets/tea-pet-[number].jpg`
* Art Dolls (Bastards of the Fall): `assets/bastards/bastards-[number].jpg`
* Art Dolls (Urban Misfits): `assets/urban/urban-[number].jpg`
* Art Dolls (Spores): `assets/spores/spores-[number].jpg`
* Logos:
  * Brand Logo: `assets/logos/logo-brand.png`
  * Series Logos: `assets/logos/logo-bastards.png`, `assets/logos/logo-urban.png`, `assets/logos/logo-spores.png`

## What NOT to Change Without Asking
1. Do not add any JavaScript frameworks or build systems. Keep it vanilla HTML/CSS/JS.
2. Do not change the overall category division (Tea Pets, Bastards of the Fall, Urban Misfits, Spores).
3. Do not add e-commerce/checkout features directly on this page.