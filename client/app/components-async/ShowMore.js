import { Component } from '../classes/Component'

/**
 * Component for showing hidden content on button click
 */
export class ShowMore extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.moreContent = this.$element.siblings( this.options.moreContent )

    // Inits
    this.initShowMore()
  }

  initShowMore() {
    this.$element.on( 'click', () => {
      this.moreContent.show()
      this.$element.hide()
    } )
  }
}
