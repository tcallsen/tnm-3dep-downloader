const esModules = ['quick-lru'].join('|');

module.exports = {
  moduleFileExtensions: [
      "ts",
      "js"
  ],
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: [
      "**/test/**/*.test.(ts|js)"
  ],
  testEnvironment: "node",
  transformIgnorePatterns : [`/node_modules/(?!${esModules})`],
  testTimeout: 30000
};