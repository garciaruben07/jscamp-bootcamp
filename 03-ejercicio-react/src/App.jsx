import { usePath } from './hooks/usePath'
import { Route } from './components/Route'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/Home'
import { SearchPage } from './pages/Search'
import { NotFoundPage } from './pages/404'

const KNOWN_PATHS = ['/', '/search']

function App() {
  const currentPath = usePath()

  return (
    <>
      <Header />

      <Route path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />
      {!KNOWN_PATHS.includes(currentPath) && <NotFoundPage />}

      <Footer />
    </>
  )
}

export default App
