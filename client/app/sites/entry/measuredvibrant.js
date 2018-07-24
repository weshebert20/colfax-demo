// Measured Vibrant entry point

// Site styles
import '../../../scss/entries/measuredvibrant.scss'

// Main js setup
import '../../main'

// Site config and Site class
import { measuredvibrant } from '../config/measuredvibrant'
import { Site } from '../../classes/Site'

// Function necessary to asyc require site-specific components
const measuredvibrantAsync = function( callback ) {
  require.ensure( [], require => {
    // This is called from within the Site class, so `this` refers to the class
    this.asyncReqSite = require.context( '../../components-measuredvibrant' )
    callback()
  }, 'measuredvibrant-async' )
}

// Instantiate Site class
var measuredvibrantSite = new Site( measuredvibrant, measuredvibrantAsync )

// Spin up those components
measuredvibrantSite.init()

// Module should be hot-reloaded.
if ( module.hot ) {
  module.hot.accept()
}
