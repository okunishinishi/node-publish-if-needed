# publish-if-needed

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