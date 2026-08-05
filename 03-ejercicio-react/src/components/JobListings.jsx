import { JobCard } from './JobCard'

export function JobListings({ jobs }) {
  if (jobs.length === 0) {
    return <p>No se han encontrado empleos que coincidan con los criterios de búsqueda.</p>
  }

  return (
    <ul className="jobs-listings">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobCard job={job} />
        </li>
      ))}
    </ul>
  )
}
