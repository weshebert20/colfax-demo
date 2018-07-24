import { Component } from '../classes/Component'

/**
 * Component for expanding/collapsing highlights on a longform article
 */
export class ArticleHighlights extends Component {
  /**
	 * Start the component (called when component is instantiated)
	 */
  start() {
    // Elements
    this.highlightsTitle = this.$element.find( '.widget-title' )
    this.highlightsList = this.$element.find( '.highlights-content' )
    this.arrow = this.$element.find( '.icon-arrow-down' )
    this.skipBreakpoint = this.options.skipBreakpoint || false

    // Inits
    if ( this.checkBreakpoint( false, 'l' ) || this.skipBreakpoint ) {
      this.initMenus()
    }
  }

  /**
	 * Initialize the article highlights expand/colllapse functionality
	 */
  initMenus() {
    // Highlights expand/collapse works on click
    super.listener( this.highlightsTitle, 'click', ( e ) => {
      e.preventDefault()

      this.highlightsList.slideToggle()
      this.$element.toggleClass( 'open' )
    } )
  }
}
