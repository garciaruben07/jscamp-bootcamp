import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Pagination } from '../components/Pagination.jsx'
import { SearchFormSection } from '../components/SearchFormSection.jsx'
import { JobListings } from '../components/JobListings.jsx'

const RESULTS_PER_PAGE = 4

/* Escribe el parámetro si tiene valor y lo borra si está vacío, para no ensuciar la URL */
function setParam(params, key, value) {
  if (value) {
    params.set(key, value)
  } else {
    params.delete(key)
  }
}

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  /* La URL es la única fuente de verdad: los filtros se derivan de ella en cada render */
  const textToFilter = searchParams.get('text') || ''
  const technology = searchParams.get('technology') || ''
  const location = searchParams.get('type') || ''
  const experienceLevel = searchParams.get('level') || ''

  const page = Number(searchParams.get('page'))
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)

        const params = new URLSearchParams()
        if (textToFilter) params.append('text', textToFilter)
        if (technology) params.append('technology', technology)
        if (location) params.append('type', location)
        if (experienceLevel) params.append('level', experienceLevel)

        const offset = (currentPage - 1) * RESULTS_PER_PAGE
        params.append('limit', RESULTS_PER_PAGE)
        params.append('offset', offset)

        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${params.toString()}`)
        const json = await response.json()

        setJobs(json.data)
        setTotal(json.total)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [textToFilter, technology, location, experienceLevel, currentPage])

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)

  /* Cambiar de página crea entrada de historial (push): atrás vuelve a la página anterior */
  const handlePageChange = (page) => {
    setSearchParams((params) => {
      const next = new URLSearchParams(params)
      setParam(next, 'page', page > 1 ? page : '')
      return next
    })
  }

  /* Ajustar filtros reescribe la entrada actual (replace): atrás no repasa cada ajuste */
  const handleSearch = (filters) => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        setParam(next, 'technology', filters.technology)
        setParam(next, 'type', filters.location)
        setParam(next, 'level', filters.experienceLevel)
        next.delete('page')
        return next
      },
      { replace: true }
    )
  }

  const handleTextFilter = (newTextToFilter) => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        setParam(next, 'text', newTextToFilter)
        next.delete('page')
        return next
      },
      { replace: true }
    )
  }

  return {
    loading,
    jobs,
    total,
    totalPages,
    currentPage,
    textToFilter,
    filters: { technology, location, experienceLevel },
    handlePageChange,
    handleSearch,
    handleTextFilter,
  }
}

export function SearchPage() {
  const {
    jobs,
    total,
    loading,
    totalPages,
    currentPage,
    textToFilter,
    filters,
    handlePageChange,
    handleSearch,
    handleTextFilter,
  } = useFilters()

  const title = loading
    ? `Cargando... - DevJobs`
    : `Resultados: ${total}, Página ${currentPage} - DevJobs`

  return (
    <main>
      <title>{title}</title>
      <meta name="description" content="Explora miles de oportunidades laborales en el sector tecnológico. Encuentra tu próximo empleo en DevJobs." />

      <SearchFormSection
        initialText={textToFilter}
        initialFilters={filters}
        onSearch={handleSearch}
        onTextFilter={handleTextFilter}
      />

      <section>
        <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

        {
          loading ? <p>Cargando empleos...</p> : <JobListings jobs={jobs} />
        }
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </section>
    </main>
  )
}
