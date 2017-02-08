/* eslint no-console: 0 */

let path = require('path')
let appRoot = require('app-root-path')
let Listr = require('listr')
let cosmiconfig = require('cosmiconfig')

let packageJson = require(appRoot.resolve('package.json')) // eslint-disable-line
let cgf = require('./changedGitFiles')
let runScript = require('./runScript')
let generateTasks = require('./generateTasks')

// Force colors for packages that depend on https://www.npmjs.com/package/supports-color
// but do this only in TTY mode
if (process.stdout.isTTY) {
  process.env.FORCE_COLOR = true
}

cosmiconfig('track-changed', {
  rc: '.trackchangedrc',
  rcExtensions: true
}).then((result) => {
  // result.config is the parsed configuration object
  // result.filepath is the path to the config file that was found
  let { config } = result
  let { verbose } = config
  // Output config in verbose mode
  if (verbose) console.log(config)
  let concurrent = typeof config.concurrent !== 'undefined' ? config.concurrent : true
  let renderer = verbose ? 'verbose' : 'update'
  let gitDir = config.gitDir ? path.resolve(config.gitDir) : process.cwd()

  try {
    let files = cgf(process.argv[2])
    if (!files || files.length === 0) {
      return
    }

    let resolvedFiles = {}
    files.forEach((file) => {
      let absolute = path.resolve(gitDir, file)
      let relative = path.relative(gitDir, absolute)
      resolvedFiles[relative] = absolute
    })

    let tasks = generateTasks(config, resolvedFiles)
      .map((task) => ({
        title: `Running tasks for ${task.pattern}`,
        task: () => (
          new Listr(
            runScript(task.commands, task.fileList, packageJson, { gitDir, verbose })
          )
        )
      }))


    if (tasks.length) {
      new Listr(tasks, { concurrent, renderer }).run().catch((error) => {
        console.error(error.message)
        process.exit(1)
      })
    }
  } catch (err) {
    console.error(err)
  }
}).catch((parsingError) => {
  console.error(`Could not parse track-changed config.
Make sure you have created it. See https://github.com/morhetz/track-changed#readme.

${parsingError}
`)
  process.exit(1)
})
