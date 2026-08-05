import { navigate } from '../hooks/usePath'

export function Link({ href, target, ...props }) {
  const handleClick = (event) => {
    const isMainClick = event.button === 0
    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    const isSelfTarget = !target || target === '_self'

    /* Solo interceptamos la navegación normal; cmd+click, etc. siguen abriendo pestañas */
    if (isMainClick && !isModifiedClick && isSelfTarget) {
      event.preventDefault()
      navigate(href)
    }
  }

  // La desestructuración de las props es necesario que estén al inicio para que no se sobrescriban los valores de href, target y onClick, en cas de que el usuario los coloque por medio del componente padre.
  return <a {...props} href={href} target={target} onClick={handleClick}  />
}
