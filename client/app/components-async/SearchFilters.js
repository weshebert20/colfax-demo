import { Component } from '../classes/Component'

/**
 * Component for pull out search filters
 */
export class SearchFilters extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.filterExpand = $( this.options.filterExpand )
    this.filterEls = this.$element
      .add( this.filterExpand )
      .add( this.options.searchContent )
    this.allCats = $( this.options.allCats )
    this.hideable = $( this.options.hideableCats )

    // Inits
    this.initFilterExpand()
    this.checkStatus()
  }

  /**
	 * Initialize click handler for "refine" button
	 */
  initFilterExpand() {
    super.listener( this.filterExpand, 'click', ( e ) => {
      e.preventDefault()

      this.parentSite.callComponentMethod( 'pushnav', 'closePushNav' )
      this.filterEls.toggleClass( 'filter-open' )
    } )

    super.listener( this.allCats, 'click', ( e ) => {
      e.preventDefault()

      this.hideable.toggle()
      this.allCats.toggleClass( 'open' )
      this.allCats.find( '.text' ).text( ( idx, text ) => {
        if ( text === 'See All' ) {
          return 'See Fewer'
        }

        return 'See All'
      } )
    } )
  }

  /**
	 * If we're on mobile, close the filters by default
	 */
  checkStatus() {
    if ( this.checkBreakpoint( false, 'm' ) ) {
      this.filterEls.removeClass( 'filter-open' )
    }
  }

  /**
	 * Close filters. Generally called by another component
	 */
  closeFilters() {
    $( this.filterEls )
      .removeClass( 'filter-open' )
  }

  /**
	 * Open filters. Generally called by another component
	 */
  openFilters() {
    $( this.filterEls )
      .addClass( 'filter-open' )
  }
}
