import { Component } from '../classes/Component'
import 'slick-carousel'

/**
 * Component for starting author tweets carousel
 */
export class AuthorTweetSlideshow extends Component {
  /**
	 * Start the component (called when component is instantiated)
	 */
  start() {
    // Inits
    this.initAuthorTweetSlideshow()
    this.initOrientationCheck()
  }

  /**
	 * Initialize slick and responsive options
	 */
  initAuthorTweetSlideshow() {
    this.$element.find( '.feed-content' ).slick( {
      slidesToScroll: 1,
      dots: false,
      useTransform: true,
      nextArrow: this.$element.find( '.icon-arrow-right' ),
      prevArrow: this.$element.find( '.icon-arrow-left' ),
      responsive: [
        {
          breakpoint: 1920,
          settings: 'unslick'
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    } )
  }

  /**
	 * Re init Slick on orientation change
	 */
  initOrientationCheck() {
    $( window ).on( 'orientationchange', () => {
      this.initAuthorTweetSlideshow()
    } )
  }
}
