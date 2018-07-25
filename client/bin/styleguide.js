#!/usr/bin/env node
const styleguide = require('sc5-styleguide/lib/modules/cli/styleguide-cli')
const fs = require('fs-extra')
const path = require('path')
const entry = process.env.ENTRY
const port = process.env.PORT
const staticDir = path.join(__dirname, '../../static')
const clientDir = path.join(__dirname, '../')
const styleguideDir = path.join(__dirname, `../../${entry}-styleguide`)
const assets = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../static/dfm.version.json'), 'utf8')
)
const cssPath = assets[`${entry}sg-css`]

const fonts = {
  twincities: 'https://fonts.googleapis.com/css?family=Oswald:700,400|Hind:600,700|Roboto+Condensed:400,700|Source+Sans+Pro:400,700,400italic',
  denverpost: 'https://fonts.googleapis.com/css?family=Source+Serif+Pro:400,400italic,600,600italic,700,700italic|Source+Sans+Pro:400,400italic,600,600italic,700,400italic',
  mercurynews: 'https://fonts.googleapis.com/css?family=PT+Serif:400,400italic,700,700italic|PT+Sans:400,400italic,700,700italic',
  siliconvalley: 'https://fonts.googleapis.com/css?family=Montserrat:400,700|Open+Sans:400,600,700',
  modernearthy: 'https://fonts.googleapis.com/css?family=Poppins:400,600,700|Source+Serif+Pro:400,700',
  boldcoastal: 'https://fonts.googleapis.com/css?family=Droid+Sans:400,700|Droid+Serif:400,400i,700,700i',
  dailynews: 'https://fonts.googleapis.com/css?family=Poppins:400,600,700|Source+Serif+Pro:400,700',
  measuredvibrant: 'https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i|Lora:400,400i,700,700i'
}

styleguide({
  // Styleguide title
  title: `${entry} Styleguide`,

  // Styleguide overview path
  overviewPath: 'client/scss/styleguide.md',

  disableEncapsulation: true,

  // KSS source material
  kssSource: [
    `client/scss/${entry}/**/*.scss`
  ],

  // Stylesheets to include
  // global.css: primary site styles
  // styleguide.css: styleguide-only styles
  styleSource: [
    `static/${cssPath}`
  ],

  // Common wrapper class
  commonClass: `sg-common sg-common-${entry}`,

  // Extra markup to inlcude in the document <head>
  // 1: styleguide chrome styles
  extraHead: [
    `<link rel="stylesheet" type="text/css" href="${fonts[entry]}">`
  ],

  // Custom styleguide scss
  customColors: 'client/scss/alleysg.css',

  // Output path
  output: `${entry}-styleguide`,

  // Watch for changes
  watch: true,

  // Serve
  server: true,

  // Port
  port: port || 3000,

  sideNav: false
})

// Ensure generated styleguide dir is accessible
fs.ensureDir(styleguideDir)
fs.chmodSync(styleguideDir, '777')

// Copy external static assets
const externalStatic = [
  'fonts',
  'images'
]

// Additional CSS files
const externalCSS = [
  `${cssPath}.map`
]

// Copy external static directories
externalStatic.forEach(dir => {
  fs.copy(
    path.join(staticDir, dir),
    path.join(styleguideDir, dir),
    {clobber: true}
  )
})

// Copy external CSS
externalCSS.forEach(file => {
  file = file.replace('css/', '')

  fs.copy(
    path.join(staticDir, 'css', file),
    path.join(styleguideDir, file),
    {clobber: true}
  )
})

fs.copy(path.join(clientDir, 'scss/alley-logo-black.svg'), path.join(styleguideDir, 'alley-logo-black.svg'))
