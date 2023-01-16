/**
 * Publish if needed
 * @function publishIfNeeded
 * @param {Object} [options={}]
 * @param {string} [options.cwd=process.cwd()]
 * @param {string} [options.branch='main']
 * @returns {boolean} Published or not
 */
'use strict'

const { gte } = require('semver')
const findup = require('findup')
const { exec, spawn } = require('child_process')
const { promisify } = require('util')
const path = require('path')
const debug = require('debug')('publish-if-needed')
const fs = require('fs')

const readFileAsync = promisify(fs.readFile)
const findupAsync = promisify(findup)
const execAsync = promisify(exec)

const utils = {
  async packageForDir(cwd) {
    const basename = 'package.json'
    const dirname = await findupAsync(cwd, basename).catch((err) => {
      throw (`[publish-if-needed] package.json not found from ${cwd}`)
    })
    const filename = path.resolve(dirname, basename)
    const content = await readFileAsync(filename)
    return JSON.parse(content)
  },
  async currentBranch(cwd) {
    const { TRAVIS_BRANCH } = process.env
    if (TRAVIS_BRANCH) {
      return TRAVIS_BRANCH
    }
    try {
      const { stdout, stderr } = await execAsync('git symbolic-ref --short HEAD', { cwd })
      return String(stdout).trim()
    } catch (e) {
      // symbolic-ref may fail on old git
    }
    {
      const { stdout, stderr } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd })
      return String(stdout).trim()
    }
  },
  isPullRequest() {
    // https://docs.travis-ci.com/user/environment-variables/
    // TRAVIS_PULL_REQUEST is set to the pull request number if the current job is a pull request build, or `false` if it’s not
    const { TRAVIS_PULL_REQUEST } = process.env
    return Boolean(TRAVIS_PULL_REQUEST) && TRAVIS_PULL_REQUEST !== 'false'
  },
  async publishedVersion(name) {
    try {
      const { stdout } = await execAsync(`npm info ${name} version`)
      return String(stdout).trim()
    } catch (e) {
      const message = String(e.stderr)
      const notFound = message.match('E404')
      if (notFound) {
        return null
      }
      throw new Error(message)
    }
  },
  async doPublish(cwd) {
    return await new Promise((resolve, reject) => {
      const npm = spawn('npm', ['publish', cwd], {
        stdio: 'inherit'
      })
      npm.on('close', () => resolve())
      npm.on('error', (err) => reject(err))
    })
  }
}

/** @lends publishIfNeeded */
async function publishIfNeeded(options = {}) {
  const {
    branch = 'main',
    cwd = process.cwd()
  } = options

  const currentBranch = await utils.currentBranch(cwd)
  debug('branch', { current: currentBranch, if: branch })
  if (currentBranch !== branch) {
    console.debug('[publish-if-needed] Not in branch to publish', {
      current: currentBranch,
      expect: branch,
    })
    return false
  }
  if (utils.isPullRequest()) {
    console.debug(`[publish-if-needed] Not to publish in a pull request`)
    return false
  }
  const pkg = await utils.packageForDir(cwd)
  const publishedVersion = await utils.publishedVersion(pkg.name)
  debug('version', { published: publishedVersion, current: pkg.version })
  const hasPublished = !!publishedVersion && gte(publishedVersion, pkg.version)
  if (hasPublished) {
    console.debug('[publish-if-needed] Current version is already published', {
      current: `${pkg.name}@${pkg.version}`,
      latest: `${pkg.name}@${publishedVersion}`,
    })
    return false
  }
  await utils.doPublish(cwd)
  return true
}

publishIfNeeded.utils = utils

module.exports = publishIfNeeded
