import React, { useMemo, useState, createContext, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

export const ThemeToggleContext = createContext({ toggleTheme: () => {}, mode: 'dark' })
export const AuthContext = createContext({ isLoggedIn: false, user: null, login: () => {}, logout: () => {} })

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#00FFFF' }, // Cyan neon
    secondary: { main: '#FF00FF' }, // Magenta neon
    accent: { main: '#00FF00' }, // Green neon
    background: { default: '#0A0A0A', paper: '#1A1A1A' }, // Dark cyber background
    text: { 
      primary: '#FFFFFF',
      secondary: '#00FFFF'
    },
    neon: {
      cyan: '#00FFFF',
      magenta: '#FF00FF',
      green: '#00FF00',
      yellow: '#FFFF00',
      orange: '#FF6600',
      pink: '#FF1493',
      blue: '#0080FF',
      purple: '#8000FF'
    }
  },
  typography: {
    fontFamily: '"Orbitron", "Rajdhani", "Inter", sans-serif',
    h1: { 
      fontWeight: 900
    },
    h2: { 
      fontWeight: 800
    },
    h4: { 
      fontWeight: 700
    },
    h6: { 
      fontWeight: 600
    },
  },
  shape: { borderRadius: 8 },
  shadows: [
    'none',
    '0px 2px 8px rgba(0,255,255,0.3)',
    '0px 4px 16px rgba(0,255,255,0.4)',
    '0px 8px 24px rgba(0,255,255,0.5)',
    ...Array(21).fill('0px 12px 32px rgba(0,255,255,0.6)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 700,
          boxShadow: '0 0 10px rgba(0,255,255,0.5)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0,255,255,0.8)',
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A1A',
          border: '1px solid rgba(0,255,255,0.3)',
          boxShadow: '0 0 15px rgba(0,255,255,0.2)',
        }
      }
    }
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00FFFF' }, // Cyan neon
    secondary: { main: '#FF00FF' }, // Magenta neon
    accent: { main: '#00FF00' }, // Green neon
    background: { default: '#0A0A0A', paper: '#1A1A1A' }, // Dark cyber background
    text: { 
      primary: '#FFFFFF',
      secondary: '#00FFFF'
    },
    neon: {
      cyan: '#00FFFF',
      magenta: '#FF00FF',
      green: '#00FF00',
      yellow: '#FFFF00',
      orange: '#FF6600',
      pink: '#FF1493',
      blue: '#0080FF',
      purple: '#8000FF'
    }
  },
  typography: {
    fontFamily: '"Orbitron", "Rajdhani", "Inter", sans-serif',
    h1: { 
      fontWeight: 900
    },
    h2: { 
      fontWeight: 800
    },
    h4: { 
      fontWeight: 700
    },
    h6: { 
      fontWeight: 600
    },
  },
  shape: { borderRadius: 8 },
  shadows: [
    'none',
    '0px 2px 8px rgba(0,255,255,0.3)',
    '0px 4px 16px rgba(0,255,255,0.4)',
    '0px 8px 24px rgba(0,255,255,0.5)',
    ...Array(21).fill('0px 12px 32px rgba(0,255,255,0.6)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 700,
          boxShadow: '0 0 10px rgba(0,255,255,0.5)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0,255,255,0.8)',
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A1A',
          border: '1px solid rgba(0,255,255,0.3)',
          boxShadow: '0 0 15px rgba(0,255,255,0.2)',
        }
      }
    }
  }
})

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setIsLoggedIn(true)
    setUser(userData || null)
  }
  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function Main() {
  const [mode, setMode] = useState('dark')
  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode])
  const toggleTheme = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
  <React.StrictMode>
      <ThemeToggleContext.Provider value={{ toggleTheme, mode }}>
      <AuthProvider>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
      </AuthProvider>
      </ThemeToggleContext.Provider>
  </React.StrictMode>
)
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)