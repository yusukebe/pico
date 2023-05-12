module.exports = {
  testMatch: ['**/test/**/*.+(ts|tsx)', '**/src/**/(*.)+(spec|test).+(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'esbuild-jest',
  },
  testPathIgnorePatterns: ['./examples'],
  testEnvironment: 'miniflare',
}
