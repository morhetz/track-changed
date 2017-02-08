let { execSync } = require('child_process')

module.exports = function changedGitFiles(opMode) {
  let getModifiedFilesInTreeCommand = 'git diff-tree -r --name-only --no-commit-id HEAD@{1} HEAD'

  if (opMode === 'checkout') {
    let params = process.env.GIT_PARAMS.split(' ')

    if (params[2] === '0') {
      // Exit early if this was only a file checkout, not a branch change ($3 == 1)
      return []
    }
    getModifiedFilesInTreeCommand = `git diff-tree -r --name-only --no-commit-id ${params[0]} ${params[1]}`
  }

  let sources = execSync(getModifiedFilesInTreeCommand, { encoding: 'utf-8' })
  return sources.split('\n')
}
