# @blocker/markdown-it-image-proxy

Automatically prefix a Proxy URL for images.

Sometimes, you don't want to load remote content without some backend filtering, or any may be your motives.

One example, https://steemitimages.com/0x0/http://original-url-here.com

### Install

```
npm install --save @blocker/markdown-it-image-proxy
// or
yarn add @blocker/markdown-it-image-proxy
```


### Usage

```javascript
const MarkdownIt = require('markdown-it')
const imageProxy = require('@blocker/markdown-it-image-proxy')

const md = new MarkdownIt()
md.use(imageProxy, {
  // default proxy URL prefix.
  proxy: 'https://steemitimages.com/0x0/',
  // bypass for images on the following domains (defaults to none).
  trusted: [
    'https://i.imgur.com',
    'https://image.ibb.co'
  ]
})
```
