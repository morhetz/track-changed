let npmWhich = require('npm-which')(process.cwd())
let which = require('which')

module.exports = function findBin(cmd, paths, packageJson, options) {
  /*
    * If package.json has script with cmd defined
    * we want it to be executed first
    */
  if (packageJson.scripts && packageJson.scripts[cmd] !== undefined) {
    // Support for scripts from package.json
    return {
      bin: 'npm',
      args: [
        'run',
        options && options.verbose ? undefined : '--silent',
        cmd.replace('$@', [ '--' ].concat(paths))
      ].filter(Boolean)
    }
  }

    /*
     *  If cmd wasn't found in package.json scripts
     *  we'll try to locate the binary in node_modules/.bin
     *  and if this fails in $PATH.
     *
     *  This is useful for shorter configs like:
     *
     *  "track-changed": {
     *    "*.js": "eslint"
     *  }
     *
     *  without adding
     *
     *  "scripts" {
     *    "eslint": "eslint"
     *  }
     */

  let parts = cmd.replace('$@', [ '' ].concat(paths)).split(' ')
  let bin = parts[0]
  let args = parts.splice(1)

  try {
    /* Firstly, try to resolve the bin in local node_modules/.bin */
    bin = npmWhich.sync(bin)
  } catch (err) {
    /* If this fails, try to resolve binary in $PATH */
    try {
      bin = which.sync(bin)
    } catch (error) {
      throw new Error(`${bin} could not be found. Try \`npm install ${bin}\`.`)
    }
  }

  return { bin, args }
}
