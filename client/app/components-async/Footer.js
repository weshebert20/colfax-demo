import { Component } from '../classes/Component'
import { Debounce } from '../components/Debounce'

/**
 * Expand/collapse functionality for footer menus
 */
export class Footer extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.footerSubmenuItems = this.$element
      .find( this.options.submenus )

    // Inits
    if ( this.checkBreakpoint( false, 's' ) ) {
      this.setStyles()
      this.initMenus()

      this.scrollDebounce = new Debounce( this.setStyles, this, 'scroll', $( window ), 1000, 3 )
    }
  }

  /**
	 * Initialize click handler for footer menus on mobile
	 */
  initMenus() {
    super.listener( this.footerSubmenuItems, 'click', ( e ) => {
      var toggle = $( e.currentTarget ),
        target = $( e.target )

      if ( !target.is( '.footer-menu' ) && !target.parents( '.footer-menu' ).length ) {
        e.preventDefault()

        toggle.toggleClass( 'open' )
          .find( this.options.expander + ' a' )
          .toggleClass( this.options.toggle )

        this.setStyles()
      }
    } )
  }

  /**
	 * Reposition menus on open/close
	 */
  setStyles() {
    this.positionMenus()
    this.setHeight()
  }

  /**
	 * Set footer height
	 */
  setHeight() {
    var footerHeightVal = 0

    this.footerSubmenuItems.each( ( key ) => {
      var currentMenuItem = this.footerSubmenuItems.eq( key )

      if ( !currentMenuItem.hasClass( 'open' ) ) {
        footerHeightVal += currentMenuItem.find( '> a' ).outerHeight()
      } else {
        footerHeightVal += currentMenuItem.height()
      }
    } )

    this.$element.find( '.footer-menus' ).height( footerHeightVal )
  }

  /**
	 * Set menu positioning based on opened/closed menu dimensions preceeding it
	 */
  positionMenus() {
    this.footerSubmenuItems.each( ( key ) => {
      var currentMenuItem = this.footerSubmenuItems.eq( key ),
        heightVal = 0,
        elArray

      if ( key ) {
        elArray = this.footerSubmenuItems.slice( 0, key )

        elArray.each( ( subkey ) => {
          var testMenu = this.footerSubmenuItems.eq( subkey )

          if ( !testMenu.hasClass( 'open' ) ) {
            heightVal += testMenu.find( '.footer-menu' ).height()
          }
        } )

        heightVal *= -1

        currentMenuItem.css( 'transform', `translate(0, ${heightVal}px)` )
      }
    } )
  }
}
