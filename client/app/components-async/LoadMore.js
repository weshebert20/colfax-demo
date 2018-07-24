import { Component } from '../classes/Component'

/**
 * Component for Load More button functionality
 */
export class LoadMore extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.loadMoreWrapper = $( '.load-more-wrapper' )

    // Inits
    this.initAjax( this.$element )
  }

  /**
	 * Initialize ajax call when user clicks load more button
	 * @param {object} el - jQuery object on which to create ajax callback for click handler
	 */
  initAjax( el ) {
    el.click( ( e ) => {
      e.preventDefault()

      el.text( 'Loading...' )

      $.get( el.attr( 'href' ), ( response ) => {
        // Remove old 'load more' button from DOM
        if ( el.parents( this.options.postNav ).length ) {
          el.parents( this.options.postNav ).remove()
        } else {
          el.remove()
        }

        // Iterate through response and remove anything that is not an article
        var filteredResponse = $( response ).find( '.load-more-wrapper' ).children().each( function( index, elem ) {
          // Check if the response contains article information or navigation links
          var containsArticleInfo = $( elem ).html().indexOf( 'class="article-info"' ) > -1
          var containsNavigation = $( elem ).html().indexOf( 'class="nav-links"' ) > -1

          // If doesn't contain any of those elements,  replace the html content
          if ( !containsArticleInfo && !containsNavigation ) {
            // do not delete the html inside the load more anchor tag
            if ( !$( elem ).hasClass( 'load-more' ) ) {
              $( elem ).html( '' )
            }
          }
        } ).parent()

        // Append next page of articles to end of article list
        this.loadMoreWrapper
          .append(
            $( filteredResponse ).html()
          )

        // Initialize click handler for new 'load more' button
        this.initAjax( this.loadMoreWrapper.find( '.load-more' ) )
      } )
    } )
  }
}
