let findBin = require('./findBin')
let execa = require('execa')

module.exports = function runScript(commands, pathsToLint, packageJson, options) {
  let trackersArray = Array.isArray(commands) ? commands : [ commands ]
  return trackersArray.map((tracker) => ({
    title: tracker,
    task: () => {
      try {
        let res = findBin(tracker, pathsToLint, packageJson, options)
        let execaOptions = res.bin !== 'npm' && options && options.gitDir ? { cwd: options.gitDir } : {}
        return new Promise((resolve, reject) => {
          execa(res.bin, res.args, execaOptions)
            .then(() => {
              resolve(`${tracker} passed!`)
            })
            .catch((err) => {
              reject(new Error(`
🚫  ${tracker} failed.

${err.stderr}
${err.stdout}
                `))
            })
        })
      } catch (err) {
        throw err
      }
    }
  }))
}

