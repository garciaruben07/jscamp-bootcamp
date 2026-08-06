import { useNavigate, useLocation } from 'react-router'

/* Misma interfaz que devolvía el hook artesanal, con React Router por dentro */
export function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()

  return {
    currentPath: location.pathname,
    navigateTo: navigate,
  }
}
