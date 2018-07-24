import { Component } from '../classes/Component'

/**
 * Component for small JS tasks necessary in hompage and section featured areas
 */
export class LandingFeature extends Component {
  /**
	 * Start the component (called when component is instantiated)
	 */
  start() {
    // Elements
    this.rightCol = this.$element.find( this.options.rightCol )

    // Inits
    this.initSlowSidebar()
  }

  /**
	 * Set height of Slow day right sidebar
	 */
  initSlowSidebar() {
    if ( this.checkBreakpoint( 's', false ) ) {
      this.$element.css(
        'min-height',
        this.rightCol.outerHeight( true )
      )
    }
  }
}
