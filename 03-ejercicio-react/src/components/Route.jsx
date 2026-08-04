import { usePath } from '../hooks/usePath'

export function Route({ path, component }) {
  const currentPath = usePath()

  if (currentPath !== path) return null

  /* En mayúscula para poder usarlo como etiqueta JSX */
  const Component = component
  return <Component />
}
