import { NavLink } from 'react-router'
import { Link } from './Link'
import { useAuthStore } from '../store/authStore'

/* NavLink expone isActive en className: marcamos la ruta en la que estamos */
const navLinkClass = ({ isActive }) => (isActive ? 'is-active' : '')

export function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ color: 'white' }}>
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          DevJobs
        </h1>
      </Link>

      <nav>
        <NavLink to="/" className={navLinkClass} end>
          Inicio
        </NavLink>

        <NavLink to="/search" className={navLinkClass}>
          Empleos
        </NavLink>
      </nav>

      <button type="button" className="button-login" onClick={isLoggedIn ? logout : login}>
        {isLoggedIn ? 'Cerrar sesión' : 'Iniciar sesión'}
      </button>
    </header>
  )
}
