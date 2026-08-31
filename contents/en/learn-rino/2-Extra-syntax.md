<!--
{
  "title": "Extra Syntax",
  "time": "2025-04-14T03:40:00.000Z",
  "description": "Use Markdown, build-time JavaScript and TypeScript templates, and inline CSS or JavaScript exports in Rino.js v3."
}
-->

# Extra Syntax

Rino.js extends HTML with Markdown rendering, build-time template scripts, and inline asset exports.

## Markdown

Store reusable Markdown in `mds/`, then import it with `rino-import`:

```html
<script rino-type="md" rino-import="intro" rino-tag="section" class="intro"></script>
```

This reads `mds/intro.md`. The `.md` extension is omitted. `rino-type="markdown"` is also supported, and the default wrapper is `div` when `rino-tag` is absent.

Markdown can also be written inline:

```html
<script rino-type="markdown" rino-tag="section" type="text/markdown">
  ## Hello

  This is **Markdown** inside an HTML file.
</script>
```

## Build-time JavaScript and TypeScript

Template scripts run while Rino.js generates the page and insert their standard output into the HTML. They are not browser scripts.

```html
<script rino-type="js" type="text/javascript">
  import os from "os";
  console.log(`<p>Built on ${os.type()}</p>`);
</script>
```

```html
<script rino-type="ts" type="text/typescript">
  const message: string = "Generated with TypeScript";
  console.log(`<p>${message}</p>`);
</script>
```

Supported values are `js`, `javascript`, `ts`, and `typescript`. Template scripts may import Node.js modules. Build data is JSON in `process.argv[1]`; content templates also receive content data as the last process argument.

## Inline asset exports

Small styles or browser scripts owned by a page or component can be collected into output files:

```html
<style rino-export="/site.css">
  .callout { padding: 1rem; }
</style>

<script rino-export="/site.js">
  window.showMessage = () => alert("Hello");
</script>
```

The tags are removed from the final HTML and written to `dist/styles/site.css` and `dist/scripts/site.js`. Reference them normally. Use a `.ts` export path or `rino-type="ts"` to compile an export from TypeScript. Multiple tags may target one file: unique blocks are appended and exact duplicates are ignored. Export paths cannot contain `..`.

Functions needed by HTML event handlers may be attached to `window`, because bundled top-level declarations are scoped to the bundle.
