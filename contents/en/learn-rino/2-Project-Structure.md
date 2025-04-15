<!--
{
  "title": "Project Structure",
  "time": "2025-04-14T01:21:00.000Z",
  "description": "Project Structure Rino build website based on project directory and file structure. Which means it is easy to learn and build a website with standard HTML, CSS, Javascript and Node.js. pages components mds public scripts export styles export rinoconfig.js contents contenttheme backoffice.bat&backoffice.sh /pages /pages directory is for putting base HTML..."
}
-->

# Project Structure
Rino build website based on project directory and file structure. Which means it is easy to learn and build a website with standard HTML, CSS, Javascript and Node.js.
```
- pages
- components
- mds
- public
- scripts
    - export
- styles
    - export
- rino-config.js
- contents
- content-theme
- backoffice.bat&backoffice.sh
```

## /pages
`/pages` directory is for putting base HTML files. So Rino is going to build your web pages based on this directory. File and directory structure is going to be exactly same.

## /components
`/components` directory is for putting component HTML files. Component can contain other components. But don't try to cause infinite error by looping with the same component. You can use component by syntax like this:
```
<component @path="" @tag="" />
```
`@path`: This attribute is required for importing a component. You need to place a path of component. For example, `@path="/header"` or `@path="/ko/footer"`.

`@tag`: This attribute is optional. However if you want to use HTML attribute on component tag, then you need to place a name of html element. For example, `@tag="div"` or
```
<component @path="/button" @tag="button" onclick="myFunction()" />
```
## /mds
`/mds` directory is for putting markdown files. Rino is going to load all of them and parse Markdown to HTML on request.

```
<script @type="md" @path="" @tag="" type="text/markdowns"></script>
```

`@type`: This attribute is required for using a markdown. You need to place `md` or `markdown`.

`@path`: This attribute is required for importing a markdown. You need to place a path of markdown.

`@tag`: This attribute is optional. However if you want to use HTML attribute on component tag, then you need to place a name of html element.


## /public
`/public` directory is for putting any static files. Images, external css, javascript library and any other assets can be placed here.

## /scripts
`/scripts` directory is for building your javascript library. You can use npm packages. And you can choose which one to be exported by placing javascript files in `/scripts/export/` directory. Rino is going to build your javascript and export to `/scripts` directory. So you can use the exported javascript file like how you normally would do in HTML. You can use typescript as well.

We are handling script with `import/export`, the module type. So the file name will be the name of script instance. So if it is `hello.js` or `hello.ts`. Then you got to call the function from outside like `hello.FunctionName()`. You can import them and do anything that is `javascript/typescript` browser development standard.

```
<script src="/scripts/example.js" />
```

## /styles
`/styles` directory is for building your css library. And you can choose which one to be exported by placing css files in `/styles/export/` directory. Rino is going to import local css files and build your css library and export to `/styles` directory. So you can use the exported css file like how you normally would do in HTML.
```
<link rel="stylesheet" href="/styles/example.css" />
```
Example of importing local css files:

```
@import "../header.css";
@import "../sidebar.css";
@import "../footer.css";            
```

## rino-config.js
`rino-config.js` is for confiuration of Rino. You can change distribution directory, change port number for development server, set site url for sitemap and adding sitemap.

## contents
`/contents` is for storing markdown contents for blogging. The file path/url structure is based on `/contents/theme/category/markdownfile.md`. So you have to place markdown files and directory based on that.

At the top of markdown file you can pass data of content in JSON test format with html commented like this:
```
<!--
{
  "title": "Project Structure",
  "time": "2025-04-15T01:21:00.000Z",
  "description": "Project Structure Rino build website based on project directory and file structure. Which means it is easy to learn and build a website with standard HTML, CSS, Javascript and Node.js. pages components mds public scripts export styles export contents contenttheme rinoconfig.js backoffice.bat & backoffice.sh..."
}
-->
```
These data is available with syntax like `{{ content.tiitle }}` within content theme pages.

## content-theme
`/content-theme` is for storing content template pages. The file path/url structure is based on `/contents-theme/theme/content.html` and `/contents-theme/theme/content-list.html`. The markdown contents is collected from same theme directory name from `/contents`.

For example, this website is using template page like this:
- `/content-theme/en/content.html`:
```
<!DOCTYPE html>
<html>

<head>
  <component @path="/en/head"></component>
  <meta name="description" content="{{content.description}}" />
  <meta property="og:title" content="{{ content.title }}" />
  <meta property="og:description" content="{{ content.description }}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://rinojs.org{{ content.urlPath }}" />
  <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml">
  <link rel="alternate" type="application/atom+xml" title="Atom" href="/atom.xml">
  <title>{{ content.title }}</title>
</head>

<body>
  <div class="top">
    <component @path="/en/sidebar"></component>
    <div class="top-right">
      <component @path="/en/header"></component>
      <main>
        <div class="content-container">
          <div class="content" id="content">
            <article>
              <p class="published-time">
                Published:
                <span id="published-time" data-raw-time="{{ content.time }}">
                  {{ content.time }}
                </span>
              </p>
              {{ content.body }}
            </article>
            <hr />
            <h3>Content Navigation:</h3>
            <nav class="content-navigation">
              <script @type="js" type="text/javascript">
                const args = process.argv;
                const contentDataString = args[args.length - 1];
                const contentData = JSON.parse(contentDataString);

                if (Array.isArray(contentData.nearby))
                {
                  const nearby = contentData.nearby;
                  const currentIndex = nearby.findIndex(post => post.link === contentData.urlPath);
                  let start = 0;
                  let end = nearby.length;

                  if (currentIndex !== -1)
                  {
                    const maxItems = 5;
                    const before = Math.min(2, currentIndex);
                    const after = Math.min(2, nearby.length - currentIndex - 1);
                    let total = 1 + before + after;

                    if (total < maxItems)
                    {
                      const extra = maxItems - total;
                      const moreBefore = Math.min(extra, currentIndex - before);
                      const moreAfter = Math.min(extra - moreBefore, nearby.length - currentIndex - 1 - after);

                      start = currentIndex - (before + moreBefore);
                      end = currentIndex + 1 + after + moreAfter;
                    }
                    else
                    {
                      start = currentIndex - before;
                      end = currentIndex + 1 + after;
                    }

                    const sliced = nearby.slice(start, end);
                    console.log(`<ul>`);
                    sliced.forEach(post =>
                    {
                      if (post.link === contentData.urlPath)
                      {
                        console.log(`<li><span>${post.title}</span></li>`);
                      }
                      else
                      {
                        console.log(`<li><a href="${post.link}">${post.title}</a></li>`);
                      }
                    });
                    console.log(`</ul>`);
                  }
                }
              </script>
            </nav>
          </div>
          <div class="tab2-content tab2-content--invisible" id="tab2-content">
            <component @path="/en/tab2-content"></component>
          </div>
        </div>
      </main>
    </div>
  </div>
  <component @path="/en/footer"></component>
</body>

</html>
```
- `/content-theme/en/content-list.html`:

```
<!DOCTYPE html>
<html>

<head>
  <component @path="/en/head"></component>
  <meta name="description" content="This is a page for navigating contents." />
  <meta property="og:title" content="Content List" />
  <meta property="og:description" content="This is a page for navigating contents." />
  <meta property="og:type" content="website" />

  <title>Content List</title>
</head>

<body>
  <div class="top">
    <component @path="/en/sidebar"></component>
    <div class="top-right">
      <component @path="/en/header"></component>
      <main>
        <div class="content-container">
          <div class="content" id="content">
            <article>
              <ol>
                <script @type="js" type="text/javascript">
                  var args = process.argv;
                  var contentListDataString = args[args.length - 1];
                  var contentListData = JSON.parse(contentListDataString);
                  var contentList = contentListData.contentList;

                  for (let i = 0; i < contentList.length; i++)
                  {
                    const item = contentList[i];
                    if (item?.title && item?.link)
                    {
                      console.log(`<li><a href="${item.link}">${item.title}</a></li>`);
                    }
                  }
                </script>
              </ol>
            </article>
          </div>
          <div class="tab2-content tab2-content--invisible" id="tab2-content">
            <component @path="/en/tab2-content"></component>
          </div>
          <hr />
          <nav class="content-list-navigation">
            <script @type="js" type="text/javascript">
              var args = process.argv;
              var contentListDataString = args[args.length - 1];
              var contentListData = JSON.parse(contentListDataString);
              var pagination = contentListData.pagination;

              if (pagination.prevLink)
              {
                console.log(`
                  <div>
                    <a href="${pagination.prevLink}">Previous List</a>
                  </div>
                `);
              }
              if (pagination.nextLink)
              {
                console.log(`
                  <div>
                    <a href="${pagination.nextLink}">Next List</a>
                  </div>
                `);
              }
            </script>
          </nav>
        </div>
      </main>
    </div>
  </div>
  <component @path="/en/footer"></component>
</body>

</html>
```


## backoffice.bat&backoffice .sh
`backoffice.bat` and `backoffice.sh` is for running a backoffice server for content management and image compression. This is built to help a website maintainer to maintain their website. They let you run `npm run backoffice` by double click on the file.