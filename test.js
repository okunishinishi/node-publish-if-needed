/**
 * Test
 */
'use strict'

const lib = require('./lib')
const {equal, ok} = require('assert')

describe('publish if needed', async () => {

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
  })
})

/* global describe, it */
