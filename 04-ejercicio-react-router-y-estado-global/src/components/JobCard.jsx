import { useState } from 'react'
import { Link } from './Link'

export function JobCard({ job }) {
  const [isApplied, setIsApplied] = useState(false)

  const handleApplyClick = () => {
    setIsApplied(true)
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? 'Aplicado' : 'Aplicar'

  const isFavorite = false

  return (
    <article
      className="job-listing-card"
      data-modalidad={job.data.modalidad}
      data-nivel={job.data.nivel}
      data-technology={job.data.technology}
    >
      <div>
        <h3>
          <Link href={`/job/${job.id}`}>{job.titulo}</Link>
        </h3>
        <small>
          {job.empresa} | {job.ubicacion}
        </small>
        <p>{job.descripcion}</p>
      </div>
      <div className="job-listing-card-actions">
        <button className={buttonClasses} onClick={handleApplyClick}>
          {buttonText}
        </button>

        <button type="button" className="button-favorite" aria-pressed={isFavorite}>
          {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        </button>
      </div>
    </article>
  )
}
