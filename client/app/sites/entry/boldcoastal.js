// Bold Coastal entry point

// Site styles
import '../../../scss/entries/boldcoastal.scss'

// Main js setup
import '../../main'

// Site config and Site class
import { boldcoastal } from '../config/boldcoastal'
import { Site } from '../../classes/Site'

// Function necessary to asyc require site-specific components
const boldcoastalAsync = function( callback ) {
  require.ensure( [], require => {
    // This is called from within the Site class, so `this` refers to the class
    this.asyncReqSite = require.context( '../../components-boldcoastal' )
    callback()
  }, 'boldcoastal-async' )
}

// Instantiate Site class
var boldcoastalSite = new Site( boldcoastal, boldcoastalAsync )

// Spin up those components
boldcoastalSite.init()

// Module should be hot-reloaded.
if ( module.hot ) {
  module.hot.accept()
}
