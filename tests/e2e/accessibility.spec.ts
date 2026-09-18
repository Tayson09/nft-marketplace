import {
  test,
  expect,
} from '@playwright/test'

test(
  'keyboard navigation reaches primary controls',
  async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: /nft em destaque/i,
      }),
    ).toBeVisible()

    await page.keyboard.press('Tab')

    const focused =
      page.locator(':focus')

    await expect(
      focused,
    ).toBeVisible()

    await page.keyboard.press(
      'Tab',
    )

    await expect(
      page.locator(':focus'),
    ).toBeVisible()
  },
)