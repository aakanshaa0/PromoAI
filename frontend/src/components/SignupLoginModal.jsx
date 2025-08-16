import React, { useState, useContext } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Alert,
  IconButton,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { AuthContext } from '../main'

export default function SignupLoginModal({ open, onClose }) {
  const [mode, setMode] = useState('login') 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useContext(AuthContext)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Authentication failed')
      login(data.token)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }



  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError(null)
  }

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1200,
          backdropFilter: 'blur(10px)',
          background: 'rgba(0,0,0,0.7)',
          transition: 'backdrop-filter 0.3s',
        }} />
      )}
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
        PaperProps={{
          sx: {
            background: '#1A1A1A',
            color: '#FFFFFF',
            borderRadius: '8px',
            border: '2px solid #00FFFF',
            boxShadow: '0 0 30px rgba(0,255,255,0.5)',
            '&:hover': {
              boxShadow: '0 0 40px rgba(0,255,255,0.7)',
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          fontWeight: 700, 
          color: '#00FFFF', 
          background: 'transparent',
          textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF'
        }}>
          {mode === 'login' ? 'Login to PromoAI' : 'Sign up for PromoAI'}
          <IconButton 
            onClick={onClose} 
            size="small" 
            sx={{ 
              color: '#FF00FF',
              border: '1px solid rgba(255,0,255,0.3)',
              '&:hover': {
                background: 'rgba(255,0,255,0.1)',
                border: '1px solid rgba(255,0,255,0.8)',
                boxShadow: '0 0 15px rgba(255,0,255,0.5)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} component="form" onSubmit={handleAuth}>
            {error && <Alert severity="error" sx={{
              background: 'rgba(255,0,0,0.1)',
              border: '1px solid rgba(255,0,0,0.5)',
              color: '#FF0000',
              '& .MuiAlert-icon': {
                color: '#FF0000'
              }
            }}>{error}</Alert>}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
              InputLabelProps={{ style: { color: '#00FFFF' } }}
              sx={{
                input: { 
                  color: '#FFFFFF', 
                  background: '#0A0A0A',
                  borderRadius: '4px'
                },
                label: { 
                  color: '#00FFFF',
                  textShadow: '0 0 5px #00FFFF'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { 
                    borderColor: 'rgba(0,255,255,0.3)',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': { 
                    borderColor: '#00FFFF',
                    boxShadow: '0 0 10px rgba(0,255,255,0.3)'
                  },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#00FFFF',
                    boxShadow: '0 0 15px rgba(0,255,255,0.5)'
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ style: { color: '#00FFFF' } }}
              sx={{
                input: { 
                  color: '#FFFFFF', 
                  background: '#0A0A0A',
                  borderRadius: '4px'
                },
                label: { 
                  color: '#00FFFF',
                  textShadow: '0 0 5px #00FFFF'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { 
                    borderColor: 'rgba(0,255,255,0.3)',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': { 
                    borderColor: '#00FFFF',
                    boxShadow: '0 0 10px rgba(0,255,255,0.3)'
                  },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#00FFFF',
                    boxShadow: '0 0 15px rgba(0,255,255,0.5)'
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ 
                fontWeight: 700, 
                py: 1.2, 
                borderRadius: 2, 
                background: 'linear-gradient(45deg, #00FFFF, #0080FF)', 
                color: '#FFFFFF',
                border: '2px solid #00FFFF',
                textShadow: '0 0 5px #00FFFF',
                boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0080FF, #00FFFF)',
                  boxShadow: '0 0 25px rgba(0,255,255,0.8)',
                  transform: 'translateY(-2px)',
                }
              }}
              fullWidth
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </Button>
          </Stack>
          <Divider sx={{ 
            my: 2, 
            borderColor: 'rgba(0,255,255,0.3)',
            '&::before, &::after': {
              borderColor: 'rgba(0,255,255,0.3)'
            }
          }}>or</Divider>

          <Stack direction="row" justifyContent="center" alignItems="center" mt={2}>
            <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </Typography>
            <Button 
              onClick={handleSwitchMode} 
              sx={{ 
                ml: 1, 
                textTransform: 'none', 
                fontWeight: 700, 
                color: '#FF00FF',
                textShadow: '0 0 5px #FF00FF',
                '&:hover': {
                  textShadow: '0 0 8px #FF00FF',
                  background: 'rgba(255,0,255,0.1)',
                }
              }}
            >
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ pb: 2, background: 'transparent' }}>
          <Button 
            onClick={onClose} 
            color="secondary" 
            sx={{ 
              fontWeight: 600, 
              color: '#00FFFF',
              textShadow: '0 0 5px #00FFFF',
              '&:hover': {
                textShadow: '0 0 8px #00FFFF',
                background: 'rgba(0,255,255,0.1)',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
} 