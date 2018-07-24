import { Component } from '../classes/Component'
import 'slick-carousel'

/**
 * Call Slick on the author events list
 */
export class AuthorEvents extends Component {
  /**
	 * Start the component (called when component is instantiated)
	 */
  start() {
    // Inits
    this.initEventsSlideshow()
  }

  /**
	 * Initialize Slick with reponsive options for events slideshow
	 */
  initEventsSlideshow() {
    this.$element.find( '.event-list' ).slick( {
      dots: true,
      useTransform: true,
      slidesToScroll: 1,
      nextArrow: this.$element.find( '.icon-arrow-right' ),
      prevArrow: this.$element.find( '.icon-arrow-left' ),
      responsive: [
        {
          breakpoint: 1920,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 1040,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    } )
  }
}
