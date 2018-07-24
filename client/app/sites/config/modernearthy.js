/**
 * Modern Earthy Site config
 *
 * For synchronous loading of a component:
 * Import component class and register in componentClass property
 *
 * For async loading of a component:
 * Do not import class and register componentClass property with a string corresponding to component class name
 */

import { commonConfig } from './default'

const localConfig = {
  pushnav: {
    options: {
      menuPosition: 'right'
    }
  },
  articlesidebar: {
    options: {
      lowerad: '.swap-ad-lower',
      sidebarContent: '.sidebar-content'
    }
  }
}

export var modernearthy = {
  name: 'modernearthy',
  siteSpecific: {
    mediaslideshow: {
      componentClass: 'MediaSlideshow',
      selector: '.feature-media'
    },
    togglecomments: {
      componentClass: 'ToggleComments',
      selector: '.js-comment-toggle'
    }
  },
  components: $.extend( true, {}, commonConfig, localConfig )
}
