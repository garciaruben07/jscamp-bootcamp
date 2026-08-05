// @ts-check
import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

/* Deja la página de búsqueda lista, con resultados ya pintados */
async function irABusqueda(page, query = '') {
  await page.goto(`${BASE_URL}/search${query}`)
  await expect(page.locator('article').first()).toBeVisible()
}

test.describe('Navegación básica', () => {
  test('la página principal carga y muestra el buscador', async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page.getByRole('searchbox')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Buscar' })).toBeVisible()
  })
})

test.describe('Búsqueda de empleos', () => {
  test('busca por tecnología desde la página principal y muestra resultados', async ({ page }) => {
    await page.goto(BASE_URL)

    await page.getByRole('searchbox').fill('React')
    await page.getByRole('button', { name: 'Buscar' }).click()

    /* La búsqueda viaja en la URL, así que la propia navegación ya es una comprobación */
    await expect(page).toHaveURL(/\/search\?.*text=React/)

    const resultados = page.locator('article')

    await expect(resultados.first()).toBeVisible()
    expect(await resultados.count()).toBeGreaterThan(0)
  })
})

test.describe('Flujo completo de aplicación', () => {
  test('busca, entra al detalle, inicia sesión y aplica', async ({ page }) => {
    await page.goto(BASE_URL)

    await page.getByRole('searchbox').fill('JavaScript')
    await page.getByRole('button', { name: 'Buscar' }).click()

    const primerResultado = page.locator('article h3 a').first()
    await expect(primerResultado).toBeVisible()

    const titulo = await primerResultado.textContent()
    await primerResultado.click()

    /* Esperamos a la URL del detalle: si no, los botones del listado siguen en pantalla */
    await expect(page).toHaveURL(/\/job\//)
    await expect(page.getByRole('heading', { level: 1, name: titulo ?? '' })).toBeVisible()

    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible()

    const detalle = page.locator('article.job-detail')
    await detalle.getByRole('button', { name: 'Aplicar', exact: true }).click()

    await expect(detalle.getByRole('button', { name: 'Aplicado' })).toBeVisible()
  })
})

test.describe('Filtros', () => {
  test('filtra por ubicación remota', async ({ page }) => {
    await irABusqueda(page)

    await page.locator('#filter-location').selectOption('remoto')

    await expect(page).toHaveURL(/type=remoto/)
    await expect(page.locator('article').first()).toBeVisible()

    /* Cada tarjeta guarda su modalidad en un data attribute */
    const modalidades = await page.locator('article').evaluateAll((articles) =>
      articles.map((article) => article.getAttribute('data-modalidad'))
    )

    expect(modalidades.length).toBeGreaterThan(0)
    expect(modalidades.every((modalidad) => modalidad === 'remoto')).toBe(true)
  })

  test('filtra por nivel senior', async ({ page }) => {
    await irABusqueda(page)

    await page.locator('#filter-experience-level').selectOption('senior')

    await expect(page).toHaveURL(/level=senior/)
    await expect(page.locator('article').first()).toBeVisible()

    const niveles = await page.locator('article').evaluateAll((articles) =>
      articles.map((article) => article.getAttribute('data-nivel'))
    )

    expect(niveles.length).toBeGreaterThan(0)
    expect(niveles.every((nivel) => nivel === 'senior')).toBe(true)
  })
})

test.describe('Paginación', () => {
  test('muestra la paginación cuando hay más resultados de los que caben en una página', async ({
    page,
  }) => {
    await irABusqueda(page)

    const paginacion = page.getByRole('navigation', { name: 'Paginación de los resultados' })

    await expect(paginacion).toBeVisible()
    await expect(paginacion.getByRole('link', { name: '2', exact: true })).toBeVisible()
    await expect(paginacion.getByRole('link', { name: 'Página siguiente' })).toBeVisible()
  })

  test('al pasar a la siguiente página cambian los resultados', async ({ page }) => {
    await irABusqueda(page)

    const tituloPrimeraPagina = await page.locator('article h3').first().textContent()

    const paginacion = page.getByRole('navigation', { name: 'Paginación de los resultados' })
    await paginacion.getByRole('link', { name: 'Página siguiente' }).click()

    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('article').first()).toBeVisible()

    await expect(page.locator('article h3').first()).not.toHaveText(tituloPrimeraPagina ?? '')
  })
})

test.describe('Detalle de empleo', () => {
  test('muestra el detalle del empleo al pulsar en un resultado', async ({ page }) => {
    await irABusqueda(page)

    const primerResultado = page.locator('article h3 a').first()
    const titulo = await primerResultado.textContent()

    await primerResultado.click()

    await expect(page).toHaveURL(/\/job\//)
    await expect(page.getByRole('heading', { level: 1, name: titulo ?? '' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Descripción' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Requisitos' })).toBeVisible()
  })

  test('permite aplicar a la oferta desde su detalle', async ({ page }) => {
    await irABusqueda(page)

    await page.locator('article h3 a').first().click()
    await expect(page).toHaveURL(/\/job\//)

    /* Buscamos dentro del artículo del detalle: la lista tarda un instante en desmontarse
       y sus botones "Aplicar" harían ambigua la búsqueda en toda la página */
    const detalle = page.locator('article.job-detail')
    await expect(detalle).toBeVisible()

    const botonAplicar = detalle.getByRole('button', { name: 'Aplicar', exact: true })

    await expect(botonAplicar).toBeVisible()
    await botonAplicar.click()

    await expect(detalle.getByRole('button', { name: 'Aplicado' })).toBeVisible()
    await expect(detalle.getByRole('button', { name: 'Aplicado' })).toBeDisabled()
  })
})
