import { Component } from '../classes/Component'

/**
 * Component for trending flyout on mobile
 */
export class Trending extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.trendingNav = $( '.trending-nav' )

    // Inits
    this.initTrendingFlyout()
  }

  /**
	 * Add click handler for trending nav item on mobile
	 */
  initTrendingFlyout() {
    if ( this.checkBreakpoint( false, 'm' ) ) {
      this.trendingNav.on( 'click', () => {
        this.$element.toggle()
        this.parentSite.callComponentMethod( 'editorspicks', 'close' )
        this.trendingNav.toggleClass( 'active' )
      } )
    }
  }

  /**
	 * Close the trending nav
	 */
  close() {
    this.$element.hide()
    this.trendingNav.removeClass( 'active' )
  }
}
