import {
  test,
  expect,
} from '@playwright/test'

test(
  'socket scenario surfaces changed NFT price',
  async ({ page }) => {
    await page.goto(
      '/nft/nft-1',
    )

    await expect(
      page.getByRole('heading', {
        name: 'Emerald Ape #652',
        exact: true,
      }),
    ).toBeVisible({
      timeout: 10000,
    })

    await expect(
      page.getByText(
        '1.49 ETH',
        {
          exact: true,
        },
      ),
    ).toBeVisible({
      timeout: 10000,
    })

    // Em E2E o mock espera
    // aproximadamente 1.5s.
    // O polling evita depender
    // de um intervalo fixo.
    await expect
      .poll(
        async () =>
          page.getByText(
            '1.79 ETH',
            {
              exact: true,
            },
          ).count(),
        {
          timeout: 10000,
          intervals: [
            250,
            500,
            1000,
          ],
        },
      )
      .toBeGreaterThan(0)
  },
)