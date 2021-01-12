module.exports = {
    plugins: [
        ['module-resolver', { root: ['./src'] }],
        'transform-optional-chaining',
        '@babel/proposal-async-generator-functions',
        '@babel/proposal-class-properties',
        '@babel/plugin-transform-runtime',
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
    ],
};
