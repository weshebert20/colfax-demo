# Knowlton Style System

This README documents how to use the style system for Knowlton. This style system provides:
* In-production stylesheets,

## Organization
All styles for each of sites in the DFM network are organized in the `client/scss` directory. The following is a description of each directory and what it should be used for:

* `common-base` - Common utilities and basic styles. These are styles used by ALL sites and should be included when building any new site, so use caution and test thoroughly when editing them.
Within this directory there are:
* `entries` - SCSS files for use when referencing a site's styles via webpack. Each site should load only a single file via webpack, and that file should be located in this directory.
* `layouts` - Contains structural layouts common across site families. Eventually, every site should only load a single layout. However, currently _every_ site extends the `common` layout and some extend another layout beyond that. For example, Mercury News extends both the `common` and `bang` layouts. Always be aware which sites will be effected when editing the contents of a layout.
* `sg` - Styles exclusively for use in the styleguides. The styles in this directory are used in every styleguide.
* `sites` - Entry-specific styles. Thesee styles should _extend_ the styles found in the layout the site is using, meaning the directories in `sites` should roughly match the structure of the directories in a given layout.
* `themes` - These directories contain exclusively colors, fonts, type, and other base-level styles. Every site should extend one theme. These directories should roughly match up with the structure and files in the `common-base` directory and serve as an extension of it.

In addition, there are nubmer of style subdirectories:
* `core` - Contains core variables. Loading the files in this directory should never result in CSS output, meaning they contain only variables, extends, mixins, etc.
* `layout` - Layout-related base styles
* `utilities` - Larger re-usable structures and classes. This directory may output CSS. In addition, any time you write new re-usable styles, consider whether or not it might be useful for other sites to have access to them and, if so, put them in the `common-base` directory instead.
* `components` - Contains higher level compontents, organized roughly by template. For example, the Most Popular module should be styled here.
* `pages` - Page- or template-level styles. These styles should general focus on structural layout of smaller modules; avoid setting presentational styles in these files (like colors, fonts, etc.).
