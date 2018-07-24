import { Component } from '../classes/Component'

/**
 * Component for dealing with elements within the article body
 */
export class ArticleBody extends Component {
  /**
	 * Start the component
	 */
  start() {
    // elements
    this.videos = this.$element.find( this.options.videos )

    // inits
    this.wrapEmbeds()
  }

  /**
	 * Wrap embeds for intrinsic sizing
	 */
  wrapEmbeds() {
    this.videos.each( idx => {
      let el = this.videos.eq( idx )

      if ( !el.parents( this.options.wrappers ).length ) {
        el.wrap( '<div class="intrinsic-video"></div>' )
      }
    } )
  }
}
