# publish-if-needed

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_travis_url]: http://travis-ci.org/okunishinishi/node-publish-if-needed
[bd_travis_shield_url]: http://img.shields.io/travis/okunishinishi/node-publish-if-needed.svg?style=flat
[bd_npm_url]: http://www.npmjs.org/package/publish-if-needed
[bd_npm_shield_url]: http://img.shields.io/npm/v/publish-if-needed.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg



Publish npm package if 

* Current branch is `master`
* Version in `package.json` is greater than the published one 

## Install

```bash
npm i publish-if-needed
```

## Usage 

```bash

# Increment package.json version
npm version patch
# Publish version if needed
npx publish-if-needed

```

## Programmatic API

```node
const publishIfNeeded = require('publish-if-needed')

publishIfNeeded()
```
