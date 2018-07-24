// Silicon Valley entry point

// Site styles
import '../../../scss/entries/siliconvalley.scss'

// Main js setup
import '../../main'

// Site config and Site class
import { siliconvalley } from '../config/siliconvalley'
import { Site } from '../../classes/Site'

// Function necessary to asyc require site-specific components
const siliconvalleyAsync = function( callback ) {
  require.ensure( [], require => {
    // This is called from within the Site class, so `this` refers to the class
    this.asyncReqSite = require.context( '../../components-siliconvalley' )
    callback()
  }, 'siliconvalley-async' )
}

// Instantiate Site class
var siliconvalleySite = new Site( siliconvalley, siliconvalleyAsync )

// Spin up those components
siliconvalleySite.init()

// Module should be hot-reloaded.
if ( module.hot ) {
  module.hot.accept()
}
