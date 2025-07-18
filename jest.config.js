// @ts-check

const esmPackages = [
  "ccount",
  "character-entities-html4",
  "comma-separated-tokens",
  "d3-*",
  "d3",
  "devlop",
  "echarts",
  "hast.*",
  "html-void-elements",
  "is-absolute-url",
  "jose",
  "property-information",
  "rehype-external-links",
  "screenfull",
  "space-separated-tokens",
  "stringify-entities",
  "unist-util-visit-parents",
  "unist-util-visit",
  "vfile-location",
  "vfile-message",
  "vfile",
  "web-namespaces",
  "zrender",
  "zwitch",
];

const baseConfig = {
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/frontend/test/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/frontend/test/__mocks__/fileMock.js",
    "^cljs/(.*)$": "<rootDir>/target/cljs_dev/$1",
    "^d3-(.*)$": "<rootDir>/node_modules/d3-$1/dist/d3-$1",
    "react-markdown":
      "<rootDir>/node_modules/react-markdown/react-markdown.min.js",
    "\\.svg\\?(component|source)":
      "<rootDir>/frontend/test/__mocks__/svgMock.jsx",
    "csv-parse/browser/esm/sync":
      "<rootDir>/node_modules/csv-parse/dist/cjs/sync",
    "csv-stringify/browser/esm/sync":
      "<rootDir>/node_modules/csv-stringify/dist/cjs/sync",
    /**
     * SDK components import root SDK folder (`embedding-sdk`) that contains the ee plugins.
     * This isn't a problem in the core app because we seem to not import to entry file directly
     * for any component under tests.
     */
    "sdk-ee-plugins": "<rootDir>/frontend/src/metabase/lib/noop.js",
    /**
     * SDK iframe embedding imports the embedding sdk and its components.
     * We want to exclude the SDK from the main app's bundle to reduce the bundle size.
     */
    "sdk-iframe-embedding-ee-plugins":
      "<rootDir>/frontend/src/metabase/lib/noop.js",
    "ee-plugins": "<rootDir>/frontend/src/metabase/lib/noop.js",
    /**
     * Imports which are only applicable to the embedding sdk.
     * As we use SDK components in new iframe embedding, we need to import them here.
     **/
    "sdk-specific-imports": "<rootDir>/frontend/src/metabase/lib/noop.js",
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(${esmPackages.join("|")})/)`,
  ],
  testPathIgnorePatterns: [
    "<rootDir>/frontend/.*/.*.tz.unit.spec.{js,jsx,ts,tsx}",
    "<rootDir>/release/.*",
  ],
  testMatch: [
    "<rootDir>/**/*.unit.spec.js",
    "<rootDir>/**/*.unit.spec.{js,jsx,ts,tsx}",
  ],
  modulePaths: [
    "<rootDir>/frontend/test",
    "<rootDir>/frontend/src",
    "<rootDir>/enterprise/frontend/src",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/target/cljs_release/.*",
    "<rootDir>/resources/frontend_client",
    "<rootDir>/.*/__mocks__",
  ],
  setupFiles: [
    "<rootDir>/frontend/test/jest-setup.js",
    "<rootDir>/frontend/test/metabase-bootstrap.js",
    "<rootDir>/frontend/test/register-visualizations.js",
  ],
  setupFilesAfterEnv: ["<rootDir>/frontend/test/jest-setup-env.js"],
  globals: {
    ga: {},
  },
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "frontend/src/**/*.{js,jsx,ts,tsx}",
    "enterprise/frontend/src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/**/*.styled.{js,jsx,ts,tsx}",
    "!<rootDir>/**/*.story.{js,jsx,ts,tsx}",
    "!<rootDir>/**/*.info.{js,jsx,ts,tsx}",
    "!<rootDir>/**/*.unit.spec.{js,jsx,ts,tsx}",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/frontend/src/metabase/visualizations/lib/errors.js",
    "/target/cljs_dev/",
    "/target/cljs_release/",
    "/frontend/test/",
  ],
  testEnvironment: "jest-environment-jsdom",
};

/** @type {import('jest').Config} */
const config = {
  reporters: ["default", "jest-junit"],
  coverageReporters: ["html", "lcov"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  testTimeout: 30000,
  projects: [
    {
      ...baseConfig,
      displayName: "sdk",

      testMatch: [
        "<rootDir>/enterprise/frontend/src/embedding-sdk/**/*.unit.spec.{js,jsx,ts,tsx}",
      ],

      setupFiles: [
        ...baseConfig.setupFiles,
        "<rootDir>/enterprise/frontend/src/embedding-sdk/jest/setup-env.js",
      ],

      setupFilesAfterEnv: [
        ...baseConfig.setupFilesAfterEnv,
        "<rootDir>/enterprise/frontend/src/embedding-sdk/jest/console-restrictions.js",
      ],
    },
    {
      ...baseConfig,
      displayName: "core",
      testPathIgnorePatterns: [
        ...(baseConfig.testPathIgnorePatterns || []),
        "<rootDir>/enterprise/frontend/src/embedding-sdk/",
      ],
    },
  ],
};

// eslint-disable-next-line import/no-commonjs
module.exports = config;