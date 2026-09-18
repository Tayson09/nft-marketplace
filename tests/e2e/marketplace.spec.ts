import {
  test,
  expect,
  type Page,
} from '@playwright/test'

const login = async (
  page: Page,
) => {
  await page.goto('/login')

  await expect(
    page.getByLabel('E-mail'),
  ).toBeVisible({
    timeout: 10000,
  })

  await expect(
    page.getByLabel('Senha'),
  ).toBeVisible({
    timeout: 10000,
  })

  await page
    .getByLabel('E-mail')
    .fill(
      'collector@nova.test',
    )

  await page
    .getByLabel('Senha')
    .fill('nova123')

  await page
    .getByRole('button', {
      name: 'Entrar',
      exact: true,
    })
    .click()

  await expect(
    page,
  ).toHaveURL(
    /\/(?:\?page=1)?$/,
    {
      timeout: 10000,
    },
  )
}

const buyNft = async (
  page: Page,
) => {
  const button =
    page.getByRole('button', {
      name: 'Comprar agora',
      exact: true,
    })

  await expect(
    button,
  ).toBeVisible({
    timeout: 10000,
  })

  await expect(
    button,
  ).toBeEnabled({
    timeout: 10000,
  })

  await button.scrollIntoViewIfNeeded()

  const projectName =
    test.info().project.name

  if (
    projectName ===
    'chromium-mobile'
  ) {
    await button.tap()
  } else {
    await button.click()
  }
}

test.beforeEach(
  async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: 'NFT EM DESTAQUE',
        exact: true,
      }),
    ).toBeVisible({
      timeout: 10000,
    })
  },
)

test(
  'search, filters, sorting and direct detail',
  async ({ page }) => {
    const searchInput =
      page.getByPlaceholder(
        /busque por nome ou coleção/i,
      )

    await searchInput.fill('Ape')

    await searchInput.press(
      'Enter',
    )

    await expect(
      page,
    ).toHaveURL(
      /search=Ape/i,
    )

    await expect(
      page
        .getByRole('link', {
          name: 'Emerald Ape #652',
          exact: true,
        })
        .first(),
    ).toBeVisible()

    await page
      .getByRole('button', {
        name: 'Collectible',
        exact: true,
      })
      .click()

    await expect(
      page,
    ).toHaveURL(
      /category=Collectible/i,
    )

    await page
      .getByLabel('Ordenação')
      .selectOption(
        'price-desc',
      )

    await expect(
      page,
    ).toHaveURL(
      /sort=price-desc/i,
    )

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
  },
)

test(
  'login and cart persistence in flow',
  async ({ page }) => {
    await login(page)

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

    await buyNft(page)

    await expect(
      page,
    ).toHaveURL(
      /\/cart(?:\?.*)?$/,
      {
        timeout: 10000,
      },
    )

    await expect(
  page.locator(
    'a[href="/nft/nft-1"]',
  ),

  
).toBeVisible({
  timeout: 10000,
})

    await expect(
      page.getByText(
        'Resumo do pedido',
        {
          exact: true,
        },
      ),
    ).toBeVisible({
      timeout: 10000,
    })

    await page.reload()

   await expect(
    page
        .getByRole('link', {
        name: 'Emerald Ape #652',
        exact: true,
        })
        .first(),
    ).toBeVisible({
    timeout: 10000,
    })

    await expect(
      page.getByText(
        'Resumo do pedido',
        {
          exact: true,
        },
      ),
    ).toBeVisible({
      timeout: 10000,
    })
  },
)

test(
  'full purchase confirms only after simulated decision',
  async ({ page }) => {
    await login(page)

    await page.goto(
      '/nft/nft-1',
    )

    await buyNft(page)

    await expect(
      page,
    ).toHaveURL(
      /\/cart(?:\?.*)?$/,
      {
        timeout: 10000,
      },
    )

    await page
      .getByRole('button', {
        name: /continuar para pagamento/i,
      })
      .click()

    await expect(
      page,
    ).toHaveURL(
      /\/checkout$/,
      {
        timeout: 10000,
      },
    )

    await page
      .getByRole('button', {
        name: /revisar pedido/i,
      })
      .click()

    await expect(
      page.getByRole('heading', {
        name: 'Revisão do pedido',
        exact: true,
      }),
    ).toBeVisible({
      timeout: 10000,
    })

    await page
      .getByRole('button', {
        name: /confirmar pedido/i,
      })
      .click()

    await expect(
      page,
    ).toHaveURL(
      /\/order\//,
      {
        timeout: 10000,
      },
    )

    await expect(
      page.getByRole('heading', {
        name: 'Pedido em processamento',
        exact: true,
      }),
    ).toBeVisible({
      timeout: 10000,
    })

    await page
      .getByRole('button', {
        name: /confirmar pagamento/i,
      })
      .click()

    await expect(
      page.getByRole('heading', {
        name: 'Confirmação de Pedido',
        exact: true,
      }),
    ).toBeVisible({
      timeout: 10000,
    })
  },
)

test(
  'payment refusal preserves failure state',
  async ({ page }) => {
    await login(page)

    await page.goto(
      '/nft/nft-2',
    )

    await expect(
      page.getByRole('heading', {
        name: 'Violet Monkey #407',
        exact: true,
      }),
    ).toBeVisible({
      timeout: 10000,
    })

    await buyNft(page)

    await page
      .getByRole('button', {
        name: /continuar para pagamento/i,
      })
      .click()

    await expect(
      page,
    ).toHaveURL(
      /\/checkout$/,
      {
        timeout: 10000,
      },
    )

    await page
      .getByRole('button', {
        name: /revisar pedido/i,
      })
      .click()

    await page
      .getByRole('button', {
        name: /confirmar pedido/i,
      })
      .click()

    await expect(
      page.getByRole('heading', {
        name: 'Pedido em processamento',
        exact: true,
      }),
    ).toBeVisible({
      timeout: 10000,
    })

    await page
      .getByRole('button', {
        name: /recusar pagamento/i,
      })
      .click()

    await expect(
      page.getByRole('heading', {
        name: 'Pagamento recusado',
        exact: true,
      }),
    ).toBeVisible({
      timeout: 10000,
    })

    await expect(
      page.getByText(
        /os itens continuam preservados/i,
      ),
    ).toBeVisible({
      timeout: 10000,
    })
  },
)

test(
  'profile and wallets',
  async ({ page }) => {
    await login(page)

    await page.goto(
      '/profile',
      {
        waitUntil:
          'domcontentloaded',
      },
    )

    await expect(
      page,
    ).toHaveURL(
      /\/profile$/,
      {
        timeout: 10000,
      },
    )

    await expect(
        page.getByLabel('Nome'),
        ).toBeVisible({
        timeout: 10000,
        })

        await expect(
        page.getByLabel('Avatar URL'),
        ).toBeVisible({
        timeout: 10000,
        })

    await page
      .getByLabel('Nome')
      .fill(
        'Alex Updated',
      )

    await page
      .getByRole('button', {
        name: /salvar alterações/i,
      })
      .click()

    await expect(
      page.getByText(
        'Dados salvos.',
        {
          exact: true,
        },
      ),
    ).toBeVisible({
      timeout: 10000,
    })

    await page.goto(
      '/wallets',
      {
        waitUntil:
          'domcontentloaded',
      },
    )

    await expect(
      page,
    ).toHaveURL(
      /\/wallets$/,
      {
        timeout: 10000,
      },
    )

    await expect(
      page.getByRole('heading', {
        name: 'Carteiras',
        exact: true,
      }),
    ).toBeVisible({
      timeout: 10000,
    })

    await expect(
      page.getByText(
        'Carteira principal',
        {
          exact: true,
        },
      ),
    ).toBeVisible({
      timeout: 10000,
    })
  },
)