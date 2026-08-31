<!--
{
  "title": "Installation and Commands",
  "time": "2025-04-12T01:21:00.000Z",
  "description": "Install Rino.js v3, configure an ESM project, create build scripts, and run development, generation, sitemap, feed, and backoffice commands."
}
-->

# Installation and Commands

## Installation

Install a current Node.js release, then create a starter project:

```bash
npm create rino@latest
```

To add Rino.js manually to an ESM project:

```bash
npm install rinojs
```

Your `package.json` should contain `"type": "module"` and scripts such as:

```json
{
  "type": "module",
  "scripts": {
    "dev": "node dev.js",
    "generate": "node generate.js",
    "generate-all": "node generate.js && node sitemap.js && node feed.js",
    "generate-sitemap": "node generate.js && node sitemap.js",
    "sitemap": "node sitemap.js",
    "feed": "node feed.js",
    "backoffice": "node backoffice.js"
  },
  "dependencies": { "rinojs": "^3.0.0" }
}
```
## Commands

- Development server: `npm run dev`
- Build the website: `npm run generate`
- Build the website and sitemap: `npm run generate-sitemap`
- Build the website, sitemap, and feeds: `npm run generate-all`
- Build only the sitemap: `npm run sitemap`
- Build only RSS and Atom feeds: `npm run feed`
- Run the backoffice server: `npm run backoffice`

The development server builds into memory and watches project files. A static build writes to `dist` by default; change it with `dist` in `rino-config.js`.
