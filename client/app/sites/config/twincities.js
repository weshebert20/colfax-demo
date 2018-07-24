/**
 * Twincities Site config
 *
 * For synchronous loading of a component:
 * Import component class and register in componentClass property
 *
 * For async loading of a component:
 * Do not import class and register componentClass property with a string corresponding to component class name
 */

import { commonConfig } from './default'

export var twincities = {
  name: 'twincities',
  siteSpecific: {
    dailydeals: {
      componentClass: 'DailyDeals',
      selector: '.daily-deals-flyout',
      options: {
        dealsNav: '.daily-deals-nav',
        dealsPushEls: '#content, .site-header, .status-bar',
        close: '.icon-close'
      }
    },
    trending: {
      componentClass: 'Trending',
      selector: '.trending-bar'
    },
    editorspicks: {
      componentClass: 'EditorsPicks',
      selector: '.editors-picks-flyout-wrapper',
      options: {
        editorsNav: '.editors-picks-nav'
      }
    },
    mediaslideshow: {
      componentClass: 'MediaSlideshow',
      selector: '.feature-media'
    },
    togglecomments: {
      componentClass: 'ToggleComments',
      selector: '.js-comment-toggle'
    }
  },
  components: commonConfig
}
