# The website prompts

Two prompts: one for the product photos, one for the website. Copy them into an AI tool, fill in the `[brackets]` first. The more specific the brief, the less generic the result.

## 1. The product photos

Run this in an image generator (the demo used Codex's image generation on a ChatGPT plan). Generate every image in one request, so they share the same light and colour grading.

```text
Create photorealistic product images for a website. Save each one as a PNG with the
file names below. Keep one consistent art direction across all images: premium studio
product photography, soft diffused key light from the upper left, gentle realistic
contact shadows, true-to-life materials, warm neutral colour grading, no text other
than the label text specified, no other brands or logos.

Brand: [Ember Lane] (fictional). Label design: [a minimalist line-art flame inside a
thin circle, the wordmark "EMBER LANE" in an elegant serif, "SMALL-BATCH COFFEE" in
small caps]. Palette: [espresso #2b1d14, ember #c8553d, honey #e3b04b, cream #fbf6ef].

1. [bag-hero.png], 1024x1536: [a matte espresso-brown stand-up coffee pouch with a
   folded top and a tin-tie, slight three-quarter angle]. Transparent background.
2-4. [one image per product, same design and angle, different colour and name].
   Transparent background.
5-6. [two loose piles of roasted coffee beans seen from above, one spreading from the
   left edge, one from the right]. Transparent background.
7. [a landscape photo for the "how it works" section]. No people's faces, no readable
   brand names.
```

Then convert them to WebP so the page stays light: `cwebp -q 85 -resize 900 0 bag-hero.png -o public/images/bag-hero.webp`.

## 2. The website

Copy this into Claude Code, Cursor, Codex or any coding agent that can write files.

```text
You are a senior creative developer and art director. Build a premium, production-ready
marketing website for the business below. It must not look like a generic template.

## The business
- Name: [Ember Lane Coffee]
- What it does, in one sentence: [a small-batch roastery that roasts every Tuesday and
  ships by Friday]
- Who it is for: [people who drink coffee at home every day and care about freshness]
- The one action a visitor should take: [start a coffee subscription]
- Tone of voice: [warm, confident, no hype]
- Real facts I want on the page (use only these, never invent numbers): [roast day
  Tuesday, 12 kg batches, 3 origins, 48 hours of rest, prices 12/13/14 EUR, free
  shipping over 40 EUR]

## Assets
Use only the images in ./public/images: [bag-hero.webp, bag-ethiopia.webp,
bag-colombia.webp, bag-brazil.webp, beans-left.webp, beans-right.webp,
roastery.webp]. Don't draw replacements and don't hotlink stock photos.

## Art direction
- Editorial: a large centred serif headline, generous negative space, a restrained
  palette defined once as CSS custom properties: [espresso, ember, honey, cream].
- Typography: [Fraunces] self-hosted from ./public/fonts for headings, the system
  sans-serif for body text. No third-party font CDNs.
- Hero composition: headline and two buttons centred at the top, the product bag
  centred below them, bean piles bleeding off the left and right edges, one short
  feature callout on each side of the bag.
- Mobile first: it must look intentional at 360 px wide, with a working mobile menu.

## Pages and sections
One page (index.html) with, in this order: announcement bar, header (links left, logo
centred, links and button right), hero, highlights strip, 3 product cards, how it works
(4 steps on top of the full-width photo, in frosted-glass cards), 3 pricing tiers with
the middle one highlighted, 3 testimonials clearly marked as samples, FAQ with native
<details>, final call to action, footer. Also a 404.html in the same style.

## Depth and motion
Pick these three effects and implement exactly this behaviour:
- Layered depth: the bean piles and the callouts move against the cursor at different
  strengths (closer layers move more), at most 36 px.
- The bag tilts in 3D perspective toward the cursor (rotateX/rotateY, at most 10
  degrees) and, while the hero scrolls away, rises 90 px and rotates 4 degrees; the bean
  piles drift outward at different speeds (scroll scrubbing).
- Product cards tilt toward the pointer with CSS perspective, at most 8 degrees.
- Optional, cinematic: a "brew it at home" section pinned for 2.5 screen heights,
  with ./public/video/[chemex-brew.mp4] next to 3 steps in HTML. The scroll progress
  sets the video's currentTime (scrolling back rewinds it) and highlights the
  current step. Fetch the clip as a blob only when the section is near, show
  ./public/images/[chemex-brew.webp] as the still before it loads and for reduced
  motion, and allow media-src 'self' blob: in the CSP.
Use GSAP with ScrollTrigger, installed with npm and bundled locally with esbuild from
src/motion.js into public/js/motion.js (committed). No CDN, so the CSP stays 'self'.
Load it with a dynamic import() only when prefers-reduced-motion is not set. Without
JavaScript, or with reduced motion, the page must be complete and static.

## Technical rules
- Plain HTML, CSS and vanilla JavaScript. No framework and no build step on deploy.
- Every file the browser loads goes in ./public.
- No inline <script> blocks, no inline event handlers and no style="" attributes, so a
  strict Content-Security-Policy works without 'unsafe-inline'.
- Add ./public/_headers with: Content-Security-Policy (default-src 'self',
  frame-ancestors 'none', plus media-src 'self' blob: for the clip), Strict-Transport-Security, X-Content-Type-Options: nosniff,
  Referrer-Policy and Permissions-Policy.
- Images: width and height attributes on every <img>, loading="lazy" below the fold,
  meaningful alt text on products and alt="" on decorative beans.
- Accessibility: semantic landmarks, one h1, a skip link, visible focus states, colour
  contrast of at least WCAG AA.
- SEO: a unique <title>, meta description, Open Graph tags and a theme colour.

## Cloudflare deployment files
- wrangler.jsonc with a "name" in lowercase letters and dashes, a "compatibility_date",
  and "assets": { "directory": "./public", "not_found_handling": "404-page" }.
  No "main" script: this is a static site.
- package.json with exact versions as devDependencies (wrangler, esbuild, gsap) and the
  scripts "dev": "wrangler dev", "deploy": "wrangler deploy" and "build:js" for the
  esbuild bundle.
- .gitignore for node_modules, .wrangler and .env files.

## Before you finish
Run `npx wrangler dev`, open the page at 1440 px and 390 px wide, with and without
JavaScript, and fix anything that overflows, overlaps or looks unfinished. Then list what
you built and anything I still need to replace (sample testimonials, e-mail address,
facts you were not given).
```

## Why the prompts are shaped like this

- **Photos first, in one request.** Realism comes from the images, not from the code. Generating them together keeps the light and colour consistent, so the page doesn't look like a collage.
- **Real facts only.** Coding agents fill gaps with invented numbers ("trusted by 10,000 customers"). Giving the facts and forbidding the rest keeps the site honest.
- **Named effects with numbers.** "Make it 3D and modern" gives a random result. Naming the object, the motion and its limits (36 px, 10 degrees) gives the one you pictured.
- **Progressive enhancement.** Some visitors turn motion off and some block scripts. The page must still be complete without the motion layer.
- **No inline scripts or styles.** This is what lets the `_headers` file ship a strict Content-Security-Policy.
- **The self-check at the end.** An agent with browser access that opens its own page at two widths catches many layout bugs before you see them.
