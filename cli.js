#!/usr/bin/env node
/**
 * publish if needed
 */
'use strict'

const lib = require('lib')
const argv = require('yargs').argv

lib({
  branch: argv.branch,
  cwd: argv.cwd
})
