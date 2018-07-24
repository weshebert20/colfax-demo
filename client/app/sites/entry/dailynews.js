// Los Angeles Daily News entry point

// Site styles
import '../../../scss/entries/dailynews.scss'

// Main js setup
import '../../main'

// Site config and Site class
import { dailynews } from '../config/dailynews'
import { Site } from '../../classes/Site'

// Function necessary to asyc require site-specific components
const dailynewsAsync = function( callback ) {
  require.ensure( [], require => {
    // This is called from within the Site class, so `this` refers to the class
    this.asyncReqSite = require.context( '../../components-dailynews' )
    callback()
  }, 'dailynews-async' )
}

// Instantiate Site class
var dailynewsSite = new Site( dailynews, dailynewsAsync )

// Spin up those components
dailynewsSite.init()

// Module should be hot-reloaded.
if ( module.hot ) {
  module.hot.accept()
}
