# Cloudflare website template

A professional one-page website that you can host for free on [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/), with automatic deploys from GitHub. Every merge to `main` goes to production.

The demo brand, **Ember Lane Coffee**, is fictional. Replace the text, colours and facts with your own.

## What's inside

```text
public/              Everything the browser loads
  index.html         The page
  404.html           Shown for any URL that doesn't exist
  styles.css         All styles (colour tokens at the top)
  main.js            Menu, scroll reveal, card tilt, loads the motion layer
  js/motion.js       GSAP depth and scroll effects, bundled from src/
  images/            AI-generated product photos (WebP) and the brew still
  video/             The Chemex clip the scroll plays
  fonts/             Fraunces, self-hosted (SIL Open Font License, see OFL.txt)
  _headers           Security headers (CSP, HSTS, nosniff...)
src/motion.js        Source of the motion layer
wrangler.jsonc       Tells Cloudflare to serve ./public as static assets
PROMPT.md            The prompts for the photos and for the site
```

No framework and no build step on deploy: what you see in `public/` is what gets deployed. The motion layer is the one bundled file; if you edit `src/motion.js`, run `npm run build:js` and commit the result.

The motion layer only loads when the visitor hasn't asked for reduced motion. Without it, or without JavaScript, the page is complete and static.

The product photos were generated with AI for this fictional brand. Replace the brew clip in `public/video/` with your own footage when you use this template for a real business. GSAP is free to use under its own [standard license](https://gsap.com/standard-license), which is not MIT.

## Run it locally

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:8787.

## Deploy it for free

1. Use this repository as a template (or fork it) and push it to your own GitHub account.
2. In the Cloudflare dashboard, go to **Workers & Pages**, select **Create application**, connect GitHub and pick your repository.
3. Keep the Worker name equal to the `name` in `wrangler.jsonc` (the build fails otherwise), keep the default deploy command (`npx wrangler deploy`) and deploy.
4. Your site is live at `https://<name>.<your-subdomain>.workers.dev`.
5. Optional: add your own domain under the Worker's **Settings > Domains & Routes**.

The full step-by-step guide is in the article and the video linked below.

## Make it yours

- Change the `name` in `wrangler.jsonc` (it becomes your free URL).
- Edit the colour tokens at the top of `public/styles.css`.
- Replace the sample testimonials and the `hello@example.com` address.
- Or paste `PROMPT.md` into your AI coding agent and generate a new site for your own business.

## License

The code is MIT. The images, the video and the font are not covered by it: replace the media with your own, and Fraunces keeps the SIL Open Font License.
