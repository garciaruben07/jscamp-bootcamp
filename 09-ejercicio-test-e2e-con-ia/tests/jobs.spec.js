// @ts-check
import { expect, test } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

/* El título de cada tarjeta es el enlace al detalle. Se localiza por rol y no por la
   estructura del HTML, para que un cambio de maquetación no se lleve por delante los tests */
function enlaceDelPrimerResultado(page) {
  return page.getByRole('article').first().getByRole('heading', { level: 3 }).getByRole('link')
}

/* El artículo del detalle es el único con un encabezado de nivel 1. Filtrar por él, en vez
   de por su clase CSS, resuelve además la ambigüedad del instante en el que la lista de
   resultados todavía no se ha desmontado y sus botones "Aplicar" siguen en el DOM */
function articuloDelDetalle(page) {
  return page.getByRole('article').filter({ has: page.getByRole('heading', { level: 1 }) })
}

/* Devuelve el data attribute de todas las tarjetas, una vez la lista ya está filtrada.
   Al aplicar un filtro la lista se repinta varias veces, y evaluateAll no reintenta: leerla
   suelta la pilla a medias y devuelve los resultados anteriores, o ninguno. Por eso se
   reintenta la lectura completa hasta que todas las tarjetas traen el valor esperado */
async function atributosDeLosResultados(page, atributo, esperado) {
  let valores = []

  await expect
    .poll(async () => {
      valores = await page
        .getByRole('article')
        .evaluateAll((articles, attr) => articles.map((article) => article.getAttribute(attr)), atributo)

      return valores.length > 0 && valores.every((valor) => valor === esperado)
    })
    .toBe(true)

  return valores
}

/* Deja la página de búsqueda lista, con resultados ya pintados */
async function irABusqueda(page, query = '') {
  await page.goto(`${BASE_URL}/search${query}`)
  await expect(page.getByRole('article').first()).toBeVisible()
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

    const resultados = page.getByRole('article')

    /* not.toHaveCount reintenta hasta que se cumple. Un count() suelto lee el DOM una sola
       vez y puede caer justo en el instante en que la lista se está repintando */
    await expect(resultados).not.toHaveCount(0)
    await expect(resultados.first()).toBeVisible()
  })
})

test.describe('Flujo completo de aplicación', () => {
  test('busca, entra al detalle, inicia sesión y aplica', async ({ page }) => {
    await page.goto(BASE_URL)

    await page.getByRole('searchbox').fill('JavaScript')
    await page.getByRole('button', { name: 'Buscar' }).click()

    const primerResultado = enlaceDelPrimerResultado(page)

    await expect(primerResultado).toBeVisible()

    const titulo = await primerResultado.textContent()
    await primerResultado.click()

    /* Esperamos a la URL del detalle: si no, los botones del listado siguen en pantalla */
    await expect(page).toHaveURL(/\/job\//)
    await expect(page.getByRole('heading', { level: 1, name: titulo ?? '' })).toBeVisible()

    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible()

    const detalle = articuloDelDetalle(page)
    await detalle.getByRole('button', { name: 'Aplicar', exact: true }).click()

    await expect(detalle.getByRole('button', { name: 'Aplicado' })).toBeVisible()
  })
})

test.describe('Filtros', () => {
  test('filtra por ubicación remota', async ({ page }) => {
    await irABusqueda(page)

    await page.getByRole('combobox', { name: 'Ubicación' }).selectOption('remoto')

    await expect(page).toHaveURL(/type=remoto/)

    /* Cada tarjeta guarda su modalidad en un data attribute */
    const modalidades = await atributosDeLosResultados(page, 'data-modalidad', 'remoto')

    expect(modalidades.length).toBeGreaterThan(0)
  })

  test('filtra por nivel senior', async ({ page }) => {
    await irABusqueda(page)

    await page.getByRole('combobox', { name: 'Nivel de experiencia' }).selectOption('senior')

    await expect(page).toHaveURL(/level=senior/)

    const niveles = await atributosDeLosResultados(page, 'data-nivel', 'senior')

    expect(niveles.length).toBeGreaterThan(0)
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

    const tituloPrimeraPagina = await enlaceDelPrimerResultado(page).textContent()

    const paginacion = page.getByRole('navigation', { name: 'Paginación de los resultados' })
    await paginacion.getByRole('link', { name: 'Página siguiente' }).click()

    await expect(page).toHaveURL(/page=2/)
    await expect(page.getByRole('article').first()).toBeVisible()

    await expect(enlaceDelPrimerResultado(page)).not.toHaveText(tituloPrimeraPagina ?? '')
  })
})

test.describe('Detalle de empleo', () => {
  test('muestra el detalle del empleo al pulsar en un resultado', async ({ page }) => {
    await irABusqueda(page)

    const primerResultado = enlaceDelPrimerResultado(page)
    const titulo = await primerResultado.textContent()

    await primerResultado.click()

    await expect(page).toHaveURL(/\/job\//)
    await expect(page.getByRole('heading', { level: 1, name: titulo ?? '' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Descripción' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Requisitos' })).toBeVisible()
  })

  test('permite aplicar a la oferta desde su detalle', async ({ page }) => {
    await irABusqueda(page)

    await enlaceDelPrimerResultado(page).click()
    await expect(page).toHaveURL(/\/job\//)

    const detalle = articuloDelDetalle(page)
    await expect(detalle).toBeVisible()

    const botonAplicar = detalle.getByRole('button', { name: 'Aplicar', exact: true })

    await expect(botonAplicar).toBeVisible()
    await botonAplicar.click()

    await expect(detalle.getByRole('button', { name: 'Aplicado' })).toBeVisible()
    await expect(detalle.getByRole('button', { name: 'Aplicado' })).toBeDisabled()
  })
})
