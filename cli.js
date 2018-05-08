#!/usr/bin/env node
/**
 * publish if needed
 */
'use strict'

const lib = require('./lib')
const argv = require('yargs').argv

void async function () {
  const published = await lib({
    branch: argv.branch,
    cwd: argv.cwd
  })
  if (published) {
    console.log('[publish-if-needed] Package has been published')
  } else {
    console.log('[publish-if-needed] No need to publish')
  }
}()
