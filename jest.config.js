module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@domain/(.*)': '<rootDir>/src/app/domain/$1',
    '@features/(.*)': '<rootDir>/src/app/features/$1',
    '@shared/(.*)': '<rootDir>/src/app/shared/$1',
    '@layout/(.*)': '<rootDir>/src/app/layout/$1',
    '@env/(.*)': '<rootDir>/src/environments/$1',
    '@assets/(.*)': '<rootDir>/src/assets/$1'
  },
  transformIgnorePatterns: ['node_modules/(?!.*\.mjs$)'],
  transform: {
    '^.+\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\.html$'
      },
    ],
  },
};