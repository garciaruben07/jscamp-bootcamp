import jobs from '../data.json'
import { JobListings } from './JobListings'
import { Pagination } from './Pagination'

const JOBS_PER_PAGE = 5

function filterJobs(allJobs, { search, technology, location, level }) {
  const searchText = search.trim().toLowerCase()

  return allJobs.filter((job) => {
    const matchesSearch = job.titulo.toLowerCase().includes(searchText)
    const matchesTechnology = technology === '' || job.data.technology === technology
    const matchesLocation = location === '' || job.data.modalidad === location
    const matchesLevel = level === '' || job.data.nivel === level

    return matchesSearch && matchesTechnology && matchesLocation && matchesLevel
  })
}

export function SearchResultsSection({ query, onPageChange }) {
  const filteredJobs = filterJobs(jobs, query)
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)

  const pageStart = (query.page - 1) * JOBS_PER_PAGE
  const pageJobs = filteredJobs.slice(pageStart, pageStart + JOBS_PER_PAGE)

  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

      <JobListings jobs={pageJobs} />

      {filteredJobs.length > 0 && (
        <Pagination totalPages={totalPages} currentPage={query.page} onPageChange={onPageChange} />
      )}
    </section>
  )
}
