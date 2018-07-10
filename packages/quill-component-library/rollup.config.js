import path from 'path';

import commonjs from 'rollup-plugin-commonjs';
import packageJson from 'rollup-plugin-generate-package-json';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const libraryName = 'ComponentLibrary',
    globalLibs = {
        "classnames": "classnames",
        "react": "React"
    },
    externalLibs = [
        'classnames',
        'react'
    ];

export default {
    input: 'src/index.tsx',
    output: [{
        external: externalLibs,
        file: `dist/${pkg.main}`,
        format: 'umd',
        globals: globalLibs,
        name: libraryName
    }, {
        external: externalLibs,
        file: `dist/${pkg.module}`,
        format: 'es',
        globals: globalLibs,
        name: libraryName
    }],
    plugins: [
        postcss({
            modules: true
        }),
        tslint({
            exclude: '!./src/**/*.tsx?',
            include: './src/**/*.tsx?'
        }),
        typescript({
            clean: true,
            typescript: require('typescript'),
            verbosity: 0
        }),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
              'node_modules/prop-types/index.js': ['bool', 'object', 'string', 'func', 'oneOfType', 'array', 'shape', 'element', 'arrayOf'],
              'node_modules/react/react.js': ['createElement']
            }
        }),
        resolve({
            // pass custom options to the resolve plugin
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        packageJson({
            // By default, the plugin searches for package.json file.
            // Optionally, you can specify its path
            inputFile: path.resolve(__dirname, './package.json'),

            // Set output folder, where generated package.json file will be saved
            outputFolder: path.resolve(__dirname, './dist'),

            // Optionally, you can set base contents for your generated package.json file
            baseContents: {
                "name": pkg.name,
                "version": pkg.version,
                "description": pkg.description,
                "main": pkg.main,
                "module": pkg.module,
                "homepage": pkg.homepage,
                "author": pkg.author,
                "license": pkg.license,
                "repository": pkg.repository,
                "bugs": pkg.bugs,
                "dependencies": pkg.peerDependencies,
                "private": false
            }
        })
    ]
};
