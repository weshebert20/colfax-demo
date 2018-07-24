/**
 * Denver Post Site config
 *
 * For synchronous loading of a component:
 * Import component class and register in componentClass property
 *
 * For async loading of a component:
 * Do not import class and register componentClass property with a string corresponding to component class name
 */

import { commonConfig } from './default'

export var denverpost = {
  name: 'denverpost',
  siteSpecific: {
    sectionsticky: {
      componentClass: 'SectionSticky',
      selector: '.category #div-gpt-ad-Cube3_RRail_lower',
      options: {
        sidebar: '.three-one-right',
        content: '.three-one-left',
        feature: '.feature-section',
        section: '.section-highlight',
        trigger: '#stick-trigger',
        sidebarWidgetClass: '.dfm-sidebar-bottom-flex-container'
      }
    }
  },
  components: commonConfig
}
