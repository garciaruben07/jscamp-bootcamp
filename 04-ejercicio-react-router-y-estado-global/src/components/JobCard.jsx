import { useState } from 'react'
import { Link } from './Link'
import { useFavoritesStore } from '../store/favoritesStore'

export function JobCard({ job }) {
  const [isApplied, setIsApplied] = useState(false)

  /* Suscripción al dato justo: solo re-renderiza si cambia el favorito de esta oferta */
  const isFavorite = useFavoritesStore((state) => state.favorites.includes(job.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  const handleApplyClick = () => {
    setIsApplied(true)
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? 'Aplicado' : 'Aplicar'

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
          {job.empresa} <span aria-hidden="true">|</span> {job.ubicacion}
        </small>
        <p>{job.descripcion}</p>
      </div>

      <div className="job-listing-card-actions">
        <button className={buttonClasses} onClick={handleApplyClick}>
          {buttonText}
        </button>

        <button
          type="button"
          className="button-favorite"
          aria-pressed={isFavorite}
          onClick={() => toggleFavorite(job.id)}
        >
          {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        </button>
      </div>
    </article>
  )
}
