/**
 * Internal class for instantiating a Site
 */
export class Site {
  /**
	 * Create a site
	 *
	 * @param {string} siteName - Name of the site
	 * @param {object} components - Configuration object for site components
	 */
  constructor( config, siteAsyncFunc ) {
    this.siteName = config.siteName
    this.components = config.components
    this.componentInstances = {}

    // Site specific async components and function for requiring them
    this.siteSpecific = config.siteSpecific || {}
    this.siteAsync = siteAsyncFunc || null
  }

  /**
	 * Loop through config and instantiate classes for each site component.
	 */
  init() {
    this.initComponents()
    this.initSiteComponents()
  }

  /**
	 * Initialize common components with site configuration
	 */
  initComponents() {
    let component
    let addlSelectors = {}
    let componentEls

    // Iterate through components and initialize them.
    // Throw error if there are no components registered.
    if ( Object.keys( this.components ).length ) {
      Object.keys( this.components ).forEach( key => {
        component = this.components[key]

        // Find all instances of current component,
        // using selector provided by site instantiation
        componentEls = document.querySelectorAll( component.selector )

        if ( component.hasOwnProperty( 'options' ) &&
					typeof component.options === 'object' ) {
          addlSelectors = component.options
        }

        // Initialize an array for each component
        this.componentInstances[key] = []

        // Is the component Class a function? Syncronously instantiate it.
        // Is the component Class a string? Async require it, then instantiate it when it loads.
        if ( typeof component.componentClass === 'function' ) {
          this.loopInstances( component.componentClass, componentEls, addlSelectors, key )
        } else if ( typeof component.componentClass === 'string' ) {
          this.loadAsync(
            // Bind all args to the callback so we don't have to pass them into
            // this.loadAsync function as well
            this.asyncCallback.bind(
              this, // Reference to Site class
              component.componentClass, // The current component
              componentEls, // Component elements in the DOM
              addlSelectors, // Additional selectors
              key, // ID
              false // Site specific?
            )
          )
        }
      } )
    } else {
      throw this.throwException(
        'site ${this.siteName} does not have any registered components',
        this.siteName
      )
    }
  }

  /**
	 * Initialize site-specific components, if they exist
	 */
  initSiteComponents() {
    let component
    let addlSelectors = {}
    let componentEls

    if ( typeof Object.keys( this.siteSpecific ).length !== 'undefined' &&
			this.siteAsync !== null ) {
      Object.keys( this.siteSpecific ).forEach( key => {
        component = this.siteSpecific[key]
        componentEls = document.querySelectorAll( component.selector )

        if ( component.hasOwnProperty( 'options' ) &&
					typeof component.options === 'object' ) {
          addlSelectors = component.options
        }

        this.componentInstances[key] = []

        this.siteAsync(
          this.asyncCallback.bind(
            this, // Reference to Site class
            component.componentClass, // The current component
            componentEls, // Component elements in the DOM
            addlSelectors, // Additional selectors
            key, // ID
            true // Site specific?
          )
        )
      } )
    }
  }

  /**
	 * Callback for require.ensure
	 *
	 * @param {function} className - Class declaration for component
	 * @param {object} elements - Node list of elements for which
	 *  this component should be instantiated
	 * @param {object} selectors - additional selectors associated with component
	 * @param {number} id - index of component in this.components
	 * @param {function} req - require.context reference to components directory
	 * @param {object} site - internal reference to site instance
	 */
  asyncCallback( className, elements, selectors, id, siteSpecific ) {
    // Determine if class should be required from common async or site-specific async
    let asyncReq = siteSpecific ? this.asyncReqSite : this.asyncReq
    let componentClass = asyncReq( './' + className )[className] // eslint-disable-line prefer-template

    this.loopInstances( componentClass, elements, selectors, id )
  }

  /**
	 * Require all components in a single async chunk
	 *
	 * @param {function} callback - Callback for when the component is loaded
	 */
  loadAsync( callback ) {
    require.ensure( [], require => {
      this.asyncReq = require.context( '../components-async' )
      // All args bound already
      callback()
    }, 'common-async' )
  }

  /**
	 * Loop through each DOM element with a particular component
	 *
	 *  selector and create a new instance of the component for each.
	 * @param {object} componentEls - Node list of elements
	 *  for which this component should be instantiated
	 * @param {object} addlSelectors - Additional selectors relevant to the component
	 * @param {function} componentClass - Class declaration for component
	 * @param {string} name - Component name
	 */
  loopInstances( componentClass, componentEls, addlSelectors, name ) {
    // Push a new instance of the component class for each component
    // element into the componentInstances object. Start each instance.
    if ( componentEls.length ) {
      for ( let i = 0; i < componentEls.length; i++ ) {
        // Did we feed in an already imported class? then start it.
        if ( typeof componentClass === 'function' ) {
          this.instanceComponent(
            componentClass,
            componentEls.item( i ),
            addlSelectors,
            name,
            i
          )
        }
      }
    }
  }

  /**
	 * Instantiate a component class
	 *
	 * @param {function} ComponentClass - Class declaration for component
	 * @param {object} element - Node object for element
	 * @param {object} addlSelectors - Additional selectors relevant to the component
	 * @param {string} name - Component name
	 * @param {integer} id - ID or index of component in componentInstances object
	 */
  instanceComponent( ComponentClass, element, addlSelectors, name, id ) {
    let instance

    // Start instance or, if instance doens't exist, throw error
    if ( typeof ComponentClass === 'function' ) {
      // Instantiate component
      instance = new ComponentClass(
        element, addlSelectors, this, name, id
      )

      // Add instance
      instance.start()
      this.componentInstances[name].push( instance )
    } else {
      this.throwException(
        'component ${name} could not be found',
        name
      )
    }
  }

  /**
	 * Call a method of a component from a different component
	 *
	 * @param {string} componentName - Name of component that has target function
	 * @param {function} method - Component method you want to call
	 * @param {array} args - Array of arguments to pass to component method
	 */
  callComponentMethod( componentName, method, args = [] ) {
    // Does the component exist?
    if ( typeof this.componentInstances[componentName] !== 'undefined' ) {
      this.componentInstances[componentName].forEach( componentInstance => {
        // Use JS .apply to call the component method with proper context
        if ( typeof componentInstance[method] === 'function' ) {
          componentInstance[method].apply( componentInstance, args )
        }
      } )
    }
  }

  // @TODO: add proper error handler
  throwException( message, debug ) {
    throw new Error( { message, debug } )
  }
}
