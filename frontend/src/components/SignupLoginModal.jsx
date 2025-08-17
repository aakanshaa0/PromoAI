import React, { useState, useContext, useEffect, useRef } from 'react'
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
  Box,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { AuthContext } from '../main'

export default function SignupLoginModal({ open, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode) 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [captchaLoaded, setCaptchaLoaded] = useState(false)
  const captchaRef = useRef(null)
  const { login } = useContext(AuthContext)

  // Update mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode)
    setError(null)
    setCaptchaToken('')
  }, [initialMode])

  // Initialize reCAPTCHA
  useEffect(() => {
    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement('script')
      // Use the correct script URL format without render parameter
      script.src = 'https://www.google.com/recaptcha/api.js'
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log('reCAPTCHA script loaded successfully')
        setCaptchaLoaded(true)
      }
      script.onerror = (error) => {
        console.error('Failed to load reCAPTCHA script:', error)
        setError('Failed to load CAPTCHA. Please check your internet connection and refresh the page.')
      }
      document.head.appendChild(script)
    } else {
      console.log('reCAPTCHA already loaded')
      setCaptchaLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (open && mode === 'signup' && captchaLoaded && captchaRef.current) {
      try {
        if (captchaRef.current.innerHTML) {
          captchaRef.current.innerHTML = ''
        }
        
        window.grecaptcha.render(captchaRef.current, {
          sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LfZJakrAAAAAF_oazf9-KDo-uTVPj0GoyhL-RHH', // Use your actual key
          callback: (token) => {
            console.log('CAPTCHA completed:', token)
            setCaptchaToken(token)
            setError(null)
          },
          'expired-callback': () => {
            console.log('CAPTCHA expired')
            setCaptchaToken('')
            setError('CAPTCHA expired. Please complete it again.')
          },
          'error-callback': () => {
            console.log('CAPTCHA error')
            setCaptchaToken('')
            setError('CAPTCHA error occurred. Please try again.')
          },
          size: 'normal',
          theme: 'dark'
        })
      } catch (err) {
        console.error('Error rendering CAPTCHA:', err)
        setError('Failed to load CAPTCHA. Please refresh the page.')
      }
    }
  }, [open, mode, captchaLoaded])

  const handleAuth = async (e) => {
    e.preventDefault()
    
    if (mode === 'signup' && !captchaToken) {
      setError('Please complete the CAPTCHA');
      return;
    }
    
    setLoading(true)
    setError(null)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const body = mode === 'signup' 
        ? { email, password, captchaToken }
        : { email, password }
        
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Authentication failed')
      
      login(data.token)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCaptchaChange = (token) => {
    console.log('CAPTCHA completed:', token);
    setCaptchaToken(token);
  };

  const handleCaptchaExpired = () => {
    console.log('CAPTCHA expired');
    setCaptchaToken('');
  };

  const handleCaptchaError = () => {
    console.log('CAPTCHA error');
    setCaptchaToken('');
    setError('CAPTCHA error occurred. Please try again.');
  };

  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError(null)
    setCaptchaToken('')
  }

  const refreshCaptcha = () => {
    if (captchaRef.current && window.grecaptcha) {
      try {
        window.grecaptcha.reset()
        setCaptchaToken('')
        setError(null)
      } catch (err) {
        console.error('Error resetting CAPTCHA:', err)
        if (captchaRef.current.innerHTML) {
          captchaRef.current.innerHTML = ''
        }
        setTimeout(() => {
          if (open && mode === 'signup' && captchaRef.current) {
            window.grecaptcha.render(captchaRef.current, {
              sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LfZJakrAAAAAF_oazf9-KDo-uTVPj0GoyhL-RHH', // Use your actual key
              callback: (token) => {
                setCaptchaToken(token)
                setError(null)
              },
              'expired-callback': () => setCaptchaToken(''),
              'error-callback': () => setError('CAPTCHA error occurred. Please try again.'),
              size: 'normal',
              theme: 'dark'
            })
          }
        }, 100)
      }
    }
  }

  const retryLoadingCaptcha = () => {
    console.log('Retrying to load CAPTCHA...')
    setCaptchaLoaded(false)
    setError(null)
    
    const existingScript = document.querySelector('script[src*="recaptcha"]')
    if (existingScript) {
      existingScript.remove()
    }
    
    delete window.grecaptcha
    
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('reCAPTCHA script loaded successfully on retry')
      setCaptchaLoaded(true)
    }
    script.onerror = (error) => {
      console.error('Failed to load reCAPTCHA script on retry:', error)
      setError('Failed to load CAPTCHA. Please check your internet connection.')
    }
    document.head.appendChild(script)
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
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: '#1A1A1A',
            color: '#FFFFFF',
            borderRadius: '8px',
            border: '2px solid #00FFFF',
            boxShadow: '0 0 30px rgba(0,255,255,0.5)',
            margin: { xs: 2, sm: 'auto' },
            width: { xs: 'calc(100vw - 32px)', sm: 'auto' },
            maxWidth: { xs: 'none', sm: '600px', md: '700px', lg: '800px' },
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
          textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF',
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 }
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
        <DialogContent sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
          <Stack spacing={3} component="form" onSubmit={handleAuth}>
            {error && <Alert severity="error" sx={{
              background: 'rgba(255,0,0,0.1)',
              border: '1px solid rgba(255,0,255,0.5)',
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
                  borderRadius: '4px',
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                },
                label: { 
                  color: '#00FFFF',
                  textShadow: '0 0 5px #00FFFF',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
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
                  borderRadius: '4px',
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                },
                label: { 
                  color: '#00FFFF',
                  textShadow: '0 0 5px #00FFFF',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
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
            
            {mode === 'signup' && (
              <Box sx={{ 
                mt: 2, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid rgba(0,255,255,0.5)',
                borderRadius: '8px',
                p: { xs: 2, sm: 3 },
                background: 'rgba(0,0,0,0.2)',
                position: 'relative',
                width: '100%'
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00FFFF', 
                    mb: 2, 
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  Complete the CAPTCHA to continue
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  minHeight: '80px',
                  alignItems: 'center',
                  mb: 2,
                  width: '100%'
                }}>
                  {!captchaLoaded ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      color: '#00FFFF'
                    }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Loading CAPTCHA...
                      </Typography>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        border: '2px solid #00FFFF',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    </Box>
                  ) : (
                    <div ref={captchaRef} />
                  )}
                </Box>
                
                {captchaToken && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#00FF00', 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    CAPTCHA completed successfully
                  </Typography>
                )}
                
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    size="small"
                    onClick={() => {
                      setCaptchaToken('test-token');
                      setError(null);
                    }}
                    sx={{
                      mt: 1,
                      color: '#FFFF00',
                      border: '1px solid rgba(255,255,0,0.5)',
                      '&:hover': {
                        background: 'rgba(255,255,0,0.1)',
                        border: '1px solid rgba(255,255,0,0.8)',
                      }
                    }}
                  >
                    🧪 Dev: Skip CAPTCHA
                  </Button>
                )}
                
                <Button
                  size="small"
                  onClick={refreshCaptcha}
                  sx={{
                    mt: 1,
                    color: '#00FFFF',
                    border: '1px solid rgba(0,255,255,0.5)',
                    '&:hover': {
                      background: 'rgba(0,255,255,0.1)',
                      border: '1px solid rgba(0,255,255,0.8)',
                    }
                  }}
                >
                  Refresh CAPTCHA
                </Button>
                
                {!captchaLoaded && (
                  <Button
                    size="small"
                    onClick={retryLoadingCaptcha}
                    sx={{
                      mt: 1,
                      color: '#FF6B6B',
                      border: '1px solid rgba(255,107,107,0.5)',
                      '&:hover': {
                        background: 'rgba(255,107,107,0.1)',
                        border: '1px solid rgba(255,107,107,0.8)',
                      }
                    }}
                  >
                    Retry Loading CAPTCHA
                  </Button>
                )}
                
                {error && error.includes('CAPTCHA') && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#FF6B6B', 
                      mt: 2, 
                      textAlign: 'center',
                      fontSize: '0.8rem'
                    }}
                  >
                    💡 If CAPTCHA doesn't load, try refreshing the page or check your internet connection
                  </Typography>
                )}
              </Box>
            )}
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ 
                fontWeight: 700, 
                py: { xs: 1.2, sm: 1.5, md: 1.8 }, 
                px: { xs: 2, sm: 3, md: 4 },
                borderRadius: 2, 
                background: 'linear-gradient(45deg, #00FFFF, #0080FF)', 
                color: '#FFFFFF',
                border: '2px solid #00FFFF',
                textShadow: '0 0 5px #00FFFF',
                boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
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
            my: { xs: 2, sm: 3 }, 
            borderColor: 'rgba(0,255,255,0.3)',
            '&::before, &::after': {
              borderColor: 'rgba(0,255,255,0.3)'
            }
          }}>or</Divider>

          <Stack direction="row" justifyContent="center" alignItems="center" mt={2} sx={{ gap: 1 }}>
            <Typography variant="body2" sx={{ 
              color: '#FFFFFF',
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}>
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
                fontSize: { xs: '0.9rem', sm: '1rem' },
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