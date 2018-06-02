// Image Proxy plugin for Markdown-It

// imports.
import { get, find, toArray } from 'lodash'

// bypass trusted hosts.
const shouldBypass = (trustedHosts = [], candidateURL) => {
  const found = find(trustedHosts, (host) => {
    return candidateURL.indexOf(host) === 0
  })

  return !!found
}

// get default renderer.
const getImageRenderer = (md) => md.renderer.rules.image || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

// extract image URL from token.
const extractImageURL = (token) => {
  // find the index of the src attribute on the image being parsed.
  let aIndex = token.attrIndex('src')

  // return the image URL.
  return (aIndex < 0) ? null : token.attrs[aIndex][1]
}

// replace the image URL on token.
const replaceImageURL = (token, newURL) => {
  // find the index of the src attribute on the image being parsed.
  let aIndex = token.attrIndex('src')

  // avoid when not found.
  if (aIndex < 0) {
    return false
  }

  // replace.
  token.attrs[aIndex][1] = newURL

  // return the token itself.
  return token
}

// main plugin function.
export default function (md, options) {
  // get the default renderer.
  const defaultRenderer = getImageRenderer(md)
  // get the proxy URL from options.
  const proxy = get(options, 'proxy', null)
  // get the trusted hosts.
  const trusted = toArray(get(options, 'trusted', []))

  // avoid if no proxy was set.
  if (!proxy) {
    return
  }

  // override the image rule.
  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    // alias the current token on a local variable.
    let token = tokens[idx]
    // extract the image URL from the image token.
    const imageURL = extractImageURL(token)

    // bypass if no URL was found.
    if (!imageURL) {
      return defaultRenderer(tokens, idx, options, env, self)
    }

    // bypass if the host is trusted.
    if (shouldBypass(trusted, imageURL)) {
      return defaultRenderer(tokens, idx, options, env, self)
    }

    // replace the token URL.
    replaceImageURL(token, proxy + imageURL)

    // pass token to default renderer.
    return defaultRenderer(tokens, idx, options, env, self)
  }
}
