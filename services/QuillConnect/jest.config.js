module.exports = {
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  testPathIgnorePatterns: [
    'data.ts$'
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};
