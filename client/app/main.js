/* eslint-disable */
if ( dfmBuild.isHot )  {
  __webpack_public_path__ = 'http://localhost:8080/static';
} else if ( 'undefined' !== typeof scriptHelpers ) {
  __webpack_public_path__ = scriptHelpers.staticPath;
} else if ( 'assets.digitalfirstmedia.com' === window.location.hostname ) {
  // Choose the right path location
  const pathDirs = window.location.pathname.split('/');
  __webpack_public_path__ = `/${pathDirs[1]}/static`;
} else {
  __webpack_public_path__ = '/wp-content/themes/wp-mason/knowlton/static';
}

/* eslint-enable */

// Print scss (used on every site)
// Override loader pattern to utilize style-loader (print styles can load async)
require( '!style-loader!css-loader!sass-loader!../scss/print.scss' )
