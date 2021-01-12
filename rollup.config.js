import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
    external: [/@babel\/runtime/u],
    input: './src/index.js',
    output: [
        {
            file: `./lib/index.cjs.js`,
            format: 'cjs',
        },
        {
            file: `./lib/index.esm.js`,
            format: 'esm',
        },
    ],
    plugins: [
        commonjs({
            include: '../node_modules/**',
        }),
        peerDepsExternal(),
        nodeResolve({
            extensions: ['.js', '.jsx'],
        }),
        babel({
            babelHelpers: 'runtime',
            comments: false,
            configFile: './babel.config.js',
            exclude: './node_modules/**',
        }),
    ],
};
