module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  testMatch: [
    "**/src/__tests__/**/*.(test|spec).+(ts|js)",
    "**/src/**/*.(test|spec).+(ts|js)"
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: false,
  clearMocks: true,
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['./jest.setup.js'],
};
