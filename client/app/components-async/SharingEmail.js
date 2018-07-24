import { Component } from '../classes/Component'

/**
 * Adjustments to the built-in Jetpack share-post-by-email form
 */
export class SharingEmail extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.fromWrapper = this.$element.find( 'form' )
    this.emailTextarea = this.$element.find( '#jetpack-source_f_name' )

    // Inits
    this.alterSharingEmail()
  }

  /**
	 * Alter the Sharing Email Markup
	 */
  alterSharingEmail() {
    $( this.fromWrapper )
      .prepend( '<h3>Email This Article</h3>' )
    $( this.emailTextarea )
      .hide()
  }
}
