module.exports = function (api) {
  api.cache.forever();

  const plugins = ["@babel/plugin-transform-modules-commonjs"];

  return {
    plugins
  }
}
