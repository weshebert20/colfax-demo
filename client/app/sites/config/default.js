/**
 * Default configuration object for common components
 */

import { Header } from '../../components/Header'
import { PushNav } from '../../components/PushNav'

export var commonConfig = {
  header: {
    componentClass: Header,
    selector: '.site-header',
    options: {
      articlePage: '.single-post, .single-article',
      placeholder: '.header-placeholder',
      scroller: 'body',
      dropdowns: '.menu-item-has-children > a',
      offset: 85
    }
  },
  pushnav: {
    componentClass: PushNav,
    selector: '.pushnav',
    options: {
      navTrigger: '.icon-hamburger',
      containerEls: '.site-header, .site-footer, #content, html',
      submenu: '.menu-item-has-children > a'
    }
  },
  articlebody: {
    componentClass: 'ArticleBody',
    selector: '.article-body',
    options: {
      videos: 'iframe[src*="vimeo.com"], iframe[src*="youtube.com"]',
      wrappers: '.embed-vimeo, .embed-youtube'
    }
  },
  articlehighlights: {
    componentClass: 'ArticleHighlights',
    selector: '.highlights'
  },
  articlesharemore: {
    componentClass: 'ArticleShareMore',
    selector: '.sharedaddy'
  },
  articlesidebar: {
    componentClass: 'ArticleSidebar',
    selector: '.article-sidebar',
    options: {
      article: '.full-view',
      header: '.header-features',
      related: '.related',
      popular: '.widget-popular-stories',
      body: '.article-body',
      text: '.body-copy',
      tags: '.tags',
      stickyad: '#div-gpt-ad-Cube2_RRail_mid',
      upperad: '#div-gpt-ad-Cube1_RRail_ATF',
      lowerad: '.sidebar-bottom',
      firstInline: '#div-gpt-ad-Cube1_RRail_ATF',
      footer: '.article-footer',
      trigger: '#stick-trigger'
    }
  },
  articleslideshow: {
    componentClass: 'ArticleSlideshow',
    selector: '.article-slideshow',
    options: {
      slideshowExpand: '.icon-enlarge, .icon-close',
      mobileCaption: '.caption .caption-expand'
    }
  },
  authorbio: {
    componentClass: 'AuthorBio',
    selector: '.author-bio'
  },
  authorevents: {
    componentClass: 'AuthorEvents',
    selector: '.author-events'
  },
  authortweetslideshow: {
    componentClass: 'AuthorTweetSlideshow',
    selector: '.twitter-feed'
  },
  breakingbar: {
    componentClass: 'BreakingBar',
    selector: '.breaking-bar'
  },
  footer: {
    componentClass: 'Footer',
    selector: '.site-footer',
    options: {
      submenus: '.menu-item-has-children',
      expander: '.expander',
      toggle: 'icon-arrow-down icon-arrow-up'
    }
  },
  landingFeature: {
    componentClass: 'LandingFeature',
    selector: '.feature-primary.slow',
    options: {
      rightCol: '.feature-top'
    }
  },
  loadmore: {
    componentClass: 'LoadMore',
    selector: '.load-more',
    options: {
      postNav: '.posts-navigation'
    }
  },
  mobileslideshare: {
    componentClass: 'MobileSlideShare',
    selector: '.site-header .article-share'
  },
  searchfilters: {
    componentClass: 'SearchFilters',
    selector: '.filter',
    options: {
      filterExpand: '.filter-expand',
      searchContent: '.search-content',
      allCats: '.see-all-categories',
      hideableCats: '.hideable-category'
    }
  },
  sectionFeature: {
    componentClass: 'LandingFeature',
    selector: '.feature-section',
    options: {
      rightCol: '.feature-right'
    }
  },
  sharingEmail: {
    componentClass: 'SharingEmail',
    selector: '#sharing_email'
  },
  slidesearch: {
    componentClass: 'SlideSearch',
    selector: '.slide-search',
    options: {
      breakpoint: 'l',
      notify: '.site-header',
      header: '.site-header',
      altsearch: '.header-search'
    }
  },
  swappable: {
    componentClass: 'Swappable',
    selector: '.swappable'
  },
  showMore: {
    componentClass: 'ShowMore',
    selector: '.btn-show-more',
    options: {
      moreContent: '.more-content-to-show'
    }
  }
}
