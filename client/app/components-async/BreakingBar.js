import { Component } from '../classes/Component'

/**
 * Component for showing/hiding the breaking bar
 */
export class BreakingBar extends Component {
  /**
	 * Start the component (called when component is instantiated)
	 */
  start() {
    // Elements
    this.breakingClose = this.$element.find( '.icon-close' )

    // Inits
    this.initBreakingClose()

    // Find breaking article element
    var breakingArticle = this.$element.find( 'article[id|=\'breaking-article-id\']' )

    // Get the breaking element's id (this contains the article id)
    this.breakingArticleKey = breakingArticle.attr( 'id' )

    // If it's not null...
    if ( this.breakingArticleKey != null ) {
      // build the breaking article key by concatenating the id with the timestamp.
      // The built key will look like this: breaking-article-id-186532-2015-12-17 7:53
      this.breakingArticleKey += '-'
      this.breakingArticleKey += breakingArticle.find( 'time' ).attr( 'datetime' )

      // get browser's last viewed breaking article key
      var lastViewedBreakingArticleKey = sessionStorage.getItem( 'breakingArticleKey' )

      // if this key is the same as the last viewed key...
      if ( this.breakingArticleKey == lastViewedBreakingArticleKey ) {
        // close the breaking news message
        this.breakingClose.click()
      } else {
        this.$element.show()
      }
    }
  }

  /**
	 * Close and destroy the breaking bar on click
	 */
  initBreakingClose() {
    super.listener( this.breakingClose, 'click', ( e ) => {
      // remember the key in the browser
      sessionStorage.setItem( 'breakingArticleKey', this.breakingArticleKey )
      e.preventDefault()
      super.destroy()
    } )
  }
}
