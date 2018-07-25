#!/usr/bin/env node
'use strict'

const path = require('path')
const penthouse = require('penthouse')
const fs = require('fs')
const cssnano = require('cssnano')
const postcss = require('postcss')
const pageOpts = ['home', 'article']
const siteOptions = {
  twincities: {
    home: 'http://twincities.com',
    article: 'http://www.twincities.com/2016/10/21/st-pauls-skyway-to-nowhere-will-be-demolished-someday/'
  },
  denverpost: {
    home: 'http://denverpost.com',
    article: 'http://www.denverpost.com/2016/10/21/rtd-a-line-design-delays-lightning-issues/'
  },
  mercurynews: {
    home: 'http://mercurynews.com',
    article: 'http://www.mercurynews.com/2016/10/21/california-adds-30000-jobs-in-september-unemployment-rate-unchanged/'
  },
  eastbaytimes: {
    home: 'http://eastbaytimes.com',
    article: 'http://www.eastbaytimes.com/2016/10/21/golden-state-warriors-tickets-for-free-oakland-and-alameda-county-pols-use-free-suites-for-friends-family-cronies/'
  },
  siliconvalley: {
    home: 'http://siliconvalley.com',
    article: 'http://www.siliconvalley.com/2016/10/21/wolverton-rokus-express-a-digital-streaming-bargain/'
  },
  // @todo change this to dev site once wp development begins
  modernearthy: {
    home: 'http://siliconvalley.com',
    article: 'http://www.siliconvalley.com/2016/10/21/wolverton-rokus-express-a-digital-streaming-bargain/'
  },
  // @todo change this to dev site once wp development begins
  measuredvibrant: {
    home: 'http://siliconvalley.com',
    article: 'http://www.siliconvalley.com/2016/10/21/wolverton-rokus-express-a-digital-streaming-bargain/'
  },
  // @todo change this to dev site once wp development begins
  boldcoastal: {
    home: 'http://siliconvalley.com',
    article: 'http://www.siliconvalley.com/2016/10/21/wolverton-rokus-express-a-digital-streaming-bargain/'
  },
  // @todo change this to dev site once wp development begins
  dailynews: {
    home: 'http://www.dailynews.com',
    article: 'http://www.dailynews.com/name-of-sample-article'
  }
}
const entry = process.env.ENTRY
const forceInclude = {
  global: [
    '.nav-primary',
    '.pushnav',
    '.breaking-bar',
    '.status-bar',
    '.trending-bar',
    '.header-search',
    '.takeover',
    '.daily-deals-flyout',
    '.logo a'
  ],
  home: [
    '.feature-primary',
    '.slow',
    '.busy',
    '.takeover'
  ],
  article: [
    '.header-features',
    '.highlights',
    '.body-copy',
    '.meta',
    '.popular',
    '.article-body',
    '.article-slideshow',
    '.full-view .article-sidebar',
    '.full-view footer'
  ]
}

prepare()

function prepare () {
  let sites = {}
  let siteNames = []
  let pageNames = []
  let versions
  let assets
  let siteDepth = 0
  let pageDepth = 0

  // Manage entry
  if (entry === undefined || entry === 'all') {
    sites = siteOptions
  } else {
    sites[entry] = siteOptions[entry]
  }

  // Get versions, if possible
  try {
    versions = fs.readFileSync(path.join(__dirname, '../../static/dfm.version.json'), 'utf8')
  } catch (e) {
    console.warn('Could not find version file', e)
    return
  }

  assets = JSON.parse(versions)
  siteNames = Object.keys(sites)

  processCritical(
    sites,
    assets,
    siteNames[siteDepth],
    pageOpts[pageDepth],
    siteDepth,
    pageDepth
  )
}

function processCritical (sites, assets, currentSite, currentPage, siteDepth, pageDepth) {
  let newPageDepth = pageDepth
  let newSiteDepth = siteDepth
  let siteNames = Object.keys(sites)
  let currentForceInclude = forceInclude.global.concat(forceInclude[currentPage])
  console.log(`${currentSite}: parsing ${currentPage} critical CSS`)

  if (pageDepth < pageOpts.length - 1) {
    newPageDepth += 1
  } else {
    newPageDepth = 0

    if (siteDepth < siteNames.length) {
      newSiteDepth += 1
    }
  }

  currentForceInclude = currentForceInclude.map(
    (selector) => new RegExp(`.*\\${selector}.*`)
  )

  penthouse({
    url: sites[currentSite][currentPage],
    css: path.join(__dirname, '../../static', assets[`${currentSite}-css`]),
    forceInclude: currentForceInclude,
    maxEmbeddedBase64Length: 24000
  }, function (err, output) {
    cssnano.process(output)
      .then((result) => {
        fs.writeFileSync(
          path.join(__dirname, '../../static/css', `${currentSite}-${currentPage}-critical.css`),
          result.css
        )
        console.log(`${currentSite}: ${currentPage} critical CSS generated`)

        if (newSiteDepth < siteNames.length) {
          processCritical(
            sites,
            assets,
            siteNames[newSiteDepth],
            pageOpts[newPageDepth],
            newSiteDepth,
            newPageDepth
          )
        }
      })
  })
}
