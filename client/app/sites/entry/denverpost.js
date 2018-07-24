// Denver Post entry point

// Site styles
import '../../../scss/entries/denverpost.scss'

// Main js setup
import '../../main'

// Site config and Site class
import { denverpost } from '../config/denverpost'
import { Site } from '../../classes/Site'

// Function necessary to asyc require site-specific components
const denverpostAsync = function( callback ) {
  require.ensure( [], require => {
    // This is called from within the Site class, so `this` refers to the class
    this.asyncReqSite = require.context( '../../components-denverpost' )
    callback()
  }, 'denverpost-async' )
}

// Instantiate Site class
var denverpostSite = new Site( denverpost, denverpostAsync )

// Spin up those components
denverpostSite.init()

// Module should be hot-reloaded.
if ( module.hot ) {
  module.hot.accept()
}
