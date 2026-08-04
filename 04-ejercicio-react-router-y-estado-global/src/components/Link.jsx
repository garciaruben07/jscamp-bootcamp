import { Link as RouterLink } from 'react-router'

/* Mantiene la interfaz de siempre (href) pero navega con el Link de React Router */
export function Link({ href, children, ...restOfProps }) {
  return (
    <RouterLink to={href} {...restOfProps}>
      {children}
    </RouterLink>
  )
}
