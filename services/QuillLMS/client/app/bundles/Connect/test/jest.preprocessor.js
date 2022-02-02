const tsc = require('typescript');
const babelJest = require('babel-jest');

module.exports = {
  process(src, path) {
    const isTs = path.endsWith('.ts');
    const isTsx = path.endsWith('.tsx');

    if (isTs || isTsx) {
      src = tsc.transpileModule(
        src,
        {
          compilerOptions: {
            module: tsc.ModuleKind.ES6,
            target: tsc.ScriptTarget.ES5,
            moduleResolution: tsc.ModuleResolutionKind.Node,
            allowSyntheticDefaultImports: true,
            jsx: tsc.JsxEmit.Preserve,
            sourceMap: true,
            outDir: './dist/',
          },
          fileName: path,
        }
      );
      src = src.outputText;

      // update the path so babel can try and process the output
      path = path.substr(0, path.lastIndexOf('.')) + (isTs ? '.js' : '.jsx') || path;
    }

    if (path.endsWith('.js') || path.endsWith('.jsx')) {
      src = babelJest.process(src, path);
    }
    return src;
  },
};
