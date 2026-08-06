import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'

import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'

/* lazy espera un export default: adaptamos el export nombrado de cada página */
const HomePage = lazy(() =>
  import('./pages/Home.jsx').then((module) => ({ default: module.HomePage }))
)
const SearchPage = lazy(() =>
  import('./pages/Search.jsx').then((module) => ({ default: module.SearchPage }))
)
const DetailPage = lazy(() =>
  import('./pages/Detail.jsx').then((module) => ({ default: module.DetailPage }))
)
const NotFoundPage = lazy(() =>
  import('./pages/404.jsx').then((module) => ({ default: module.NotFoundPage }))
)

function App() {
  return (
    <>
      <Header />
      <Suspense
        fallback={<ViewAppFallback />}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/job/:id" element={<DetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}

/* Podemos crear un componente chico para no ocupar el fallback en la Prop de Suspense. Así queda mas limpio (y nos permite hacer un fallback más grande sin que se vea grande el componente App) */
const ViewAppFallback = () => {
  return <main>
    <p>Cargando página...</p>
  </main>
}

export default App
