/**
 * Network Component for creating breakpoint-specific code blocks using matchMedia
 */
export class Breakpoints {
  /**
	 * Start component (called when Network starts)
	 */
  constructor() {
    this.breakpoints = {
      xl: '80em',
      l: '65em',
      m: '50em',
      s: '40em',
      xs: '20em'
    }
    this.started = true

    this.initOrientationChange()
  }

  /**
	 * Check if a breakpoint is active
	 * @param {string} from - Key for minimum width value (pass false for no min width)
	 * @param {string} to - Key for maximum width value (pass false for no max width)
	 * @param {function} context - Breakpoints object, for context
	 */
  checkBreakpoint( from, to ) {
    var fromString = null,
      toString = null,
      mediaString = null

    if ( typeof this.breakpoints !== 'undefined' ) {
      if ( from && this.breakpoints[from] ) {
        fromString = '(min-width: ' + this.breakpoints[from] + ')'
        mediaString = fromString
      }

      if ( to && this.breakpoints[to] ) {
        toString = '(max-width: ' + this.breakpoints[to] + ')'

        if ( fromString ) {
          mediaString += ' and ' + toString
        } else {
          mediaString = toString
        }
      }

      if ( mediaString ) {
        return window.matchMedia( mediaString ).matches
      }
    }

    return false
  }

  /**
	 * Fire an orientation change event with the current window width as data
	 */
  initOrientationChange() {
    window.addEventListener( 'orientationchange', () => {
      $( window ).trigger( 'orientationChange', $( window ).width() )
    }, false )
  }
}
