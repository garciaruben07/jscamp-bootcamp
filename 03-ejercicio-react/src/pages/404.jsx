import { Link } from '../components/Link'

export function NotFoundPage() {
  return (
    <main>
      <section>
        <h1>404</h1>
        <p>La página que buscas no existe o ha cambiado de dirección.</p>
        <Link href="/">Volver al inicio</Link>
      </section>
    </main>
  )
}
