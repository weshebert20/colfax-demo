import { Component } from '../classes/Component'
import 'slick-carousel'

/**
 * Component for instantiating slick, updating slide count and caption on article slideshows
 */
export class ArticleSlideshow extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    // Elements
    this.slideshowEl = this.$element.find( 'ul' )
    this.slideshowExpand = this.$element.find( this.options.slideshowExpand )
    this.slideshowImages = this.slideshowEl.find( 'img' )
    this.mobileCaption = this.$element.find( this.options.mobileCaption )
    this.currentCount = this.$element.find( '.current' )
    this.currentCaption = this.$element.find( '.slideshow-caption' )
    this.currentCredit = this.$element.find( '.slideshow-credit' )
    this.slideIndexDisplay = this.$element.find( '.slide-count' )
    this.slideshowAd = this.$element.find( '.slideshow-ad' )

    // Determinate if user can run ads
    this.dfmCanRunAds = ( typeof dfmCanRunAds !== 'undefined' ) ? dfmCanRunAds : false

    // Remove slide ads if user can't see them
    if ( !this.dfmCanRunAds ) {
      $( '.slideshow-ad-slide' ).remove()
      $( '.slideshow-ad-video' ).remove()
    }

    // Flags and vars
    this.isFullscreen = false
    this.imageCache = {}
    this.slideCount = this.$element.find( 'li' ).length
    this.slotNum = 1

    // Function for touchmove event
    this.preventDefaults = ( e ) => {
      e.preventDefault()
      e.stopPropagation()
    }

    // Inits
    this.initSlideCount()
    this.initArticleSlideshow()
    this.initFullscreen()
    this.initMobileCaption()
    this.updateSlideData( 0 )

    // store Ad Layers API object
    this.dfpAPI = ( typeof AdLayersAPI === 'function' ) ? new AdLayersAPI() : false

    this.vastTag = ( typeof vastTag !== 'undefined' ) ? vastTag : false
    this.videoArrowsDelay = ( typeof videoArrowsDelay !== 'undefined' ) ? videoArrowsDelay : 15
  }

  /**
	 * Initialize slick and 'beforeChange' event handler
	 */
  initArticleSlideshow() {
    this.slideshowEl.on( 'beforeChange',
      ( event, slick, currentSlide, nextSlide ) => {
        // store direction of slideshow motion, and next slide element
        const direction = ( ( currentSlide < nextSlide && this.slideCount !== nextSlide ) || ( currentSlide > nextSlide && nextSlide === 0 ) ) ? 'right' : 'left'
        const $nextSlideEl = direction === 'right' ? this.getSlideEl( nextSlide ) : this.getSlideEl( currentSlide - 1 )
        const $slideAfterNext = direction === 'right' ? this.getSlideEl( nextSlide + 1 ) : this.getSlideEl( currentSlide - 2 )

        // run slideshow-ad-video
        if ( this.dfmCanRunAds && $nextSlideEl.hasClass( 'slideshow-ad-video' ) && undefined !== this.vastTag ) {
          this.fillSlideElementWithVideoAd( document.getElementById( 'adContainer' ), direction, this.vastTag, document.getElementById( 'ad-video-element' ) )
        }

        // Reset the .gallery ad class from arrows
        $( '.slick-arrow' ).removeClass( 'gallery-ad' )

        // If the next slide has an ad, add a class to the arrow button
        // so BI can ignore this page view event
        if ( $slideAfterNext.hasClass( 'slideshow-ad-slide' ) || $slideAfterNext.hasClass( 'slideshow-ad-video' ) ) {
          // add the class acording with the direction
          if ( direction === 'right' ) {
            $( '.slick-next' ).addClass( 'gallery-ad' )
          } else {
            $( '.slick-prev' ).addClass( 'gallery-ad' )
          }
        }

        // Same logic but for previous slides with ad
        if ( this.getSlideEl( currentSlide ).hasClass( 'slideshow-ad-slide' ) || this.getSlideEl( currentSlide ).hasClass( 'slideshow-ad-video' ) ) {
          // if going right and current slide is ad, ignore < arrow
          if ( direction === 'right' ) {
            $( '.slick-prev' ).addClass( 'gallery-ad' )
          } else {
            $( '.slick-next' ).addClass( 'gallery-ad' )
          }

          // Empty video ad container if exists, this loads on desktop
          if ( $( '.video-ad' ).length ) {
            $( '.video-ad' ).empty()
          }

          // if the video was loaded on mobile, pause <video> tag
          if ( $( '#ad-video-element' ).attr( 'src' ) ) {
            $( '#ad-video-element' )[0].pause()
          }
        }

        // if next slide is an ad slide, attach the ad markup if it is not already attached
        // and refresh the ad
        if ( this.dfmCanRunAds && $nextSlideEl.hasClass( 'slideshow-ad-slide' ) ) {
          const $nextSlideElAdWrapper = $nextSlideEl.find( '.slideshow-ad-wrapper' )

          if ( $nextSlideElAdWrapper.is( ':empty' ) ) {
            this.slideshowAd.detach().appendTo( $nextSlideElAdWrapper )
          }

          if ( dfpAdDetails['Slideshow_1'] && dfpAdUnits['Slideshow_1'] ) {
            // find slideshow id and update attribute
            // then we send it to fill slide with ad function
            this.fillSlideElementWithAd(
              $nextSlideEl.find( '.slideshow-ad' ).attr( 'id', 'slide-ad-' + nextSlide ),
              dfpAdDetails['Slideshow_1'].path,
              dfpAdDetails['Slideshow_1'].sizes,
              dfpAdDetails['Slideshow_1'].targeting
            )
          }
        }

        // This is to fix jumpy image sizes at the end and beginning of slick's infinite slide cycle
        if ( this.slideCount - 1 === nextSlide ) {
          this.setImageDimensions( this.getSlideEl( -1 ) )
        } else if ( nextSlide === 0 ) {
          this.setImageDimensions( this.getSlideEl( this.slideCount ) )
        }

        // Resize next slide and update data
        this.updateSlideData( nextSlide )
        this.setImageDimensions( $nextSlideEl )
      }
    )

    // Ensure first slide is the correct size
    this.slideshowEl.on( 'init', () => {
      var currentSlide = this.getSlideEl( 0 )
      this.setImageDimensions( currentSlide )
    } )

    this.slick = this.slideshowEl.slick( {
      slidesToScroll: 1,
      slidesToShow: 1,
      dots: false,
      useTransform: true
    } ).slick( 'getSlick' )
  }

  /**
	 * Initialize click, esc button, and orientation change handlers for fullscreen
	 */
  initFullscreen() {
    super.listener( this.slideshowExpand, 'click', ( e ) => {
      e.preventDefault()
      this.toggleFullscreen()
    } )

    super.listener( $( document ), 'keyup', ( e ) => {
      if ( e.keyCode === 27 && this.isFullscreen ) {
        this.toggleFullscreen()
      }
    } )

    this.listener( $( window ), 'orientationchange', () => {
      this.forceRedraw()
      this.setImageDimensions( this.getSlideEl( this.slick.slickCurrentSlide() ) )
    } )
  }

  /**
	 * Expandable caption on mobile
	 */
  initMobileCaption() {
    super.listener( this.mobileCaption, 'click', () => {
      this.$element
        .find( '.caption' )
        .toggleClass( 'expand' )
    } )
  }

  /**
	 * Toggle slideshow fullscreen view
	 */
  toggleFullscreen() {
    // Add fullscreen class
    this.$element
      .add( 'body' )
      .toggleClass( 'fullscreen' )

    // Toggle fullscreen flag
    this.isFullscreen = !this.isFullscreen

    // Trigger redraw for Safari's sake
    if ( this.isFullscreen && this.checkBreakpoint( false, 'l' ) ) {
      this.forceRedraw()
      this.element.addEventListener( 'touchmove', this.preventDefaults, false )
    } else {
      this.forceRedraw()
      this.element.removeEventListener( 'touchmove', this.preventDefaults, false )
      $( window ).scrollTop( this.$element.offset().top - window.innerHeight / 5 )
    }

    this.slick.slickGoTo(
      this.slick.slickCurrentSlide(),
      true
    )
  }

  /**
	 * Insert total slide count
	 */
  initSlideCount() {
    this.$element.find( '.total' ).text( this.slideshowEl.data( 'total' ) )
  }

  /**
	 * Get the jQuery object for a slide
	 * @param {number} index of desired slide
	 */
  getSlideEl( slideIdx ) {
    return this.$element.find( '[data-slick-index="' + slideIdx + '"]' )
  }

  /**
	 * Force Safari to redraw it's goddamn DOM
	 */
  forceRedraw() {
    this.element.style.display = 'none'
    this.element.offsetHeight
    this.element.style.display = ''
  }

  /**
	 * Update slide caption and current slide count on 'beforeChange'
	 * @param {number} slideIdx - Index of current slide
	 */
  updateSlideData( slideIdx ) {
    const $slide = this.getSlideEl( slideIdx )
    const caption = $slide.find( '.slide-caption' ).text()
    const credit = $slide.find( '.slide-credit' ).text()

    // If slide is an ad, hide slide index display
    this.slideIndexDisplay.toggle( !$slide.hasClass( 'slideshow-ad-slide' ) )

    if ( typeof $slide !== 'undefined' ) {
      this.currentCount
        .text( $slide.data( 'index' ) )
      this.currentCaption.text( caption )
      this.currentCredit.text( credit )

      if ( caption !== '' && this.isFullscreen ) {
        this.mobileCaption.show()
      } else {
        this.mobileCaption.hide()
      }
    }
  }

  /**
	 * Set dimensions for the current slide and the two on either side of it
	 * @param {number} slideIdx - Index of current slide
	 */
  setLocalImageDimensions( slideIdx ) {
    for ( var i = slideIdx - 1; i <= slideIdx + 1; i++ ) {
      this.setImageDimensions(
        this.getSlideEl( i )
      )
    }
  }

  /**
	 * Reset the images dimensions based on comparison between slider aspect ratio and image aspect ratio
	 * @param {object} currentSlide - jQuery object for the current slide
	 */
  setImageDimensions( currentSlide ) {
    var slideImg = null,
      slideImgObj = currentSlide.find( 'img' ),
      slideSrc = null

    slideSrc = slideImgObj.data( 'src' )

    if ( !this.imageCache.hasOwnProperty( slideSrc ) ) {
      slideImg = new Image()
      slideImg.src = slideSrc

      slideImg.addEventListener( 'load', () => {
        this.setDimensionsHelper( slideImgObj, slideImg )
      } )

      this.imageCache[slideSrc] = slideImg
    } else {
      slideImg = this.imageCache[slideSrc]
      this.setDimensionsHelper( slideImgObj, slideImg )
    }
  }

  /**
	 * Helper for resizing slide images on image load or on demand
	 * @param {object} slideImgObj - jQuery object for the current slide image
	 * @param {object} currentSlide - javascript Image object for current slide image
	 */
  setDimensionsHelper( slideImgObj, slideImg ) {
    let imgRatio = 0
    let sliderRatio = 0

    var slider = this.$element.find( '.slick-slider' ),
      sliderWidth = slider.width(),
      sliderHeight = slider.height(),
      imgWidth = slideImg.naturalWidth,
      imgHeight = slideImg.naturalHeight

    imgRatio = imgWidth / imgHeight
    sliderRatio = sliderWidth / sliderHeight

    if ( sliderRatio > imgRatio || isNaN( imgRatio ) ) {
      slideImgObj
        .css( {
          'height': '100%',
          'width': 'auto'
        } )
        .data( 'orientation', 'height' )
    } else {
      slideImgObj
        .css( {
          'height': 'auto',
          'width': '100%'
        } )
        .data( 'orientation', 'width' )
    }
  }

  fillSlideElementWithAd( $el, slotCode, size, targeting ) {
    // if targetings are defined, set up new object
    if ( typeof targeting === 'undefined' ) {
      targeting = {}
    } else if ( Object.prototype.toString.call( targeting ) !== '[object Object]' ) {
      targeting = {}
    }

    // get slideshow ad id
    var elId = $el.attr( 'id' )

    googletag.cmd.push( function() {
      // destroy previous ad before serving a new one
      if ( dfpAdUnits['Slideshow_1'] ) {
        googletag.destroySlots( [dfpAdUnits['Slideshow_1']] )
      }

      // define new slot
      dfpAdUnits['Slideshow_1'] = googletag.defineSlot( slotCode, size, elId )

      // set each target
      for ( var t in targeting ) {
        dfpAdUnits['Slideshow_1'].setTargeting( t, targeting[t] )
      }

      dfpAdUnits['Slideshow_1'].addService( googletag.pubads() )

      // display ad
      googletag.display( elId )

      googletag.pubads().refresh( [dfpAdUnits['Slideshow_1']] )
    } )
  }

  /**
	 * Inject a VAST Tag ad video in a slide
	 * @param  {object} $element     Element to receive the video ad
	 * @param  {string} vastTagUrl
	 * @param  {object} videoContent
	 * @return void
	 */
  fillSlideElementWithVideoAd( $element, direction, vastTagUrl, videoContent ) {
    var arrowsDelay = this.videoArrowsDelay
    var slideshowEl = this.slideshowEl

    // disable arrows & block swipe
    $( '.slick-arrow' ).attr( 'disabled', true )
    slideshowEl.slick( 'setOption', 'swipe', false )

    // enable arrows and swipe again after X number of seconds
    setTimeout( function() {
      $( '.slick-arrow' ).attr( 'disabled', false )
      slideshowEl.slick( 'setOption', 'swipe', true )
    }, arrowsDelay * 1000 )

    var adDisplayContainer =
			new google.ima.AdDisplayContainer( $element, videoContent )

    // Must be done as the result of a user action on mobile
    adDisplayContainer.initialize()

    // Re-use this AdsLoader instance for the entire lifecycle of your page.
    var adsLoader = new google.ima.AdsLoader( adDisplayContainer )

    // Add event listeners
    adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      onAdsManagerLoaded,
      false )
    adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      onAdError,
      false )

    /* eslint consistent-this: [2, "that"] */
    var that = this

    function onAdError( adErrorEvent ) {
      // Handle the error logging and destroy the adsManager
      console.log( 'VAST TAG error: ' + adErrorEvent.getError() )

      // Fill video element with static ad when VAST tag fails
      if ( dfpAdDetails['Slideshow_1'] && dfpAdUnits['Slideshow_1'] ) {
        // transform video container on ad container
        $( '.slick-current' ).removeClass( 'slideshow-ad-video' ).addClass( 'slideshow-ad-slide' )

        var staticAdContainer = '<div class="slideshow-ad" id="slide-ad-backup"></div>'

        $( '.slick-current' ).find( '.slideshow-ad-wrapper' ).html( staticAdContainer )

        // find slideshow id and update attribute
        // then we send it to fill slide with ad function
        that.fillSlideElementWithAd(
          $( '.slick-current' ).find( '.slideshow-ad' ),
          dfpAdDetails['Slideshow_1'].path,
          dfpAdDetails['Slideshow_1'].sizes,
          dfpAdDetails['Slideshow_1'].targeting
        )
      }

      // activate arrows and swipe
      $( '.slick-arrow' ).removeAttr( 'disabled' )
      slideshowEl.slick( 'setOption', 'swipe', true )

      if ( typeof adsManager !== 'undefined' ) {
        adsManager.destroy()
      }
    }

    // An event listener to tell the SDK that our content video
    // is completed so the SDK can play any post-roll ads.
    var contentEndedListener = function() {
      adsLoader.contentComplete()
    }

    // Request video ads.
    var adsRequest = new google.ima.AdsRequest()

    // VMAP video ad
    adsRequest.adTagUrl = vastTagUrl

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = 640
    adsRequest.linearAdSlotHeight = 400
    adsRequest.nonLinearAdSlotWidth = 640
    adsRequest.nonLinearAdSlotHeight = 150

    // var playButton = document.getElementById( 'playButton' );
    // playButton.addEventListener( 'click', requestAds );

    // fire ads,
    requestAds()

    function requestAds() {
      adsLoader.requestAds( adsRequest )
    }

    function onAdsManagerLoaded( adsManagerLoadedEvent ) {
      // Get the ads manager.

      var adsManager = adsManagerLoadedEvent.getAdsManager( videoContent )

      // set video muted by default
      adsManager.setVolume( 0 )

      $( '#volumeAd' ).click( function() {
        if ( adsManager.getVolume() === 1 ) {
          adsManager.setVolume( 0 )
          $( this ).addClass( 'unmute-video' )
        } else {
          adsManager.setVolume( 1 )
          $( this ).removeClass( 'unmute-video' )
        }
      } )

      // Add listeners to the required events.
      adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError )
      adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested )
      adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested )

      try {
        // Initialize the ads manager. Ad rules playlist will start at this time.
        adsManager.init( 640, 360, google.ima.ViewMode.NORMAL )
        // Call start to show ads. Single video and overlay ads will
        adsManager.start()
        // Run the countdown
        startCountdown()
      } catch ( adError ) {
        // An error may be thrown if there was a problem with the VAST response.
      }
    }

    // begin the countdown timer
    function startCountdown() {
      // Countdown timer
      var timeleft = arrowsDelay
      // Show hidden div
      $( '.countdown' ).show( 'slow' )
      var downloadTimer = setInterval( function() {
        timeleft--
        $( '#countdownTimer' ).html( timeleft )
        if ( timeleft <= 1 ) {
          $( '.countdown' ).hide( 'slow' )
          clearInterval( downloadTimer )
        }
      }, 1000 )
    }

    function onContentResumeRequested() {
      // go next
      if ( direction === 'right' ) {
        $( '.slick-slider' ).slick( 'slickNext' )
      } else if ( direction === 'left' ) {
        $( '.slick-slider' ).slick( 'slickPrev' )
      }

      // empty div
      $( '#adContainer' ).html( '' )
    }

    function onContentPauseRequested() {
      // This function is where you should setup UI for showing ads (e.g.
      // display ad timer countdown, disable seeking, etc.)
      //  videoContent.removeEventListener('ended', contentEndedListener);
      // NOVID:  videoContent.pause();
    }
  }
}
