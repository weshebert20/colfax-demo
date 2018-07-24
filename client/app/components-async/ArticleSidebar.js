import { Component } from '../classes/Component'
import { Throttle } from '../components/Throttle'

/**
 * Component for moving sidebar elements into the article body on mobile
 */
export class ArticleSidebar extends Component {
  /**
	 * Start the component
	 */
  start() {
    // Elements
    this.article = $( this.options.article )
    this.articleHeader = this.article.find( this.options.header )
    this.related = this.article.find( this.options.related )
    this.popular = this.article.find( this.options.popular )
    this.footer = this.article.find( this.options.footer )
    this.body = $( this.options.body )
    this.text = $( this.options.text )
    this.paragraphs = $( this.text ).find( '> p' )
    this.upperad = $( this.options.upperad )
    this.lowerad = $( this.options.lowerad )
    this.firstInline = $( this.options.firstInline )
    this.stickyad = $( this.options.stickyad )
    this.trigger = $( this.options.trigger )
    this.sidebarContent = $( this.options.sidebarContent )

    if ( !this.sidebarContent.length ) {
      this.sidebarContent = this.$element
    }

    // Flags and Values
    this.shouldStick = false
    this.sidebarHeight = 0
    this.bodyHeight = 0 // height of article body + article header if it isn't full bleed
    this.fullHeight = 0 // same as this.bodyHeight but includes article footer also
    this.stickyTop = 0 // sticky ad start position
    this.stickyBot = 0 // sticky ad stop position
    this.stickyRight = 0 // sticky ad right position
    this.adTop = 0
    this.lowerAdtopValue = 0 // the css top value of the lower ad

    // Inits
    this.placeSidebarElements()
  }

  /**
	 * Place related posts, ads into specific locations in article body on mobile
	 */
  placeSidebarElements() {
    if ( this.checkBreakpoint( 'l', false ) ) {
      this.initValues()

      if ( ( this.bodyHeight - this.sidebarHeight ) > 600 ) { // 600 is max height of cube1 in sidebar
        this.initAdFloat()
        // checking against article body height b/c lower ad is absolute
        this.checkPopularDisplay( this.bodyHeight )
      } else {
        this.lowerad.addClass( 'static' )
        // checking against full height b/c lower ad is static
        this.checkPopularDisplay( this.fullHeight )
      }
    }

    if ( this.checkBreakpoint( false, 'm' ) ) {
      this.placeMobileAds()
    }

    this.triggerAdEvent()
  }

  /**
	 * Swap sticky and upper ads into the article content body on mobile
	 */
  placeMobileAds() {
    if ( this.paragraphs.length >= 3 ) {
      this.firstInline.insertAfter( this.paragraphs.eq( 2 ) )
    } else {
      this.firstInline.appendTo( this.body )
    }
  }

  /**
	 * Check if article is long enough to display the most popular module
	 * @param {num} comparison - value to compare sidebar height against
	 */
  checkPopularDisplay( comparison ) {
    if ( this.popular.length ) {
      if ( comparison < this.sidebarHeight ) {
        this.popular.hide()
      }
    }
  }

  /**
	 * Move lower ad to bottom of article if lowerAdtopValue is a positve number
	 */
  placeLowerAd() {
    this.lowerAdtopValue = this.footer.offset().top - this.$element.offset().top - this.sidebarContent.outerHeight() + this.lowerad.outerHeight()

    // lowerAdtopValue must be a positive number otherwise it will cause elements to overlap
    if ( this.lowerad.length && this.lowerAdtopValue > 0 ) {
      this.lowerad.addClass( 'bottom' )
      this.lowerad.css(
        'top', this.lowerAdtopValue
      )
    }
  }

  /**
	 * Initialize debouncer for watching ad positioning
	 */
  initAdFloat() {
    this.scrollThrottle = new Throttle( this.stickyScroll, this, 'scroll', $( window ) )
    this.resizeThrottle = new Throttle( this.stickyResize, this, 'resize', $( window ) )
    this.stickyThrottle = new Throttle( this.stickyHelper, this, 'scroll', $( window ), 2000 )
  }

  /**
	 * Helper for re-calculating sticky ad and lower ad positioning
	 */
  stickyHelper() {
    this.initValues()
    this.checkPosition()
    this.placeLowerAd()
  }

  /**
	 * Create values necessary for calculating positions
	 */
  initValues() {
    // Ad top position, used when sticky ad is sticking
    this.adTop = $( 'body' ).is( '.admin-bar' ) ? 82 : 50

    // Sidebar height, used to place sticky ad before stick
    this.sidebarHeight = this.sidebarContent.height()

    if ( !this.shouldStick ) {
      this.sidebarHeight -= this.stickyad.outerHeight( true )
    }

    if ( this.lowerad.length && this.lowerad.is( ':visible' ) ) {
      this.sidebarHeight -= this.lowerad.outerHeight( true )
    }

    this.setBodyHeight()
    this.setStickyRight()
    this.setStickyTop()
    this.setStickyBottom()
  }

  /**
	 * Set height of article body
	 */
  setBodyHeight() {
    this.bodyHeight = this.body.outerHeight( true )

    if ( !this.articleHeader.hasClass( 'full' ) ) {
      this.bodyHeight += this.articleHeader.outerHeight( true )
    }

    this.fullHeight = this.bodyHeight + this.footer.outerHeight( true )
  }

  /**
	 * Caclulate right value
	 */
  setStickyRight() {
    // Value necessary to align sticky ad with article sidebar elements
    this.stickyRight = this.$element.offset().left +
			Math.ceil( ( this.$element.outerWidth() - 300 ) / 2 )
  }

  /**
	 * Calculate top value and trigger point
	 */
  setStickyTop() {
    if ( this.trigger.length && this.trigger.offset() ) {
      this.stickyTop = this.trigger.offset().top
    }
  }

  /**
	 * Set the bottom trigger point for sticky ad to fade in/out
	 */
  setStickyBottom() {
    // Where should the sticky ad fade out?
    // 250 = Height of ad
    this.stickyBot = this.footer.offset().top - this.stickyad.outerHeight( true )
  }

  /**
	 * Check the right positioning of the sticky ad on resize
	 */
  stickyResize() {
    this.setStickyRight()
    this.stickyad.css( { 'left': this.stickyRight } )
  }

  checkPosition() {
    var screenTop = $( window ).scrollTop() + this.adTop

    if ( this.stickyTop <= screenTop && this.stickyBot > screenTop ) {
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

    if ( this.shouldStick && !this.stickyad.hasClass( 'stick' ) ) {
      this.stickyad.addClass( 'stick' )
      this.stickyad.css( 'top', this.adTop )
      this.stickyResize()
      this.stickyHelper()
    } else if ( !this.shouldStick && this.stickyad.hasClass( 'stick' ) ) {
      this.stickyad.removeClass( 'stick' )
      this.stickyHelper()
    }
  }
}
