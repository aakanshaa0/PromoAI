import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Stack } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import AccountTreeSharpIcon from '@mui/icons-material/AccountTreeSharp'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import PersonIcon from '@mui/icons-material/Person'
import { useContext, useState } from 'react'
import { ThemeToggleContext } from '../main'
import { AuthContext } from '../main'
import SignupLoginModal from './SignupLoginModal'

export default function Navbar() {
  const { toggleTheme, mode } = useContext(ThemeToggleContext)
  const { isLoggedIn, logout } = useContext(AuthContext)
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <AppBar position="static" elevation={0} sx={{
      background: '#0A0A0A',
      color: '#FFFFFF',
      borderBottom: 'none',
      boxShadow: 'none',
      '& .MuiAppBar-root': {
        boxShadow: 'none',
      },
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 72 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <AccountTreeSharpIcon sx={{ 
              fontSize: 36, 
              color: '#00FFFF', 
              mr: 1
            }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                fontFamily: 'Orbitron, monospace',
                fontWeight: 800,
                letterSpacing: '.1rem',
                color: '#00FFFF',
                textDecoration: 'none',
                fontSize: '1.6rem',
                textShadow: 'none',
                '&:hover': {
                  color: '#00FFFF',
                }
              }}
            >
              PromoAI
            </Typography>
          </Box>
          {/* Nav Links */}
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
            <Button
              href="#how-it-works"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'none',
                borderRadius: 2,
                px: 2,
                border: '1px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(0,255,255,0.1)',
                  border: '1px solid rgba(0,255,255,0.5)',
                  boxShadow: '0 0 15px rgba(0,255,255,0.3)',
                  color: '#00FFFF',
                },
              }}
            >
              How It Works
            </Button>
            <Button
              href="#subreddits"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'none',
                borderRadius: 2,
                px: 2,
                border: '1px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(0,255,255,0.1)',
                  border: '1px solid rgba(0,255,255,0.5)',
                  boxShadow: '0 0 15px rgba(0,255,255,0.3)',
                  color: '#00FFFF',
                },
              }}
            >
              Subreddits
            </Button>
            <Button
              href="#testimonials"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'none',
                borderRadius: 2,
                px: 2,
                border: '1px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(0,255,255,0.1)',
                  border: '1px solid rgba(0,255,255,0.5)',
                  boxShadow: '0 0 15px rgba(0,255,255,0.3)',
                  color: '#00FFFF',
                },
              }}
            >
              Testimonials
            </Button>
            <Button
              href="#contact"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'none',
                borderRadius: 2,
                px: 2,
                border: '1px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(0,255,255,0.1)',
                  border: '1px solid rgba(0,255,255,0.5)',
                  boxShadow: '0 0 15px rgba(0,255,255,0.3)',
                  color: '#00FFFF',
                },
              }}
            >
              Contact
            </Button>
          </Stack>
          {/* Theme Toggle & Register Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton 
              sx={{ 
                mr: 1,
                color: '#00FFFF',
                border: '1px solid rgba(0,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(0,255,255,0.1)',
                  border: '1px solid rgba(0,255,255,0.8)',
                  boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                }
              }} 
              onClick={toggleTheme} 
              color="inherit"
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {isLoggedIn ? (
              <>
                <IconButton
                  component={Link}
                  to="/dashboard"
                  sx={{
                    mr: 1,
                    color: '#00FF00',
                    border: '1px solid rgba(0,255,0,0.3)',
                    '&:hover': {
                      background: 'rgba(0,255,0,0.1)',
                      border: '1px solid rgba(0,255,0,0.8)',
                      boxShadow: '0 0 15px rgba(0,255,0,0.5)',
                    }
                  }}
                >
                  <PersonIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  onClick={logout}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 3,
                    py: 1.2,
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: '#FF00FF',
                    borderColor: '#FF00FF',
                    background: 'none',
                    textShadow: '0 0 5px #FF00FF',
                    boxShadow: '0 0 10px rgba(255,0,255,0.3)',
                    '&:hover': {
                      background: 'rgba(255,0,255,0.1)',
                      borderColor: '#FF00FF',
                      boxShadow: '0 0 20px rgba(255,0,255,0.6)',
                      textShadow: '0 0 8px #FF00FF',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
            <Button
              variant="outlined"
                  onClick={() => setModalOpen(true)}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                fontWeight: 700,
                fontSize: '1.05rem',
                color: '#00FFFF',
                borderColor: '#00FFFF',
                ml: 1,
                background: 'none',
                textShadow: '0 0 5px #00FFFF',
                boxShadow: '0 0 10px rgba(0,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(0,255,255,0.1)',
                  borderColor: '#00FFFF',
                  boxShadow: '0 0 20px rgba(0,255,255,0.6)',
                  textShadow: '0 0 8px #00FFFF',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
                  onClick={() => setModalOpen(true)}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                fontWeight: 700,
                fontSize: '1.05rem',
                background: 'linear-gradient(45deg, #00FFFF, #0080FF)',
                color: '#FFFFFF',
                border: '2px solid #00FFFF',
                textShadow: '0 0 5px #00FFFF',
                boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                ml: 1,
                '&:hover': {
                  background: 'linear-gradient(45deg, #0080FF, #00FFFF)',
                  boxShadow: '0 0 25px rgba(0,255,255,0.8)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Signup
            </Button>
              </>
            )}
            <SignupLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}