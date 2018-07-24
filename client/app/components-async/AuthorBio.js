import { Component } from '../classes/Component'

/**
 * Component for showing/hiding full biography on an author page
 */
export class AuthorBio extends Component {
  /**
	 * Start the component (called when component is instantiated)
	 */
  start() {
    // Elements
    this.bios = this.$element.find( '.author-short-bio, .author-full-bio' )
    this.readMore = this.$element.find( '+ .read-full a' )

    // Inits
    this.initBioSwap()
  }

  /**
	 * Initialize the show/hide action when user clicks the "Read Full" button
	 */
  initBioSwap() {
    super.listener( this.readMore, 'click', () => {
      this.bios.toggle()
      this.readMore.text( () => {
        return this.readMore.text() == '+ Read Full Bio' ? '- Close Full Bio' : '+ Read Full Bio'
      } )
    } )
  }
}
