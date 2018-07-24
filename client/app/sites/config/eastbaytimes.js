/**
 * East Bay Times Site config
 *
 * For synchronous loading of a component:
 * Import component class and register in componentClass property
 *
 * For async loading of a component:
 * Do not import class and register componentClass property with a string corresponding to component class name
 */

import { commonConfig } from './default'

const localConfig = {
  articlehighlights: {
    options: {
      skipBreakpoint: true
    }
  },
  articlesidebar: {
    options: {
      lowerad: '.swap-ad-lower',
      sidebarContent: '.sidebar-content'
    }
  },
  header: {
    options: {
      offset: 185
    }
  },
  pushnav: {
    options: {
      menuPosition: 'right'
    }
  }
}

export var eastbaytimes = {
  name: 'eastbaytimes',
  siteSpecific: {},
  components: $.extend( true, {}, commonConfig, localConfig )
}
