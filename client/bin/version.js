const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')

/* Primary function for versioning assets
 *
 * @param {object} stats - webpack stats object
 * @param {bool} production - whether or not we're on the production environment
 */
module.exports = function (stats, production) {
  const assets = stats.assetsByChunkName
  const result = {}
  let gitHash
  let versions

  try {
    // Make sure we aren't caching the previous versions for subsequent builds
    delete require.cache[require.resolve('../../static/supported-versions')]
    versions = require('../../static/supported-versions')
  } catch (e) {
    versions = []
  }

  // Only update and check against previous versions if we're building for production
  if (versions.indexOf(stats.hash) === -1 && production) {
    gitHash = getGithash()
    versions = manageVersions(stats.hash, versions)
    cleanAssets(versions)
    fs.writeFileSync(
      path.join(__dirname, '../../static/supported-versions.js'),
      `${gitHash ? `// Latest commit: ${gitHash}` : ''}
module.exports = [
  ${versions.map((hash) => `\t'${hash}',`).join('\n')}
];\n`
    )
  }

  // Generate manifest data
  if (assets > 0) {
    Object.keys(assets).forEach((asset) => {
      assets[asset].forEach((assetName) => {
        const assetPath = assetName.charAt(0) === '/' ? assetName.slice(1) : assetName
        const pathData = path.parse(assetName)
        const ext = pathData.ext.replace('.', '')

        // Don't include sourcempas in the asset manifest
        if (ext !== 'map') {
          result[`${asset}-${ext}`] = assetPath
        }
      })
    })
  }

  return JSON.stringify(result, false, '\t')
}

/* Add hash to previous versions array and remove upsupported ones
 *
 * @param {string} hash - current version hash
 * @param {array} versions - Previously supported versions
 */
function manageVersions (hash, versions) {
  let newVersions = versions.concat(hash)

  // Check to see if we have more than 20 previous hashes and, if so, remove the oldest one
  if (newVersions.length > 20) {
    newVersions = newVersions.filter((currHash, idx) => idx !== 0)
  }

  return newVersions
}

/* Remove old js/css assets
 *
 * @param {array} versions - Previously supported versions
 */
function cleanAssets (versions) {
  const jsDir = path.join(__dirname, '../../static/js')
  const cssDir = path.join(__dirname, '../../static/css')
  const js = fs.readdirSync(jsDir)
  const css = fs.readdirSync(cssDir)

  js.forEach((file) => {
    manageAsset(versions, file, jsDir)
  })

  css.forEach((file) => {
    manageAsset(versions, file, cssDir)
  })
}

/* Verify asset is ok to remove, then remove it
 *
 * Only remove file if:
 * - File doesn't contain current or previous hash
 * - Current hash is not the same as previous hash
 * - File is not a critical CSS file (critical CSS is not hashed)
 * - File is not a README
 *
 * @param {array} versions - Previously supported versions
 * @param {string} file - filename to check whether or not to delete
 * @param {string} dir - file directory
 */
function manageAsset (versions, file, dir) {
  const isPrevVersion = versions.filter((hash) => file.indexOf(hash) !== -1)

  if (
    file.indexOf('critical') === -1 &&
    file.indexOf('README') === -1 &&
    !isPrevVersion.length
  ) {
    fs.unlink(path.join(dir, file))
  }
}

/*
 * Get current git hash for reference
 */
function getGithash () {
  let hash

  try {
    hash = childProcess.execSync('/usr/local/bin/git rev-parse --short=7 HEAD', { encoding: 'utf8' })
    hash.trim()
  } catch (e) {
    console.warn('Could not retrieve git hash, skipping')
    hash = false
  }

  return hash
}
