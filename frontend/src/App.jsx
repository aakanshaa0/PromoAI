import { CssBaseline } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Promote from './pages/Promote'
import Dashboard from './pages/Dashboard'
import RedditCallback from './components/RedditCallback'

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promote" element={<Promote />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/reddit/callback" element={<RedditCallback />} />
      </Routes>
    </>
  )
}

export default App