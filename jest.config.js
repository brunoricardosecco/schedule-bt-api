const config = {
  roots: ['<rootDir>/src'],
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  preset: '@shelf/jest-postgres'
}

module.exports = config
