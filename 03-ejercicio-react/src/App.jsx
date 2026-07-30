import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { SearchFormSection } from './components/SearchFormSection'
import { SearchResultsSection } from './components/SearchResultsSection'
import { Footer } from './components/Footer'

const SEARCH_DEBOUNCE_MS = 300

/* La URL es el estado inicial: una búsqueda compartida o recargada se restaura */
function getInitialQuery() {
  const params = new URLSearchParams(window.location.search)

  return {
    search: params.get('search') || '',
    technology: params.get('technology') || '',
    location: params.get('location') || '',
    level: params.get('level') || '',
    page: 1,
  }
}

function updateUrl(query) {
  const params = new URLSearchParams()

  if (query.search !== '') params.set('search', query.search)
  if (query.technology !== '') params.set('technology', query.technology)
  if (query.location !== '') params.set('location', query.location)
  if (query.level !== '') params.set('level', query.level)

  const queryString = params.toString()
  const url =
    queryString === '' ? window.location.pathname : `${window.location.pathname}?${queryString}`

  window.history.replaceState(null, '', url)
}

function App() {
  const [query, setQuery] = useState(getInitialQuery)
  const [searchInput, setSearchInput] = useState(query.search)

  /* El texto tecleado se aplica a los filtros solo tras una pausa (debounce) */
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((current) =>
        current.search === searchInput ? current : { ...current, search: searchInput, page: 1 }
      )
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchInput])

  /* Cada búsqueda aplicada se refleja en la URL */
  useEffect(() => {
    updateUrl(query)
  }, [query])

  const handleFilterChange = (name, value) => {
    setQuery((current) => ({ ...current, [name]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setQuery((current) => ({ ...current, page }))
  }

  return (
    <>
      <Header />
      <main>
        <SearchFormSection
          searchInput={searchInput}
          filters={query}
          onSearchInputChange={setSearchInput}
          onFilterChange={handleFilterChange}
        />
        <SearchResultsSection query={query} onPageChange={handlePageChange} />
      </main>
      <Footer />
    </>
  )
}

export default App
