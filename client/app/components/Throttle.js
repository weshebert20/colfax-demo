window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame

/**
 * Network component for handling throttling of events via requestAnimationFrame (from http://wicky.nillia.ms/headroom.js/)
 * @see http://www.html5rocks.com/en/tutorials/speed/animations/
 * @param {Function} callback The callback to handle whichever event
 */
export class Throttle {
  /**
	 * Contstructor
	 * @param {function} callback - function to throttle
	 * @param {object} context - context with which throttle function should be applied
	 * @param {throttleEvent} - event to throttle. This will usually be 'scroll' or 'resize'
	 * @param {throttleEl} - DOM node on which to attach throttleEvent
	 * @param {schedule} - limit the frequency at which this.update() is called
	 */
  constructor( callback, context, throttleEvent, throttleEl, schedule = 0 ) {
    this.callback = callback
    this.ticking = false
    this.context = context
    this.throttleEvent = throttleEvent
    this.throttleEl = throttleEl
    this.timer = null
    this.schedule = schedule

    this.initEvent()
  }

  initEvent() {
    this.throttleEl.on( this.throttleEvent, () => {
      this.requestTick()
    } )
  }

  /**
	 * Dispatches the event to the supplied callback
	 * @private
	 */
  update() {
    if ( this.callback ) {
      this.callback.apply( this.context )
    }
    if ( this.timer !== null ) {
      clearTimeout( this.timer )
      this.timer = null
    }
    this.ticking = false
  }

  /**
	 * Ensures events don't get stacked
	 * @private
	 */
  requestTick() {
    if ( !this.ticking ) {
      if ( this.schedule > 0 ) {
        if ( this.timer === null ) {
          this.timer = setTimeout( this.update.bind( this ), this.schedule )
        }
      } else {
        requestAnimationFrame( () => {
          this.update()
        } )
      }
      this.ticking = true
    }
  }

  /**
	 * Remove the throttle event handler
	 * @public
	 */
  destroy() {
    this.throttleEl.off( this.throttleEvent )
  }
}
