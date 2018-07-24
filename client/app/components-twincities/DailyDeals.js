import { Component } from '../classes/Component'

/**
 * Component for Daily Deals pushdown functionality
 */
export class DailyDeals extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Flags
    this.isOpen = false

    // Elements
    this.dealsNav = $( this.options.dealsNav )
    this.close = this.$element.find( this.options.close )
    this.dealsEls = $( this.options.dealsPushEls )
      .add( this.element )
      .add( this.dealsNav )

    // Inits
    this.initDailyDeals()
  }

  /**
	 * Initialize event handler
	 */
  initDailyDeals() {
    this.dealsNav.click( e => {
      e.preventDefault()

      this.parentSite.callComponentMethod( 'pushnav', 'closePushNav' )
      this.dealsEls.toggleClass( 'daily-deals' )
    } )

    this.close.click( () => {
      this.closeDailyDeals()
    } )
  }

  /**
	 * Close the daily deals pushdown. Generally called by other components.
	 */
  closeDailyDeals() {
    this.dealsEls.removeClass( 'daily-deals' )
  }

  /**
	 * Open the daily deals pushdown. Generally called by other components.
	 */
  openDailyDeals() {
    this.dealsEls.addClass( 'daily-deals' )
  }
}
