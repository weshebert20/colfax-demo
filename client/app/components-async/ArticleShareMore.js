import { Component } from '../classes/Component'

/**
 * Component for expanding/collapsing highlights on a longform article
 */
export class ArticleShareMore extends Component {
  /**
	 * Start the component
	 */
  start() {
    // elements
    this.shareMore = this.$element.find( '.share-more' )
    this.shareHidden = this.$element.find( '.sharing-hidden' )

    // inits
    this.initShareMore()
  }

  /**
	 * Initialize hover functionality for hidden share buttons
	 */
  initShareMore() {
    this.shareMore
      .add( this.shareHidden )
      .hover( () => {
        this.shareHidden.toggle()
      } )
  }
}
