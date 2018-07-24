// Mercury News entry point

// Site styles
import '../../../scss/entries/eastbaytimes.scss'

// Main js setup
import '../../main'

// Site config and Site class
import { eastbaytimes } from '../config/eastbaytimes'
import { Site } from '../../classes/Site'

// Function necessary to asyc require site-specific components
const eastbaytimesAsync = function( callback ) {
  require.ensure( [], require => {
    // This is called from within the Site class, so `this` refers to the class
    this.asyncReqSite = require.context( '../../components-eastbaytimes' )
    callback()
  }, 'eastbaytimes-async' )
}

// Instantiate Site class
var eastbaytimesSite = new Site( eastbaytimes, eastbaytimesAsync )

// Spin up those components
eastbaytimesSite.init()

// Module should be hot-reloaded.
if ( module.hot ) {
  module.hot.accept()
}
