import { Component } from '../classes/Component'
import 'slick-carousel'

/**
 * Component for initializing slideshow on featured media module
 */
export class MediaSlideshow extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Inits
    this.initMediaSlideshow()
  }

  /**
	 * Initialize slick on media feature
	 */
  initMediaSlideshow() {
    this.$element.find( '.media-articles' ).slick( {
      slidesToScroll: 1,
      dots: false,
      useTransform: true,
      nextArrow: this.$element.find( '.icon-arrow-right' ),
      prevArrow: this.$element.find( '.icon-arrow-left' ),
      responsive: [
        {
          breakpoint: 3000,
          settings: 'unslick'
        },
        {
          breakpoint: 1040,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    } )
  }
}
