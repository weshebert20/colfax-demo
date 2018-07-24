import { Component } from '../classes/Component'

/**
 * Component for slide-out search form in header
 */
export class SlideSearch extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.header = $( this.options.header )
    this.notify = $( this.options.notify )
    this.slideTrigger = this.header.find( '.icon-search' )
    this.searchInput = this.$element.find( '[type="text"]' )

    // Functions and Classes
    this.throttle = null

    // Opts
    this.slideBp = this.options.breakpoint || 'm'

    // Inits
    this.initSlideNav()
  }

  /**
	 * Add click handler for search icon
	 */
  initSlideNav() {
    if ( this.checkBreakpoint( false, this.slideBp ) ) {
      this.slideTrigger.click( ( e ) => {
        e.preventDefault()
        this.toggleSlideNav()
      } )
    } else {
      this.slideTrigger.click( ( e ) => {
        e.preventDefault()
        $( this.options.altsearch ).submit()
      } )
    }
  }

  /**
	 * Toggle the sliding search form
	 */
  toggleSlideNav() {
    if ( !this.$element.hasClass( 'search-open' ) ) {
      this.openSlideNav()
    } else {
      this.closeSlideNav()
    }
  }

  /**
	 * Open the sliding search form
	 */
  openSlideNav() {
    this.$element
      .add( this.options.notify )
      .addClass( 'search-open' )

    this.searchInput.focus()
  }

  /**
	 * Close the sliding search form
	 */
  closeSlideNav() {
    this.$element
      .add( this.options.notify )
      .removeClass( 'search-open' )

    this.searchInput.blur()
  }
}
