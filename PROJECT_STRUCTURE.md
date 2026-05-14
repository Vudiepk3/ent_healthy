# Project Structure

This project stays vanilla JavaScript and keeps the existing JSON-driven rendering logic. Files are grouped by responsibility so the homepage, detail pages, data loading, SEO, and utility code are easier to maintain.

```text
ent-health-hub/
  index.html              Homepage document
  video.html              Video detail document
  news.html               News detail document
  server.js               Local server with /video/* and /news/* fallback routes
  vite.config.js          Multi-page build config
  netlify.toml            Netlify deep-link rewrites
  vercel.json             Vercel deep-link rewrites
  public/_redirects       Cloudflare Pages / Netlify redirect file

  src/
    app.js                App entry point, state, event handlers, global handlers
    styles.css            Shared stylesheet
    index.css             Legacy stylesheet entry

    config/
      site.js             Site constants, JSON URLs, PayPal, ad constants

    services/
      data.js             JSON fetch and local-to-remote fallback
      seo.js              document title, meta tags, canonical, OG/Twitter, JSON-LD

    renderers/
      site.js             Homepage cards, products, detail pages, related items

    utils/
      site.js             URL helpers, slug helpers, escaping, YouTube embeds

    data/
      videos.json
      news.json
      products.json
```

## Navigation Behavior

Video cards navigate to:

```text
/video.html?id=1&slug=tonsil-stone-removal-what-causes-tonsil-stones
```

News cards navigate to:

```text
/news.html?id=1&slug=deep-boogers-explained
```

The older clean URLs also remain supported by the local/production rewrite server:

```text
/video/tonsil-stone-removal-what-causes-tonsil-stones-1
/news/deep-boogers-explained-1
```

## Local Testing

For the simplest file-style detail URLs, VS Code Live Server on port `5500` can open:

```text
http://127.0.0.1:5500/video.html?id=1&slug=tonsil-stone-removal-what-causes-tonsil-stones
```

For clean URL rewrites, use the project server:

```sh
npm run start
```

Then open:

```text
http://127.0.0.1:3001/
```
