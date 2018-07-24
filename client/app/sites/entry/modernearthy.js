// Modern Earthy entry point

// Site styles
import '../../../scss/entries/modernearthy.scss'

// Main js setup
import '../../main'

// Site config and Site class
import { modernearthy } from '../config/modernearthy'
import { Site } from '../../classes/Site'

// Function necessary to asyc require site-specific components
const modernearthyAsync = function( callback ) {
  require.ensure( [], require => {
    // This is called from within the Site class, so `this` refers to the class
    this.asyncReqSite = require.context( '../../components-modernearthy' )
    callback()
  }, 'modernearthy-async' )
}

// Instantiate Site class
var modernearthySite = new Site( modernearthy, modernearthyAsync )

// Spin up those components
modernearthySite.init()

// Module should be hot-reloaded.
if ( module.hot ) {
  module.hot.accept()
}
