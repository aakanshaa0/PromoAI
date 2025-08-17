import { CssBaseline } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Promote from './pages/Promote'
import Dashboard from './pages/Dashboard'
import { Analytics } from "@vercel/analytics"

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promote" element={<Promote />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
      <Analytics /> 
    </>
  )
}

export default App