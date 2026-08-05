import { useState, useEffect } from 'react'

/* pushState no emite ningún evento: lo avisamos nosotros con uno propio */
const NAVIGATION_EVENT = 'pushstate'

export function navigate(href) {
  window.history.pushState({}, '', href)
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname)

    window.addEventListener(NAVIGATION_EVENT, updatePath)
    window.addEventListener('popstate', updatePath)

    return () => {
      window.removeEventListener(NAVIGATION_EVENT, updatePath)
      window.removeEventListener('popstate', updatePath)
    }
  }, [])

  return path
}
