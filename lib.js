/**
 * Publish if needed
 * @function publishIfNeeded
 * @param {Object} [options]
 */
'use strict'

const {gt} = require('semver')
const findup = require('findup')
const {exec} = require('child_process')

/** @lends publishIfNeeded */
async function publishIfNeeded (options = {}) {
  const {
    branch = 'master',
    cwd = process.cwd()
  } = options

  const pkg = await new Promise((resolve, reject) =>
    findup(cwd, 'package.json', (err, found) =>
      err ? reject(err) : resolve(found)
    )
  )

  if (!pkg) {
    throw new Error(`[publish-if-needed] package.json not found for dir ${cwd}`)
  }
}

module.exports = publishIfNeeded
