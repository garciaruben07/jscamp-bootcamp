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

  return <a href={href} target={target} onClick={handleClick} {...props} />
}
