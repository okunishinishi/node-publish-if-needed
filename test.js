/**
 * Test
 */
'use strict'

const lib = require('./lib')
const index = require('./index')
const {equal, ok} = require('assert')

describe('publish if needed', async function () {
  this.timeout(40000)
  it('utils.packageForDir', async () => {
    const pkg = await lib.utils.packageForDir(__dirname)
    ok(pkg)
    equal(pkg.name, 'publish-if-needed')
  })

  it('utils.currentBranch', async () => {
    const currentBranch = await lib.utils.currentBranch(__dirname)
    ok(currentBranch)
  })

  it('utils.publishedVersion', async () => {
    const version = await lib.utils.publishedVersion('objnest')
    ok(version)

    {
      await lib.utils.publishedVersion('__invalid_package_______')
    }
  })

  it('utils.isPullRequest', async () => {
    const current = process.env.TRAVIS_PULL_REQUEST
    {
      process.env.TRAVIS_PULL_REQUEST = ''
      ok(!lib.utils.isPullRequest())
    }
    {
      process.env.TRAVIS_PULL_REQUEST = 'false'
      ok(!lib.utils.isPullRequest())
    }
    {
      process.env.TRAVIS_PULL_REQUEST = '1'
      ok(lib.utils.isPullRequest())
    }
    process.env.TRAVIS_PULL_REQUEST = current
  })

  it('index', async () => {
    equal(typeof index, 'function')
  })
})

/* global describe, it */
