import { Component } from '../classes/Component'
import 'slick-carousel'

/**
 * Component for editors picks flyout in main site nav
 */
export class EditorsPicks extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.editorsNav = $( this.options.editorsNav )

    // Functions and Classes
    this.slick = false

    // Inits
    this.initEditorsPicks()
    this.initEditorsPicksSlideshow()
  }

  /**
	 * Init hover for desktop, click for mobile
	 */
  initEditorsPicks() {
    if ( this.checkBreakpoint( 'l', false ) ) {
      super.listener( '.editors-picks', 'mouseenter', () => {
        this.$element.show()
        this.editorsNav.addClass( 'active' )

        this.updateSlideSize()
      } )

      super.listener( '.editors-picks', 'mouseleave', () => {
        this.$element.hide()
        this.editorsNav.removeClass( 'active' )
      } )
    }

    if ( this.checkBreakpoint( false, 'l' ) ) {
      super.listener( this.editorsNav, 'click', () => {
        this.$element.toggle()
        this.parentSite.callComponentMethod( 'trending', 'close' )
        this.editorsNav.toggleClass( 'active' )

        this.updateSlideSize()
      } )
    }
  }

  /**
	 * Ensure slides are of correct size and position
	 */
  updateSlideSize() {
    if ( this.slick ) {
      this.slick.setDimensions()
      this.slick.slickGoTo( 0, true )
    }
  }

  /**
	 * Init slick instance, set internal slick variable
	 */
  initEditorsPicksSlideshow() {
    this.slick = this.$element.find( '.articles' ).slick( {
      dots: true,
      useTransform: true,
      slidesToScroll: 1,
      sliesToShow: 3,
      nextArrow: this.$element.find( '.icon-arrow-right' ),
      prevArrow: this.$element.find( '.icon-arrow-left' ),
      responsive: [
        {
          breakpoint: 3000,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    } ).slick( 'getSlick' )
  }

  /**
	 * Close editors picks
	 */
  close() {
    this.$element.hide()
    this.editorsNav.removeClass( 'active' )
  }
}
