module.exports = {
  setupFiles: [
    "./jest.setup.js"
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
  }
};
