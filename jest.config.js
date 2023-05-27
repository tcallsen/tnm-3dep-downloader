export default {
  moduleFileExtensions: [
      "ts",
      "js"
  ],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
      "^.+\\.(ts|tsx)$": [
        "ts-jest",
        {
          tsconfig: "tsconfig.json",
          useESM: true
        }
      ]
  },
  testMatch: [
      "**/test/**/*.test.(ts|js)"
  ],
  testEnvironment: "node"
};