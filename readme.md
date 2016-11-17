# html-to-article-json[![Build Status](https://travis-ci.org/micnews/html-to-article-json.svg?branch=master)](https://travis-ci.org/micnews/html-to-article-json)

**html-to-article-json** parses & normalizes html to a well-structured & easy to use article json format.

The parsing logic is based on real articles - with sometimes very weird html - so please open an issue if some html doesn't get parsed correctly!

## Installation

```shell
npm install html-to-article-json
```

## Usage

### node.js

```js
var htmlToArticleJson = require('html-to-article-json')();
var htmlString = '<p>Foo<b>bar</b></p>';
var articleJson = htmlToArticleJson(htmlString);
```

### browserify

Using browseriy html-to-article-json can also use DOM as input in the browser!

```js
var htmlToArticleJson = require('html-to-article-json')();
var domElement = document.querySelector('article');
var articleJson = htmlToArticleJson(domElement);
```

## Format

`article-json` consists of a list of nodes, each node representing a block of content.

Please see the example (`npm run example`) for a simple WYSIWYG editor & the corresponding article json.

### Text

```json
{
  "type": "paragraph",
  "children": [{
    "type": "text",
    "content": "Hello, ",
    "href": null,
    "italic": false,
    "bold": false
  }, {
    "type": "text",
    "content": "mic.com",
    "href": "http://www.mic.com",
    "italic": true,
    "bold": false
  }]
}
```

The above is an example of a text node - corresponding to something like `<p>Hello, <a href="mic.com"><b>mic.com</b></a>`.

A text content node is defined by it's visual representation rather than it's code - so `html-to-article-json` will parse `<a href="mic.com"><b>mic.com</b></a>` and `<b><a href="mic.com">mic.com</a></b>` to the same json object.

Valid text nodes are `paragraph`, `header1`, `header2`, `header3`, `header4`, `header5` & `header6`.

### Embeds

```json
{
  "type": "embed",
  "embedType": "youtube",
  "youtubeId": "eBYFOJxZx4Q",
  "caption": [{
    "type": "text",
    "content": "Here's a video from ",
    "href": null,
    "italic": false,
    "bold": false
  }, {
    "type": "text",
    "content": "mic.com",
    "href": "http://www.mic.com",
    "italic": true,
    "bold": false
  }]
}
```

The above is an example of an embed node - corresponding to a youtube embed. The caption format is the same as the `children` array we have in the `Text` example.
