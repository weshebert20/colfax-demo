// 	Twin Cities entry point

// Site styles
import '../../../scss/entries/twincities.scss'

// Main js setup
import '../../main'

// Site config and Site class
import { twincities } from '../config/twincities'
import { Site } from '../../classes/Site'

// Function necessary to asyc require site-specific components
const twincitiesAsync = function( callback ) {
  require.ensure( [], require => {
    // This is called from within the Site class, so `this` refers to the class
    this.asyncReqSite = require.context( '../../components-twincities' )
    callback()
  }, 'twincities-async' )
}

// Instantiate Site class
var twincitiesSite = new Site( twincities, twincitiesAsync )

// Spin up those components
twincitiesSite.init()

// Module should be hot-reloaded.
if ( module.hot ) {
  module.hot.accept()
}
