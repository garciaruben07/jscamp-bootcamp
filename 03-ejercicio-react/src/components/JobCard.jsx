import { useState } from 'react'

export function JobCard({ job }) {
  const [isApplied, setIsApplied] = useState(false)

  const handleApplyClick = () => {
    setIsApplied(true)
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? '¡Aplicado!' : 'Aplicar'
  const buttonLabel = isApplied
    ? `Ya has aplicado a la oferta de ${job.titulo}`
    : `Aplicar a la oferta de ${job.titulo} en ${job.empresa}`

  return (
    <article
      className="job-listing-card"
      data-modalidad={job.data.modalidad}
      data-nivel={job.data.nivel}
      data-technology={job.data.technology}
    >
      <div>
        <h3>{job.titulo}</h3>
        <small>
          {job.empresa} <span aria-hidden="true">|</span> {job.ubicacion}
        </small>
        <p>{job.descripcion}</p>
      </div>
      <button
        className={buttonClasses}
        onClick={handleApplyClick}
        disabled={isApplied}
        aria-label={buttonLabel}
      >
        {buttonText}
      </button>
    </article>
  )
}
