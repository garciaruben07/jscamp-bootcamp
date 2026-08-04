import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'

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
        fallback={
          <main>
            <p>Cargando página...</p>
          </main>
        }
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

export default App
