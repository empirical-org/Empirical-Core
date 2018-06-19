# @spiffdog/component-library-rollup (TypeScript)
Spiffdog Design boilerplate for a React component library using TypeScript w/ Rollup.

## Introduction
This is essentially the same component Proof of Concept used at the [component-library PoC](https://github.com/Spiffdog-Design/component-library).  The biggest difference is the use of [Rollup](https://rollupjs.org) instead of Webpack as the project build system.

## Why Rollup?
Firstly, it is the tool that [Facebook uses to build the React ecosystem](https://reactjs.org/blog/2017/12/15/improving-the-repository-infrastructure.html#migrating-to-rollup).  In actual usage, I have noticed between a 5-15x smaller bundle size vs Webpack without any degredation in functionality or speed.  It is also much easier to configure and maintain.

Rollup is missing a few niceties like code-splitting that are targetted toward application bundling.  Webpack is still preferred for _*application*_ build workflows.  However, because of how it works and the small size of it's output, Rollup is ideal for imported libraries.

### Install for development
```
git clone https://github.com/Spiffdog-Design/component-library-rollup.git
yarn install
yarn link
```
The console should output the command to link to this module (i.e. `yarn link @spiffdog/component-library`).  Go to your React app's folder in the terminal and execute that command.  You can then use that library as usual.
```
import { Card } from '@spiffdog/component-library-rollup';
```

### Install for Production Use
Install the library from the NPM repo.
```
yarn add @spiffdog/component-library-rollup
```

### Development
* `yarn start`

### Production Build
* `yarn build`

### Publish to NPM
* `yarn dist`
