/**
 * Publish if needed
 * @function publishIfNeeded
 * @param {Object} [options={}]
 * @param {string} [options.cwd=process.cwd()]
 * @param {string} [options.branch='master']
 * @returns {boolean} Published or not
 */
'use strict'

const {gt} = require('semver')
const findup = require('findup')
const {exec} = require('child_process')
const {promisify} = require('util')
const path = require('path')
const fs = require('fs')

const readFileAsync = promisify(fs.readFile)
const findupAsync = promisify(findup)
const execAsync = promisify(exec)

const utils = {
  async packageForDir (cwd) {
    const basename = 'package.json'
    const dirname = await findupAsync(cwd, basename).catch((err) => {
      throw (`[publish-if-needed] package.json not found from ${cwd}`)
    })
    const filename = path.resolve(dirname, basename)
    const content = await readFileAsync(filename)
    return JSON.parse(content)
  },
  async currentBranch (cwd) {
    const {stdout, stderr} = await execAsync('git name-rev --name-only HEAD', {cwd})
    return String(stdout).trim()
  },
  async publishedVersion (name) {
    const {stdout} = await execAsync(`npm info ${name} version`)
    return String(stdout).trim()
  },
  async doPublish (cwd) {
    const {stdout} = await execAsync(`npm publish ${cwd}`)
    return String(stdout).trim()
  }
}

/** @lends publishIfNeeded */
async function publishIfNeeded (options = {}) {
  const {
    branch = 'master',
    cwd = process.cwd()
  } = options

  const currentBranch = await utils.currentBranch(cwd)
  if (currentBranch !== branch) {
    return false
  }
  const pkg = await utils.packageForDir(cwd)
  const publishedVersion = await utils.publishedVersion(pkg.name)
  const isGreater = gt(pkg.version, publishedVersion)
  if (!isGreater) {
    return false
  }
  const result = await utils.doPublish(cwd)
  console.log(result)
  return true
}

publishIfNeeded.utils = utils

module.exports = publishIfNeeded
