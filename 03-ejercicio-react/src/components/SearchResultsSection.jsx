import { useState } from 'react'
import jobs from '../data.json'
import { JobListings } from './JobListings'
import { Pagination } from './Pagination'

/* Fijo como en el HTML de partida; en la sexta parte se calculará según los resultados */
const TOTAL_PAGES = 5

export function SearchResultsSection() {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

      <JobListings jobs={jobs} />

      <Pagination
        totalPages={TOTAL_PAGES}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </section>
  )
}
