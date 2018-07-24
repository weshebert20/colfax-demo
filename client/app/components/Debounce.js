/**
 * Network component for handling debouncing of events
 */
export class Debounce {
  /**
	 * Contstructor
	 * @param {function} callback - function to debounce
	 * @param {object} context - context with which debounce function should be applied
	 * @param {debounceEvent} - event to debounce. This will usually be 'scroll' or 'resize'
	 * @param {debounceEl} - DOM node on which to attach debounceEvent
	 * @param {duration} - duration after which to call this.update() once debounceEvent handler has stopped firing
	 * @param {maximum} - maximum number of times to call update(), after which this debouncer will deactivate
	 */
  constructor( callback, context, debounceEvent, debounceEl, duration, maximum ) {
    this.callback = callback
    this.context = context
    this.debounceEvent = debounceEvent
    this.debounceEl = debounceEl
    this.duration = duration
    this.timer = null
    this.maximum = maximum || -1

    this.count = 0

    this.initEvent()
  }

  initEvent() {
    this.debounceEl.on( this.debounceEvent, () => {
      this.requestTick()
    } )
  }

  /**
	 * Dispatches the event to the supplied callback
	 * @private
	 */
  update() {
    this.timer = null
    if ( this.callback && this.count !== this.maximum ) {
      this.callback.apply( this.context )
      if ( this.maximum > 0 ) {
        this.count += 1
      }
    }
  }

  /**
	 * Ensures events don't get stacked
	 * @private
	 */
  requestTick() {
    if ( !this.timer ) {
      this.update.apply( this )
    }
    clearTimeout( this.timer )
    this.timer = setTimeout( this.update.bind( this ), this.duration, this )
  }

  /**
	 * Remove the debounce event handler
	 * @public
	 */
  destroy() {
    this.debounceEl.off( this.debounceEvent )
  }
}
