# TypeScript Starter Project

## Usage

Install dependencies

```
npm i
```

Dev (webpack dev server)
```
npm run dev
```

Test (Karma + PhantomJS)
```
npm run test
```

Lint (tsLint)
```
npm run lint
```

Build (Webpack or Rollup)
```
npm run build
npm run build:rollup
```

## Memento (Steps)

### package.json
```
npm init -f
```

### TypeScript

```
npm i ts-loader typescript -D
```
or "awesome-typescript-loader"

### "tsConfig.json"
```
tsc --init
```

### Mocha

```
npm i chai mocha -D
```
types
```
npm i @types/chai @types/mocha -D
```

### Karma

Create "karma.conf.js"
```
karma init
```
With Mocha
```
npm i  karma-mocha karma-phantomjs-launcher karma-webpack -D
```
singleRun .. true

### Webpack
```
npm i  webpack webpack-dev-server -D
```

### NPM Scripts
```
npm i cross-env -D
```

Dev
```
npm run dev
```
Test
```
npm run test
```
Lint
```
npm run lint
```

Build
```
npm run build
```

Build With Rollup
```
npm i rollup rollup-plugin-typescript uglify-js -D
```

```
npm run build: rollup
```

### Editor config

Create file ".editorconfig"

http://editorconfig.org/ 

Editor : Visual Studio Code

### tsLint
```
npm i tslint -D
```
Create "tslint.json"
```
tslint --init
```
+ extension: tsLint for Visual Studio Code

### CI
Travis

Create ".travis.yml"

### LICENSE MIT

### gitignore

