const config = {
  roots: ['<rootDir>/src'],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!**/*.protocols.ts',
    '!**/protocols/**'
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}

module.exports = config
