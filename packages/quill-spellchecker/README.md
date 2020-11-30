# Quill Spellchecker

- TypeScript 2.2
- Webpack 2
- Rollup
- tslint
- Mocha + Karma + PhantomJS

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

Lint (tslint)
```
npm run lint
```

Build (Webpack or Rollup)
```
npm run build
npm run build:rollup
```

## Defining a Dictionary

A dictionary is a list of words that potentially misspelled words will be compared against.

A dictionary is formed by a list of newline separated words. E.g., `const dict = 'misspelled\nforked';`

## Edits

Edits are a list of ways that the app will recognize a word as being misspelled.

For example, if you were to run:

```
import {edits} from '../src/main'
edits("ryan")
```

the returned value would be an array of all acceptable misspellings of 'ryan'. E.g.

```
['yan', 'ran', 'ryn', 'rya', 'yran', 'rayn', 'ryna', 'ayan', 'byan', 'cyan', 'dyan', 'eyan', 'fyan', 'gyan', 'hyan', 'iyan', 'jyan', 'kyan', 'lyan', 'myan', 'nyan', 'oyan', 'pyan', 'qyan', 'ryan', 'syan', 'tyan', 'uyan', 'vyan', 'wyan', 'xyan', 'yyan', 'zyan', 'raan', 'rban', 'rcan', 'rdan', 'rean', 'rfan', 'rgan', 'rhan', 'rian', 'rjan', 'rkan', 'rlan', 'rman', 'rnan', 'roan', 'rpan', 'rqan', 'rran', 'rsan', 'rtan', 'ruan', 'rvan', 'rwan', 'rxan', 'ryan', 'rzan', 'ryan', 'rybn', 'rycn', 'rydn', 'ryen', 'ryfn', 'rygn', 'ryhn', 'ryin', 'ryjn', 'rykn', 'ryln', 'rymn', 'rynn', 'ryon', 'rypn', 'ryqn', 'ryrn', 'rysn', 'rytn', 'ryun', 'ryvn', 'rywn', 'ryxn', 'ryyn', 'ryzn', 'ryaa', 'ryab', 'ryac', 'ryad', 'ryae', 'ryaf', 'ryag', 'ryah', 'ryai', 'ryaj', 'ryak', 'ryal', 'ryam', 'ryan', 'ryao', 'ryap', 'ryaq', 'ryar', 'ryas', 'ryat', 'ryau', 'ryav', 'ryaw', 'ryax', 'ryay', 'ryaz', 'aryan', 'bryan', 'cryan', 'dryan', 'eryan', 'fryan', 'gryan', 'hryan', 'iryan', 'jryan', 'kryan', 'lryan', 'mryan', 'nryan', 'oryan', 'pryan', 'qryan', 'rryan', 'sryan', 'tryan', 'uryan', 'vryan', 'wryan', 'xryan', 'yryan', 'zryan', 'rayan', 'rbyan', 'rcyan', 'rdyan', 'reyan', 'rfyan', 'rgyan', 'rhyan', 'riyan', 'rjyan', 'rkyan', 'rlyan', 'rmyan', 'rnyan', 'royan', 'rpyan', 'rqyan', 'rryan', 'rsyan', 'rtyan', 'ruyan', 'rvyan', 'rwyan', 'rxyan', 'ryyan', 'rzyan', 'ryaan', 'ryban', 'rycan', 'rydan', 'ryean', 'ryfan', 'rygan', 'ryhan', 'ryian', 'ryjan', 'rykan', 'rylan', 'ryman', 'rynan', 'ryoan', 'rypan', 'ryqan', 'ryran', 'rysan', 'rytan', 'ryuan', 'ryvan', 'rywan', 'ryxan', 'ryyan', 'ryzan', 'ryaan', 'ryabn', 'ryacn', 'ryadn', 'ryaen', 'ryafn', 'ryagn', 'ryahn', 'ryain', 'ryajn', 'ryakn', 'ryaln', 'ryamn', 'ryann', 'ryaon', 'ryapn', 'ryaqn', 'ryarn', 'ryasn', 'ryatn', 'ryaun', 'ryavn', 'ryawn', 'ryaxn', 'ryayn', 'ryazn', 'ryana', 'ryanb', 'ryanc', 'ryand', 'ryane', 'ryanf', 'ryang', 'ryanh', 'ryani', 'ryanj', 'ryank', 'ryanl', 'ryanm', 'ryann', 'ryano', 'ryanp', 'ryanq', 'ryanr', 'ryans', 'ryant', 'ryanu', 'ryanv', 'ryanw', 'ryanx', 'ryany', 'ryanz']
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
npm i  karma-mocha karma-webpack -D
```
singleRun .. true

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

### LICENSE MIT

### gitignore
