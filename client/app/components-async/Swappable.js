import { Component } from '../classes/Component'
import { Throttle } from '../components/Throttle'

/**
 * Component for elements that swap positions in the DOM between breakpoints
 */
export class Swappable extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Vars
    this.placeholderClass = 'swap-placeholder-' + this.id
    this.placeholder = $( '<div></div>' ).attr( 'class', this.placeholderClass )
    this.$placeholder = false
    this.shouldSwap = false
    this.swapped = false
    this.location = $( this.$element.data( 'swap-location' ) )
    this.method = this.$element.data( 'swap-method' )
    this.swapMin = this.$element.data( 'swap-min' ) || false
    this.swapMax = this.$element.data( 'swap-max' ) || false
    this.breakpointNames = Object.keys( this.breakpoints.breakpoints )

    if ( this.swapMin && this.swapMax &&
			( this.breakpointNames.indexOf( this.swapMax ) > this.breakpointNames.indexOf( this.swapMin ) )
    ) {
      // Breakpoint is exclusive (min is higher than max)
      this.breakpointType = 'exclusive'
    } else {
      // Breakpoint is inclusive (min is lower than max)
      this.breakpointType = 'inclusive'
    }

    // Inits
    this.initSwap()

    // Events
    // Swap on resize
    this.swapThrottle = new Throttle( this.initSwap, this, 'resize', $( window ), 500 )

    // Swap on orientation change
    $( window ).on( 'orientationChange', () => {
      this.initSwap()
    } )
  }

  /**
	 * Perform swapping action
	 */
  initSwap() {
    // Check the breakpoints provided to see if the element should move
    this.swapped = this.$element.hasClass( 'swapped' )
    this.$placeholder = $( `.${this.placeholderClass}` )

    if ( this.breakpointType === 'exclusive' ) {
      this.shouldSwap = this.checkBreakpoint( this.swapMin, false ) || this.checkBreakpoint( false, this.swapMax )
    } else if ( this.breakpointType === 'inclusive' ) {
      this.shouldSwap = this.checkBreakpoint( this.swapMin, this.swapMax )
    }

    if ( this.shouldSwap && !this.swapped ) {
      if ( this.location.length ) {
        // Add placeholder for the element. This allows us to swap back to the same location
        this.$element.before( this.placeholder )

        switch ( this.method ) {
          // Placed the swapped element after the location element
          case 'after':
            this.$element.insertAfter( this.location )
            break

            // Place the swapped element before the location element
          case 'before':
            this.$element.insertBefore( this.location )
            break

            // Add the swapped element as a child of the location element, at the end
          case 'append':
            this.$element.appendTo( this.location )
            break

            // Add the swapped element as a child of the location element, at the beginning
          case 'prepend':
            this.$element.prependTo( this.location )
            break
        }

        this.$element.addClass( 'swapped' )
      }
    } else if ( this.$placeholder.length && !this.shouldSwap && this.swapped ) {
      // When responsive styles are off, move the sidebar before the footer.
      this.$placeholder.after( this.element )
      this.$placeholder.remove()
      this.$element.removeClass( 'swapped' )
    }

    this.triggerAdEvent()
  }
}
