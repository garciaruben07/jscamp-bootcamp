import { Link as RouterLink } from 'react-router'

/* Mantiene la interfaz de siempre (href) pero navega con el Link de React Router.
   El spread va primero para que un to recibido por props no pueda pisar al href. */
export function Link({ href, children, ...restOfProps }) {
  return (
    <RouterLink {...restOfProps} to={href}>
      {children}
    </RouterLink>
  )
}
