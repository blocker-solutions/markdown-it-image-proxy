/* eslint-disable */
const uglify = require('rollup-plugin-uglify')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const path = require('path')
const { curry } = require('lodash')

const isProduction = process.env.NODE_ENV === 'production'

const makeBanner = pkg => {
  const year = new Date().getFullYear()
  const yearString = (year === 2018) ? '2018' : `2018-${year}`

  return `// ${pkg.name} v${pkg.version}
// ${pkg.homepage}
// (c) ${yearString} Diego Hernandes.
  `
}

const babelPlugin = babel({})

const uglifyPlugin = uglify({
  compress: {
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    warnings: false
  }
})

const configFactory = curry((banner, pkgName, format, useBabel = true) => {
  let fileSuffix = `.${format}`
  const plugins = [
    resolve({
      module: false,
      main: true,
      preferBuiltins: false
    })
  ]

  if (useBabel === true) {
    plugins.push(babelPlugin)
  }

  // if (format !== 'es') {
  //   fileSuffix = `${fileSuffix}.es5`
  //
  //   plugins.push(babelPlugin)
  // }

  if (isProduction) {
    fileSuffix = `${fileSuffix}.min`
    plugins.push(uglifyPlugin)
  }

  return {
    input: './lib/index.js',
    plugins,
    output: {
      banner,
      format,
      name: pkgName,
      globals: pkgName,
      file: `./dist/index${fileSuffix}.js`,
      exports: 'auto'
    },
    external(id) {
      return id.includes('node_modules')
    }
  }
})

const rollupFactory = (dirname, pkgName) => {
  const pkg = require(path.resolve(dirname, './package.json'))
  const banner = makeBanner(pkg)
  const factory = configFactory(banner, pkgName)

  return [
    factory('umd', true),
    factory('amd', true),
    factory('es', false),
    factory('cjs', false)
  ]
}

module.exports = rollupFactory(__dirname, 'markdown-it-mixed-html-fix')
