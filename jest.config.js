module.exports = {
    cacheDirectory: '.jest-cache',
    coverageDirectory: '.jest-coverage',
    coveragePathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/lib/', '<rootDir>/packages/(?:.+?)/index.js'],
    coverageReporters: ['html', 'text'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    modulePaths: ['<rootDir>/node_modules'],
    testPathIgnorePatterns: ['<rootDir>/packages/*/lib/*', '<rootDir>/packages/(?:.+?)/index.js'],
};
