let minimatch = require('minimatch')

module.exports = function generateTasks(config, files) {
  let trackers = (config.trackers !== undefined) ? config.trackers : config
  let resolve = (file) => files[file]

  return Object.keys(trackers).map((pattern) => {
    let commands = trackers[pattern]
    let filter = minimatch.filter(pattern, { matchBase: true, dot: true })
    let fileList = Object.keys(files).filter(filter).map(resolve)
    if (fileList.length) {
      return { pattern, commands, fileList }
    }
    return undefined
  }).filter(Boolean) // Filter undefined values
}
