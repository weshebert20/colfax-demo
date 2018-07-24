// Mercury News entry point

// Site styles
import '../../../scss/entries/mercurynews.scss'

// Main js setup
import '../../main'

// Site config and Site class
import { mercurynews } from '../config/mercurynews'
import { Site } from '../../classes/Site'

// Function necessary to asyc require site-specific components
const mercurynewsAsync = function( callback ) {
  require.ensure( [], require => {
    // This is called from within the Site class, so `this` refers to the class
    this.asyncReqSite = require.context( '../../components-mercurynews' )
    callback()
  }, 'mercurynews-async' )
}

// Instantiate Site class
var mercurynewsSite = new Site( mercurynews, mercurynewsAsync )

// Spin up those components
mercurynewsSite.init()

// Module should be hot-reloaded.
if ( module.hot ) {
  module.hot.accept()
}
