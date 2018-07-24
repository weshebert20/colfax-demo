// Available to all components
import { Breakpoints } from '../components/Breakpoints'

/**
 * Internal, extendable class for instatianting components.
 * Each compoment should contain functionality for a single DOM element or selector.
 */
export class Component {
  /**
	 * Create a component
	 * @param {object} element - A JS node object containing the component element
	 * @param {object} options - Additional options (usually selectors, but can be any value)
	 * @param {object} parentSite - The current site object
	 * @param {string} name - Name of the component
	 * @param {integer} id - ID or index of the component
	 */
  constructor( element, options, parentSite, name, id ) {
    this.element = element
    this.$element = $( element )
    this.options = options
    this.started = false
    this.parentSite = parentSite
    this.name = name
    this.id = id

    // Classes for Everyone!
    this.breakpoints = new Breakpoints()
    // Use .bind to allow use of this method in any component
    this.checkBreakpoint = this.breakpoints.checkBreakpoint.bind( this.breakpoints )

    // Listeners
    this.listenerEls = []
    this.eventNamespace = '.' + name

    // Reference to other components
    this.componentInstances = this.parentSite.componentInstances
  }

  /**
	 * Destroy the component, removing the element from the dom and all attached event handlers
	 */
  destroy() {
    var eventNamespace = this.eventNamespace

    // remove instance element from DOM
    this.element.parentNode.removeChild( this.element )

    // remove all listeners
    if ( this.listenerEls.length ) {
      this.listenerEls.forEach( ( el ) => {
        $( el ).off( eventNamespace )
      } )
    }
  }

  /**
	 * Add an event handler via jQuery
	 * @param {object} el - DOM node or jquery object
	 * @param {string} type - Event type
	 * @param {function} callback - Handler callback to execute when event is triggered
	 * @param {string} filter - Filter elements to which handler is applied
	 * @param {object} params - Parameters to pass to callback
	 */
  listener( el, type, callback, filter, params ) {
    this.listenerEls.push( el )
    $( el ).on( type + this.eventNamespace, filter, params, callback )
  }

  /**
	 * Get the top offset of an element relative to a specific DOM node.
	 * This is useful if you are scrolling on an element other than <body>
	 * @param {object} el - DOM node
	 * @param {object} context - ID of element relative to which you want the offset
	 */
  getOffsetTop( el, context ) {
    var offset = 0

    if ( el !== null && context !== el.getAttribute( 'id' ) ) {
      offset = el.offsetTop
      offset += this.getOffsetTop( el.offsetParent, context )
    }

    return offset
  }

  /**
	 * Start the component
	 */
  start() {
    this.started = true
  }

  /**
	 * Check to see if async (non-critical) CSS has loaded. Should be used in conjunction with `dfm:cssloaded` event.
	 */
  checkAsyncCSS() {
    let asyncCSS = $( `[href*="${this.parentSite.siteName}.css"]` )
    return asyncCSS.length
  }

  /**
	 * Force Safari to redraw it's goddamn DOM
	 */
  forceRedraw( el ) {
    el.style.display = 'none'
    el.offsetHeight
    el.style.display = ''
  }

  /**
	 * Trigger event for CMS theme to hook into and ensure ads render properly
	 */
  triggerAdEvent() {
    $( document ).trigger( 'dfm:adLoaded' )
  }
}
