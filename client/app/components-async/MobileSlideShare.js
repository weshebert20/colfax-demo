import { Component } from '../classes/Component'

/**
 * Slide-out share buttons on mobile header
 */
export class MobileSlideShare extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.slideTrigger = this.$element.find( '.share-alt' )

    // Inits
    if ( this.checkBreakpoint( false, 's' ) ) {
      this.initSlideShare()
    }
  }

  /**
	 * Initialize click handler for mobile share
	 */
  initSlideShare() {
    this.slideTrigger.on( 'click', ( e ) => {
      e.preventDefault()

      this.$element
        .toggleClass( 'open' )
    } )
  }
}
