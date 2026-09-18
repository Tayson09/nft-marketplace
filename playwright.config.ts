import {
  defineConfig,
  devices,
} from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',

  timeout: 30000,

  expect: {
    timeout: 10000,
  },

  // O mock possui estado em memória.
  // Um worker evita concorrência entre
  // browsers alterando o mesmo cenário.
  fullyParallel: false,

  workers: 1,

  forbidOnly: Boolean(
    process.env.CI,
  ),

  retries: process.env.CI
    ? 1
    : 0,

  reporter: [
    [
      'html',
      {
        open: 'never',
      },
    ],
    ['list'],
  ],

  use: {
    baseURL:
      'http://127.0.0.1:5173',

    trace:
      'on-first-retry',

    video:
      'retain-on-failure',

    screenshot:
      'only-on-failure',

    actionTimeout: 15000,

    navigationTimeout: 15000,
  },

  webServer: {
    command:
      'npm run dev -- --host 127.0.0.1',

    url:
      'http://127.0.0.1:5173',

    reuseExistingServer:
      false,

    timeout: 120000,

    env: {
      ...process.env,
      VITE_E2E: 'true',
      VITE_SOCKET_URL: 'http://127.0.0.1:5173',
    },
  },

  projects: [
    {
      name: 'chromium-desktop',

      use: {
        ...devices[
          'Desktop Chrome'
        ],

        browserName:
          'chromium',

        viewport: {
          width: 1440,
          height: 900,
        },

        isMobile: false,

        hasTouch: false,
      },
    },

    {
      name: 'chromium-mobile',

      use: {
        ...devices[
          'iPhone 13'
        ],

        browserName:
          'chromium',

        viewport: {
          width: 390,
          height: 844,
        },

        isMobile: true,

        hasTouch: true,
      },
    },
  ],
})