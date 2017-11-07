# Making a Node Module

In order to share code between different parts of Quill, we are pulling parts of the code into node modules which can be imported into different repositories as necessary.

## Setting up your node module

  1. Create a fork of (fork goes here)
  2. Go to the settings page of the new repo and rename your fork to whatever you're calling your new node module.
  3. Scroll down to the 'Danger Zone' and transfer ownership of the repository to empirical-org.
  4. Once the repository is owned by empirical-org, `git clone` it locally.
  5. Run `npm init` and answer all the questions.
  6. Run `npm install`
  7. Write the files you need for your node module ***and test them*** in the src and test directories respectively.
  8. Import all of the functions you want to export from your node module into one file (probably `main.ts`), and then export them from there as well.
  9. List this file as the entrypoint for your app in the `webpack.config.js` file.

    Example:

    ```
    module.exports = {
      entry: './src/main.ts',
      ...
    }
    ```

  10. Update your README to reflect any changes between the config for your module and the forked module. Make sure to remove the module-specific notes from the forked module, and instead add a section for each of your exported functions that explains how to use them.
  11. Run `npm i rollup rollup-plugin-typescript uglify-js -D`
  12. Run `npm run build:rollup`

## Updating the version
We keep track of versions using SemVer, which you can learn about at <http://semver.org/>. Every time a change gets committed to master, you should update your version using `npm version [<newversion> | major | minor | patch]`. Use `major` for a breaking page, `minor` for a backwards-compatible feature, and `patch` for a backwards-compatible bug fix.

## Publishing your node module
To publish your node module, run `npm publish` from the console. Make sure you install the latest version for each of the Quill repositories where the module is being used, and update the package.json accordingly.
