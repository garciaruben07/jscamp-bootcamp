import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import snarkdown from 'snarkdown'

function MarkdownContent({ markdown }) {
  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: snarkdown(markdown) }} />
}

export function DetailPage() {
  const { id } = useParams()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs/${id}`)
        if (!response.ok) throw new Error(`No se pudo cargar el empleo (${response.status})`)

        const json = await response.json()
        setJob(json)
      } catch (error) {
        console.error('Error fetching job:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  return (
    <main style={{ maxWidth: '48rem', width: '100%', margin: '0 auto', padding: '1rem' }}>
      {loading && <p>Cargando empleo...</p>}

      {error && <p>No se pudo cargar el empleo. Vuelve a intentarlo más tarde.</p>}

      {job && (
        <article className="job-detail">
          <title>{`${job.titulo} - DevJobs`}</title>

          <h1>{job.titulo}</h1>
          <small>
            {job.empresa} <span aria-hidden="true">|</span> {job.ubicacion}
          </small>

          <section>
            <h2>Descripción</h2>
            <MarkdownContent markdown={job.content.description} />
          </section>

          <section>
            <h2>Responsabilidades</h2>
            <MarkdownContent markdown={job.content.responsibilities} />
          </section>

          <section>
            <h2>Requisitos</h2>
            <MarkdownContent markdown={job.content.requirements} />
          </section>

          <section>
            <h2>Sobre la empresa</h2>
            <MarkdownContent markdown={job.content.about} />
          </section>
        </article>
      )}
    </main>
  )
}
