import { Component } from '../classes/Component'
import { Throttle } from '../components/Throttle'

/**
 * Component for moving sidebar elements into the article body on mobile
 */
export class SectionSticky extends Component {
  /**
	 * Start the component
	 */
  start() {
    // Elements
    this.sidebar = $( this.options.sidebar )
    this.content = $( this.options.content )
    this.feature = $( this.options.feature )
    this.sections = this.content.find( this.options.section )
    this.trigger = $( this.options.trigger )
    this.sidebarWidget = this.sidebar.find( this.options.sidebarWidgetClass )

    // Flags and Values
    this.shouldStick = false
    this.adTop = 0
    this.sidebarHeight = 0
    this.stickyTop = 0 // sticky ad start position
    this.stickyBot = 0 // sticky ad stop position
    this.stickyRight = 0 // sticky ad right position

    // Inits
    if ( this.feature.length ) {
      this.initStick()
    } else {
      this.triggerAdEvent()
    }
  }

  /**
	 * Place switch for sticky ad behavior on desktop vs. mobile
	 */
  initStick() {
    if ( this.checkBreakpoint( 'l', false ) ) {
      this.initValues()
      this.initAdFloat()
    } else {
      this.placeStickyAd()
    }

    this.triggerAdEvent()
  }

  /**
	 * Insert sticky ad among section highlights below 1040px
	 */
  placeStickyAd() {
    let insertEl

    if ( this.sections.length > 2 ) {
      insertEl = this.sections.eq( 1 )
    } else {
      insertEl = this.content
    }

    this.$element.insertAfter( insertEl )
  }

  /**
	 * Initialize debouncer for watching ad positioning
	 */
  initAdFloat() {
    this.scrollThrottle = new Throttle( this.stickyScroll, this, 'scroll', $( window ) )
    this.resizeThrottle = new Throttle( this.stickyResize, this, 'resize', $( window ) )
    this.stickyThrottle = new Throttle( this.stickyHelper, this, 'scroll', $( window ), 1000 )
  }

  /**
	 * Helper for re-calculating sticky ad and lower ad positioning
	 */
  stickyHelper() {
    this.initValues()
    this.checkPosition()
  }

  /**
	 * Create values necessary for calculating positions
	 */
  initValues() {
    // Ad top position, used when sticky ad is sticking
    this.adTop = $( 'body' ).is( '.admin-bar' ) ? 82 : 50

    // Sidebar height, used to place sticky ad before stick
    this.sidebarHeight = this.sidebar.outerHeight()

    this.setStickyRight()
    this.setStickyTop()
    this.setStickyBottom()
  }

  /**
	 * Caclulate right value
	 */
  setStickyRight() {
    // Value necessary to align sticky ad with article sidebar elements
    this.stickyRight = this.sidebar.offset().left +
			( this.sidebar.outerWidth() - 300 ) / 2
  }

  /**
	 * Calculate top value and trigger point
	 */
  setStickyTop() {
    // Ensures sticky ad fades in below other content in sidebar
    // Subtract height of daily deals also b/c it's transformed up
    this.stickyTop = this.trigger.offset().top
  }

  /**
	 * Set the bottom trigger point for sticky ad to fade in/out
	 */
  setStickyBottom() {
    // Where should the sticky ad fade out?
    // 250 = Height of ad
    this.stickyBot = this.content.offset().top +
			this.content.outerHeight( true ) -
			this.$element.outerHeight( true )
  }

  /**
	 * Check the right positioning of the sticky ad on resize
	 */
  stickyResize() {
    this.setStickyRight()
    this.$element.css( { 'left': this.stickyRight } )
  }

  checkPosition() {
    var screenTop = $( window ).scrollTop() + this.adTop
    if ( this.stickyTop <= screenTop && this.stickyBot > screenTop && this.sidebarWidget.length === 0 ) {
      this.shouldStick = true
    } else if ( this.stickyTop > screenTop || this.stickyBot < screenTop ) {
      this.shouldStick = false
    }
  }

  /**
	 * Check the positioning of an ad and change position if necessary
	 */
  stickyScroll() {
    this.checkPosition()

    if ( this.shouldStick && !this.$element.hasClass( 'stick' ) ) {
      this.$element.addClass( 'stick' )
      this.$element.css( 'top', this.adTop )
      this.setStickyRight()
    } else if ( !this.shouldStick && this.$element.hasClass( 'stick' ) ) {
      this.$element.removeClass( 'stick' )
    }
  }
}
