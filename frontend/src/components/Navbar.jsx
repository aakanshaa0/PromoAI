import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Stack, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import AccountTreeSharpIcon from '@mui/icons-material/AccountTreeSharp'
import PersonIcon from '@mui/icons-material/Person'
import MenuIcon from '@mui/icons-material/Menu'
import { useContext, useState } from 'react'
import { AuthContext } from '../main'
import SignupLoginModal from './SignupLoginModal'

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext)
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('login')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleOpenModal = (mode) => {
    setModalMode(mode)
    setModalOpen(true)
  }

  return (
    <AppBar position="sticky" elevation={0} sx={{
      background: '#0A0A0A',
      color: '#FFFFFF',
      borderBottom: 'none',
      boxShadow: 'none',
      '& .MuiAppBar-root': { boxShadow: 'none' },
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 2, md: 4 } }}>
            <AccountTreeSharpIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: '#00FFFF', mr: 1 }} />
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
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                textShadow: 'none',
                '&:hover': { color: '#00FFFF' }
              }}
            >
              PromoAI
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Stack direction="row" spacing={2}>
              <Button
                href="/#how-it-works"
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
                href="/#platforms"
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
                Platforms
              </Button>
              <Button
                href="/#testimonials"
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
                href="/#faq"
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
                FAQ
              </Button>
            </Stack>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-end' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ p: 1 }}
            >
              <MenuIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: { xs: '85vw', sm: 280 },
                  background: '#0A0A0A',
                  height: '100%',
                  borderLeft: '1px solid rgba(0,255,255,0.3)',
                }
              }}
            >
              <List sx={{ 
                width: '100%', 
                background: '#0A0A0A', 
                height: '100%',
                pt: 2
              }}>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton 
                    component="a" 
                    href="/#how-it-works" 
                    onClick={() => setDrawerOpen(false)}
                    sx={{ 
                      mx: 2, 
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(0,255,255,0.1)',
                        border: '1px solid rgba(0,255,255,0.3)',
                      }
                    }}
                  >
                    <ListItemText 
                      primary="How It Works" 
                      sx={{ 
                        color: '#00FFFF', 
                        textAlign: 'center',
                        '& .MuiTypography-root': {
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 600
                        }
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton 
                    component="a" 
                    href="/#platforms" 
                    onClick={() => setDrawerOpen(false)}
                    sx={{ 
                      mx: 2, 
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(0,255,255,0.1)',
                        border: '1px solid rgba(0,255,255,0.3)',
                      }
                    }}
                  >
                    <ListItemText 
                      primary="Platforms" 
                      sx={{ 
                        color: '#00FFFF', 
                        textAlign: 'center',
                        '& .MuiTypography-root': {
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 600
                        }
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton 
                    component="a" 
                    href="/#testimonials" 
                    onClick={() => setDrawerOpen(false)}
                    sx={{ 
                      mx: 2, 
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(0,255,255,0.1)',
                        border: '1px solid rgba(0,255,255,0.3)',
                      }
                    }}
                  >
                    <ListItemText 
                      primary="Testimonials" 
                      sx={{ 
                        color: '#00FFFF', 
                        textAlign: 'center',
                        '& .MuiTypography-root': {
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 600
                        }
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton 
                    component="a" 
                    href="/#faq" 
                    onClick={() => setDrawerOpen(false)}
                    sx={{ 
                      mx: 2, 
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(0,255,255,0.1)',
                        border: '1px solid rgba(0,255,255,0.3)',
                      }
                    }}
                  >
                    <ListItemText 
                      primary="FAQ" 
                      sx={{ 
                        color: '#00FFFF', 
                        textAlign: 'center',
                        '& .MuiTypography-root': {
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 600
                        }
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
                <Divider sx={{ my: 2, borderColor: 'rgba(0,255,255,0.3)' }} />
                <ListItem disablePadding>
                  {isLoggedIn ? (
                    <ListItemButton 
                      component={Link} 
                      to="/dashboard" 
                      onClick={() => setDrawerOpen(false)}
                      sx={{ 
                        mx: 2, 
                        borderRadius: 2,
                        background: 'rgba(0,255,0,0.1)',
                        border: '1px solid rgba(0,255,0,0.3)',
                        '&:hover': {
                          background: 'rgba(0,255,0,0.2)',
                          border: '1px solid rgba(0,255,0,0.6)',
                        }
                      }}
                    >
                      <ListItemText 
                        primary="Dashboard" 
                        sx={{ 
                          color: '#00FF00', 
                          textAlign: 'center',
                          '& .MuiTypography-root': {
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            fontWeight: 600
                          }
                        }} 
                      />
                    </ListItemButton>
                  ) : (
                    <ListItemButton 
                      onClick={() => { setModalOpen(true); setDrawerOpen(false) }}
                      sx={{ 
                        mx: 2, 
                        borderRadius: 2,
                        background: 'rgba(0,255,255,0.1)',
                        border: '1px solid rgba(0,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(0,255,255,0.2)',
                          border: '1px solid rgba(0,255,255,0.6)',
                        }
                      }}
                    >
                      <ListItemText 
                        primary="Login / Signup" 
                        sx={{ 
                          color: '#00FFFF', 
                          textAlign: 'center',
                          '& .MuiTypography-root': {
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            fontWeight: 600
                          }
                        }} 
                      />
                    </ListItemButton>
                  )}
                </ListItem>
              </List>
            </Drawer>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2 }}>
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
                  onClick={() => handleOpenModal('login')}
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
                  onClick={() => handleOpenModal('signup')}
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
            <SignupLoginModal open={modalOpen} onClose={() => setModalOpen(false)} initialMode={modalMode} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
