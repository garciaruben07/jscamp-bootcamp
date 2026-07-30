import jobs from '../data.json'

export function SearchResultsSection() {
  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

      {jobs.length === 0 ? (
        <p>No se han encontrado empleos que coincidan con los criterios de búsqueda.</p>
      ) : (
        <ul className="jobs-listings">
          {jobs.map((job) => (
            <li key={job.id}>
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
                <button className="button-apply-job">Aplicar</button>
              </article>
            </li>
          ))}
        </ul>
      )}

      <nav className="pagination">
        <a href="#" aria-label="Ir a la página anterior" title="Página anterior">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 6l-6 6l6 6" />
          </svg>
        </a>
        <a data-page="1" href="#">
          1
        </a>
        <a data-page="2" href="#">
          2
        </a>
        <a data-page="3" href="#">
          3
        </a>
        <a data-page="4" href="#">
          4
        </a>
        <a data-page="5" href="#">
          5
        </a>
        <a href="#" aria-label="Ir a la página siguiente" title="Página siguiente">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </a>
      </nav>
    </section>
  )
}
