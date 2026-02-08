import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Loader from './components/common/Loader'

// Preload projects data
let projectsCache = null
let projectsPromise = null

const preloadProjects = () => {
  if (!projectsPromise) {
    projectsPromise = fetch('/assets/projects.json?v=1.4.1')
      .then(response => response.json())
      .then(data => {
        projectsCache = data
        return data
      })
      .catch(error => {
        console.error('Error preloading projects:', error)
        return []
      })
  }
  return projectsPromise
}

export const getProjectsCache = () => projectsCache
export const getProjectsPromise = () => projectsPromise

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const CalculatorSuite = lazy(() => import('./pages/CalculatorSuite'))
const Graphing = lazy(() => import('./pages/Graphing'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Youtube = lazy(() => import('./pages/Youtube'))

function App() {
  // Preload projects data on mount
  useEffect(() => {
    preloadProjects()
  }, [])
  
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="calculator" element={<CalculatorSuite />} />
          <Route path="graphing" element={<Graphing />} />
          <Route path="login" element={<Login />} />
          <Route path="youtube" element={<Youtube />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
