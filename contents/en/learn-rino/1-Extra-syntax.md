<!--
{
  "title": "Extra syntax",
  "time": "2025-04-14T03:40:00.000Z",
  "description": "Extra syntax Javascript / Typescript Templating Rino.js supports powerful templating capabilities using JavaScript or TypeScript. This feature allows dynamic creation of HTML content, such as integrating npm packages, reading files, or programmatically generating content. Only available for static site generation (SSG). Key Points: Use the @type attribute to specify the..."
}
-->

# Extra syntax

## Javascript / Typescript Templating

Rino.js supports powerful templating capabilities using JavaScript or TypeScript. This feature allows dynamic creation of HTML content, such as integrating npm packages, reading files, or programmatically generating content. Only available for static site generation (SSG).

### Key Points:

* Use the @type attribute to specify the language (js, javascript, ts, typescript).
* Print any content through console.log().
* Javascript/Typescript packages can be used.
* Since the HTML page path is passed as a process argument, you can generate page templates based on the HTML page path in shared components.

### Examples:

* Using JavaScript:

```
<script @type="js" type="text/javascript">
import os from "os";
console.log(os.type());
console.log("<div>Hello, Rino.js!</div>");
</script>
```

* Using TypeScript:

```
<script @type="ts" type="text/typescript">
import os from "os";
console.log(os.type());
console.log("<div>Hello, Rino.js with TypeScript!</div>");
</script>
```
## Markdown
Rino.js allows embedding Markdown directly within an HTML file. This complements the option to load Markdown from an external file using the @path attribute.

### Key Points:
- Use the @type attribute with values md or markdown.
- Escape the closing <\/script> tag by adding a backslash <\/.
### Example:
```
<script @type="md" type="text/markdown">
# Markdown Title
This is Markdown content inside an HTML file.
</script>
```