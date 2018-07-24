import { Component } from '../classes/Component'
import { Throttle } from '../components/Throttle'
import 'headroom'

/**
 * Component for instantiating Headroom for sticky header
 */
export class Header extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.isArticle = $( this.options.articlePage ).length
    this.placeholder = $( this.options.placeholder )
    this.scroller = $( this.options.scroller )
    this.dropdowns = this.$element.find( this.options.dropdowns )
    this.offset = this.options.offset // I know, this isn't actually a selector
    this.undertoneThrottle = new Throttle( this.hideUndertone, this, 'scroll', $( window ), 500 )

    // Flags
    this.prevScroll = 0
    this.currScroll = 0
    this.submenuOpenClass = 'submenu-open'

    // Inits (only init outside styleguide)
    if ( !document.body.classList.contains( 'prototype-styleguide' ) ) {
      this.initHeadroom()
    }
    this.initDropdowns()
  }

  /**
	 * Initialize Headroom
	 */
  initHeadroom() {
    /* globals Headroom */
    this.headroom = new Headroom( this.element, {
      offset: this.offset,
      onNotTop: () => {
        // ensure proper scoping
        this.showPlaceholder.apply( this )
        this.parentSite.callComponentMethod.apply( this, [ 'slidesearch', 'closeSlideNav' ] )
      },
      onTop: () => {
        // ensure proper scoping
        this.hidePlaceholder.apply( this )
        this.showUndertone.apply( this )
      }
    } )

    // Inits
    this.headroom.init()
  }

  /**
	 * Add handler for dropdown menus
	 */
  initDropdowns() {
    this.dropdowns.on( 'click', ( e ) => {
      e.preventDefault()
      let menu = $( e.currentTarget ).parent()

      if ( !menu.hasClass( this.submenuOpenClass ) ) {
        this.closeAllSubnavs()
        this.openSubnav( menu )
      } else {
        this.closeSubnav( menu )
      }
    } )
  }

  /**
	 * Hide the header placeholder when user scrolls back to top of screen
	 */
  hidePlaceholder() {
    this.placeholder.hide()

    $( '#page' )
      .addClass( 'hide-header-transition' )

    window.setTimeout( () => {
      $( '#page' ).removeClass( 'hide-header-transition' )
    }, 1000 )
  }

  /**
	 * Show placeholder to prevent page from jumping when sticky header kicks in
	 */
  showPlaceholder() {
    this.placeholder.show()
  }

  /**
	 * Close all subnavigation dropdowns
	 */
  closeAllSubnavs() {
    this.dropdowns
      .parent()
      .removeClass( this.submenuOpenClass )
  }

  /**
	 * Close a single subnav
	 */
  closeSubnav( menu ) {
    menu.removeClass( this.submenuOpenClass )
  }

  /**
	 * Open a single subnav
	 */
  openSubnav( menu ) {
    const submenu = menu.find( '> ul' )
    const items = submenu.find( '> li' )
    let singleItemHeight = 0
    let itemHeight = items.length // Start with a pixel per item, for safety

    menu.addClass( this.submenuOpenClass )
    singleItemHeight = items.eq( 0 ).height()

    // Add height of each item to total height
    items.each( ( idx, item ) => {
      itemHeight += $( item ).outerHeight()
    } )

    // If there are more that 5 items, assume we're displaying in two columns
    if ( items.length > 5 ) {
      if ( items.length % 2 === 0 ) {
        itemHeight = Math.ceil( itemHeight / 2 )
      } else {
        itemHeight = Math.ceil( ( itemHeight / 2 ) + ( singleItemHeight / 2 ) )
      }
      // 5 or less items, display in a single column
    } else {
      menu.addClass( 'has-few-items' )
    }

    submenu.height( itemHeight )
  }

  /**
	 * Hide the Undertone ad
	 */
  hideUndertone() {
    if ( !this.$element.hasClass( 'headroom--top' ) ) {
      $( '.ut_container' ).css( {
        'position': 'absolute',
        'opacity': 0,
        'top': '-500px'
      } )
    }
  }

  /**
	 * Show the Undertone ad
	 */
  showUndertone() {
    $( '.ut_container' ).css( {
      'position': 'relative',
      'opacity': 1,
      'top': 0
    } )
  }
}
