module.exports = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$",
  transformIgnorePatterns: [
    "node_modules"
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'md',
  ],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    }
  }
};
