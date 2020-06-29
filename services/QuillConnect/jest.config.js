module.exports = {
  setupFiles: [
    "./app/setupTests.ts"
  ],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    'data.ts$'
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ]
};
