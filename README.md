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

### 1. Create package.json
```
npm init -f
```

### 2. TypeScript

```
npm i awesome-typescript-loader typescript -D
```

### 3. Create "tsConfig.json"
```
tsc --init
```

### 4. Create "src" and "dist" directories
with "src/main.ts"

### 5. Test
Mocha
```
npm i chai mocha -D
```
types
```
npm i @types/chai @types/mocha -D
```
Jasmine
TODO

### 6. Karma
Create "karma.conf.js"
```
karma init
```
With Mocha
```
npm i  karma-mocha karma-phantomjs-launcher karma-webpack -D
```

singleRun .. true

### 7. Webpack
```
npm i  webpack webpack-dev-server -D
```

### 8. NPM Scripts
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

### 9. Build
Rollup
```
npm i rollup rollup-plugin-typescript uglify-js -D
```
Create directory "build" with rollup configuration


### 10. Editor config

Create file ".editorconfig"

http://editorconfig.org/ 

Editor : Visual Studio Code

### 11. tsLint
```
npm i tslint -D
```
Create "tslint.json"
```
tslint --init
```
+ extension: tsLint for Visual Studio Code

### 12. CI
Travis

Create ".travis.yml"

### 13. LICENSE MIT

### 14. gitignore

