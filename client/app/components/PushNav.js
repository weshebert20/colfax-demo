import { Component } from '../classes/Component'
const Hammer = require( 'hammer' )

/**
 * Component for sitewide push navigation on tablet/mobile
 */
export class PushNav extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.navTrigger = $( this.options.navTrigger )
    this.containerEls = $( this.options.containerEls )
    this.submenu = this.$element.find( this.options.submenu )
    this.swipeEls = this.$element
    this.swipe = null
    this.docSwipe = null

    // Values
    this.submenuOpenClass = 'submenu-open'
    // Note: if pushnav position is changed, hamburger icon
    // position should be styled accordingly on applicable site
    this.menuPosition = this.options.menuPosition || 'left'
    this.pushClass = 'push-from-' + this.menuPosition

    // Inits
    this.initPushNav()
    this.initNavSwipe()
    this.initNavExpand()
  }

  /**
	 * Add click handler for submenus
	 */
  initNavExpand() {
    this.submenu.each( ( idx ) => {
      this.submenu
        .eq( idx )
        .on( 'click', ( e ) => {
          e.preventDefault()
          let menu = $( e.currentTarget ).parent()

          if ( !menu.hasClass( this.submenuOpenClass ) ) {
            this.closeSubmenus()
            this.openSubmenu( menu )
          } else {
            this.closeSubmenu( menu )
          }
        } )
    } )
  }

  /**
	 * Add click handler for hamburger icon
	 */
  initPushNav() {
    super.listener( this.navTrigger, 'click', ( e ) => {
      e.preventDefault()
      this.togglePushNav()
    } )

    this.$element.addClass( 'pushnav-' + this.menuPosition )
  }

  /**
	 * Allow user to swipe the nav menu to close it
	 */
  initNavSwipe() {
    if ( this.checkBreakpoint( false, 'm' ) ) {
      this.swipe = new Hammer( this.element )
      this.swipe.on( `swipe${this.menuPosition}`, this.closePushNav.bind( this ) )
    }
  }

  /**
	 * Close all submenus
	 */
  closeSubmenus() {
    this.submenu
      .parent()
      .removeClass( this.submenuOpenClass )
      .css( 'height', '' )
  }

  /**
	 * Close a single submenu
	 *
	 * @param {object} menu - jQuery object representing the submenu
	 */
  closeSubmenu( menu ) {
    menu.removeClass( this.submenuOpenClass )
      .css( 'height', '' )
  }

  /**
	 * Open a single submenu
	 *
	 * @param {object} menu - jQuery object representing the submenu
	 */
  openSubmenu( menu ) {
    menu.addClass( this.submenuOpenClass )
      .css(
        'height',
        menu.find( 'a' ).outerHeight() +
				menu.find( 'ul' ).outerHeight()
      )
  }

  /**
	 * Close the push nav. Generally called by other components
	 */
  closePushNav() {
    this.$element
      .add( this.containerEls )
      .removeClass( this.pushClass )

    this.docSwipe = new Hammer( document.getElementById( 'content' ) )
    this.docSwipe.on( `swipe${this.menuPosition}`, this.closePushNav.bind( this ) )
    this.docSwipe.destroy()
  }

  /**
	 * Open the push nav. Generally called by other components
	 */
  openPushNav() {
    this.$element
      .add( this.containerEls )
      .addClass( this.pushClass )

    this.parentSite.callComponentMethod( 'dailydeals', 'closeDailyDeals' )
    this.parentSite.callComponentMethod( 'searchfilters', 'closeFilters' )
    this.parentSite.callComponentMethod( 'slidesearch', 'closeSlideNav' )

    this.docSwipe = new Hammer( document.getElementById( 'content' ) )
    this.docSwipe.on( `swipe${this.menuPosition}`, this.closePushNav.bind( this ) )
  }

  togglePushNav() {
    if ( this.$element.hasClass( this.pushClass ) ) {
      this.closePushNav()
    } else {
      this.openPushNav()
    }
  }
}
