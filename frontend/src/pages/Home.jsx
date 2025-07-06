import { Box, Button, Container, Grid, Typography, Paper, Fade, Divider, IconButton } from '@mui/material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import heroImage from '../assets/hero-image.png'
import RedditIcon from '@mui/icons-material/Reddit'
import Chip from '@mui/material/Chip'
import { useState, useEffect } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Avatar from '@mui/material/Avatar'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import StarIcon from '@mui/icons-material/Star'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useTheme, useMediaQuery } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../main'
import SignupLoginModal from '../components/SignupLoginModal'

export default function Home() {
  const [showHero, setShowHero] = useState(false)
  useEffect(() => { setShowHero(true) }, [])
  const theme = useTheme();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: (theme) => theme.palette.background.default }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        {/* Hero Section */}
        <Box sx={{
          minHeight: '100vh',
          position: 'relative',
          bgcolor: (theme) => theme.palette.background.default,
          display: 'block',
        }}>
          <Container maxWidth="lg">
            <Fade in={showHero} timeout={900}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: { xs: 'column-reverse', md: 'row' }, minHeight: { xs: '60vh', md: '70vh' }, gap: { xs: 4, md: 8 } }}>
                {/*Left Side of Hero Section*/}
                <Box sx={{ 
                  flex: { xs: '1', md: '0 0 45%' }, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: { xs: 'center', md: 'flex-start' }, 
                  textAlign: { xs: 'center', md: 'left' },
                  zIndex: 2
                }}>
                  <Typography variant="h1" component="h1" gutterBottom sx={{ 
                    fontWeight: 900, 
                    fontSize: { xs: '2.3rem', sm: '3rem', md: '3.5rem' }, 
                    lineHeight: 1.1,
                    color: '#FFFFFF'
                  }}>
                    Let AI Promote For You<br />
                    <Box component="span" sx={{ 
                      color: '#00FFFF'
                    }}>Using PromoAI</Box>
            </Typography>
                  <Typography variant="h5" sx={{ 
                    mb: 4, 
                    color: '#00FFFF', 
                    fontSize: { xs: '1.05rem', md: '1.2rem' }
                  }}>
                  Smart promotion that works so you don't have to.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                      px: 5,
                      py: 1.5,
                      fontSize: '1.25rem',
                      textTransform: 'none',
                      borderRadius: '8px',
                      background: 'linear-gradient(45deg, #00FFFF, #0080FF)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      border: '2px solid #00FFFF',
                      boxShadow: '0 0 20px rgba(0,255,255,0.6)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 0 30px rgba(0,255,255,0.9)',
                        background: 'linear-gradient(45deg, #0080FF, #00FFFF)',
                      },
                    }}
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate('/promote')
                    } else {
                      setModalOpen(true)
                    }
                  }}
                  >
                    Promote 
            </Button>
                </Box>

                {/*Right Side of Hero Section*/}
                <Box sx={{ 
                  flex: { xs: '1', md: '0 0 55%' }, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  position: 'relative', 
                  minHeight: { xs: 240, md: 320 },
                  zIndex: 1
                }}>
                  {/*Background Effects*/}
                  <Box sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
                    <Box component="svg" sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, filter: 'blur(64px)', opacity: 0.7 }} viewBox="0 0 444 536" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M225.919 112.719C343.98 64.6648 389.388 -70.487 437.442 47.574C485.496 165.635 253.266 481.381 135.205 529.435C17.1445 577.488 57.9596 339.654 9.9057 221.593C-38.1482 103.532 107.858 160.773 225.919 112.719Z" fill="url(#c_orange)" />
                      <defs>
                        <linearGradient id="c_orange" x1="82.7339" y1="550.792" x2="-39.945" y2="118.965" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#00FFFF" />
                          <stop offset="100%" stopColor="#0080FF" />
                        </linearGradient>
                      </defs>
                    </Box>
                  </Box>
                  <Box sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}>
                    <Box component="img" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/noise.png" alt="noise" sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                  </Box>
                  
                  {/*Hero Image*/}
                  <Box sx={{ position: 'relative', zIndex: 3, width: { xs: '100%', md: '90%' }, maxWidth: { xs: 320, md: 400 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box component="img" src={heroImage} alt="hero" sx={{ 
                      width: '100%', 
                      maxWidth: 400, 
                      mx: 'auto'
                    }} />
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Container>
          <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 24, display: 'flex', justifyContent: 'center' }}>
            <KeyboardArrowDownIcon sx={{ 
              fontSize: 56, 
              color: '#00FFFF', 
              opacity: 0.8, 
              animation: 'bounce 1.5s infinite',
              filter: 'drop-shadow(0 0 10px #00FFFF)'
            }} />
          </Box>
        </Box>

        {/*How It Works Section*/}
        {theme.palette.mode === 'dark' && (
          <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2.1rem', md: '2.5rem' }, 
              color: '#00FFFF', 
              mb: 6
            }}>
              How it works
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 4, md: 8 },
              mt: 2,
            }}>
              <Box sx={{
                position: 'relative',
                width: 400,
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid',
                borderColor: '#fff',
                borderRadius: 3,
              }}>
                <Paper elevation={3} sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: '#1A1A1A',
                  border: '1px solid rgba(0,255,255,0.3)',
                  boxShadow: '0 0 20px rgba(0,255,255,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  px: 3,
                  pt: 3,
                  pb: 2,
                  '&:hover': {
                    border: '1px solid rgba(0,255,255,0.8)',
                    boxShadow: '0 0 30px rgba(0,255,255,0.6)',
                  }
                }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: '#0A0A0A',
                    color: '#00FFFF',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    border: '1px solid #00FFFF',
                    boxShadow: '0 0 10px rgba(0,255,255,0.5)',
                  }}>1</Box>
                  <Typography sx={{ 
                    color: '#FFFFFF', 
                    fontWeight: 700, 
                    fontSize: '1.13rem', 
                    mb: 1
                  }}>
                    Connect your Reddit account
                  </Typography>
                  <Typography sx={{ 
                    color: '#00FFFF', 
                    fontWeight: 400, 
                    fontSize: '1.01rem', 
                    lineHeight: 1.5
                  }}>
                    Securely sign in with Reddit to let PromoAI access your profile for posting.
                  </Typography>
                </Paper>
              </Box>
              
              <Box sx={{
                position: 'relative',
                width: 400,
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid',
                borderColor: '#fff',
                borderRadius: 3,
              }}>
                <Paper elevation={3} sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: '#181A20',
                  boxShadow: '0 2px 12px rgba(44,101,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  px: 3,
                  pt: 3,
                  pb: 2,
                }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    bgcolor: '#23242a',
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  }}>2</Box>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.13rem', mb: 1 }}>
                    Describe your product or service
                  </Typography>
                  <Typography sx={{ color: '#bdbdbd', fontWeight: 400, fontSize: '1.01rem', lineHeight: 1.5 }}>
                    Enter your product details and target audience. PromoAI's AI will craft the perfect promotional post.
                  </Typography>
                </Paper>
              </Box>
              
              <Box sx={{
                position: 'relative',
                width: 400,
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid',
                borderColor: '#fff',
                borderRadius: 3,
              }}>
                <Paper elevation={3} sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: '#1A1A1A',
                  border: '1px solid rgba(0,255,255,0.3)',
                  boxShadow: '0 0 20px rgba(0,255,255,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  px: 3,
                  pt: 3,
                  pb: 2,
                  '&:hover': {
                    border: '1px solid rgba(0,255,255,0.8)',
                    boxShadow: '0 0 30px rgba(0,255,255,0.6)',
                  }
                }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: '#0A0A0A',
                    color: '#00FFFF',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    border: '1px solid #00FFFF',
                    boxShadow: '0 0 10px rgba(0,255,255,0.5)',
                  }}>3</Box>
                  <Typography sx={{ 
                    color: '#FFFFFF', 
                    fontWeight: 700, 
                    fontSize: '1.13rem', 
                    mb: 1
                  }}>
                    AI finds the best subreddits & posts for you
                  </Typography>
                  <Typography sx={{ 
                    color: '#00FFFF', 
                    fontWeight: 400, 
                    fontSize: '1.01rem', 
                    lineHeight: 1.5
                  }}>
                    PromoAI automatically selects relevant subreddits and posts your promotion at the optimal time.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Container>
        )}

        {/*Supported Subreddits Section*/}
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
          <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom sx={{ 
              color: '#00FF00',
              fontWeight: 700
            }}>
              Works with 50+ Subreddits
          </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center', mt: 3 }}>
              <Chip 
                label="r/startups" 
                variant="outlined" 
                icon={<RedditIcon color="primary" />}
                sx={{ fontWeight: 600, fontSize: '1.1rem', px: 2 }}
              />
              <Chip 
                label="r/SideProject" 
                variant="outlined" 
                icon={<RedditIcon color="primary" />}
                sx={{ fontWeight: 600, fontSize: '1.1rem', px: 2 }}
              />
              <Chip 
                label="r/indiebiz" 
                variant="outlined" 
                icon={<RedditIcon color="primary" />}
                sx={{ fontWeight: 600, fontSize: '1.1rem', px: 2 }}
              />
              <Chip 
                label="r/Entrepreneur" 
                variant="outlined" 
                icon={<RedditIcon color="primary" />}
                sx={{ fontWeight: 600, fontSize: '1.1rem', px: 2 }}
              />
              <Chip 
                label="r/marketing" 
                variant="outlined" 
                icon={<RedditIcon color="primary" />}
                sx={{ fontWeight: 600, fontSize: '1.1rem', px: 2 }}
              />
              <Chip 
                label="r/SaaS" 
                variant="outlined" 
                icon={<RedditIcon color="primary" />}
                sx={{ fontWeight: 600, fontSize: '1.1rem', px: 2 }}
              />
              <Chip 
                label="r/smallbusiness" 
                variant="outlined" 
                icon={<RedditIcon color="primary" />}
                sx={{ fontWeight: 600, fontSize: '1.1rem', px: 2 }}
              />
              <Chip 
                label="r/ProductHunt" 
                variant="outlined" 
                icon={<RedditIcon color="primary" />}
                sx={{ fontWeight: 600, fontSize: '1.1rem', px: 2 }}
              />
              <Chip label="Many more" icon={<MoreHorizIcon color="primary" />} variant="outlined" sx={{ fontWeight: 600, fontSize: '1.1rem', px: 2 }} />
            </Box>
          </Container>
        </Box>

        {/*Testimonials Section*/}
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '1.15rem' }}>
                2,157 people have said how good PromoAI is
              </Typography>
              <Typography variant="h3" sx={{ mt: 2, fontWeight: 800, color: 'text.primary', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                Our happy clients say about us
              </Typography>
            </Box>
            <Box sx={{ mt: 6, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 380 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto', gap: 2 }}>
                <IconButton sx={{ bgcolor: 'background.paper', boxShadow: 2, width: 48, height: 48, mr: { xs: 1, md: 3 }, '&:hover': { bgcolor: 'background.paper' } }}>
                  <ArrowBackIosNewIcon sx={{ color: '#FF5700' }} />
                </IconButton>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                  {/*Testimonial 1*/}
                  <Box sx={{ width: 370, height: 380, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      right: 10,
                      bottom: 10,
                      zIndex: 0,
                      borderRadius: 1,
                      filter: 'blur(24px)',
                      opacity: 0.18,
                      background: 'linear-gradient(135deg, #44b0ff 0%, #44ff9a 100%)',
                    }} />
                    <Paper elevation={6} sx={{
                      width: 350,
                      minHeight: 320,
                      borderRadius: 1,
                      bgcolor: '#fff',
                      color: '#181A20',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      p: 4,
                      position: 'relative',
                      zIndex: 1,
                      border: '1px solid #f0f0f0',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                      </Box>
                      <Typography sx={{ mt: 2, fontSize: '1.08rem', color: '#181A20', fontWeight: 500, lineHeight: 1.6 }}>
                        “You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change.”
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar src="https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-1.png" alt="Leslie Alexander" sx={{ width: 44, height: 44, mr: 2 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#181A20', fontSize: '1.08rem' }}>Leslie Alexander</Typography>
                          <Typography sx={{ mt: 0.5, fontSize: '0.98rem', color: '#888' }}>Freelance React Developer</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                  {/*Testimonial 2*/}
                  <Box sx={{ width: 370, height: 380, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      right: 10,
                      bottom: 10,
                      zIndex: 0,
                      borderRadius: 1,
                      filter: 'blur(24px)',
                      opacity: 0.18,
                      background: 'linear-gradient(135deg, #ff6644 0%, #8b44ff 100%)',
                    }} />
                    <Paper elevation={6} sx={{
                      width: 350,
                      minHeight: 320,
                      borderRadius: 1,
                      bgcolor: '#fff',
                      color: '#181A20',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      p: 4,
                      position: 'relative',
                      zIndex: 1,
                      border: '1px solid #f0f0f0',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                      </Box>
                      <Typography sx={{ mt: 2, fontSize: '1.08rem', color: '#181A20', fontWeight: 500, lineHeight: 1.6 }}>
                        “Simply the best. Better than all the rest. I'd recommend this product to beginners and advanced users.”
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar src="https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-2.png" alt="Jacob Jones" sx={{ width: 44, height: 44, mr: 2 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#181A20', fontSize: '1.08rem' }}>Jacob Jones</Typography>
                          <Typography sx={{ mt: 0.5, fontSize: '0.98rem', color: '#888' }}>Digital Marketer</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                  {/*Testimonial 3*/}
                  <Box sx={{ width: 370, height: 380, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      right: 10,
                      bottom: 10,
                      zIndex: 0,
                      borderRadius: 1,
                      filter: 'blur(24px)',
                      opacity: 0.18,
                      background: 'linear-gradient(135deg, #ebff70 0%, #ff6644 100%)',
                    }} />
                    <Paper elevation={6} sx={{
                      width: 350,
                      minHeight: 320,
                      borderRadius: 1,
                      bgcolor: '#fff',
                      color: '#181A20',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      p: 4,
                      position: 'relative',
                      zIndex: 1,
                      border: '1px solid #f0f0f0',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                        <StarIcon sx={{ color: '#FDB241', fontSize: 22 }} />
                      </Box>
                      <Typography sx={{ mt: 2, fontSize: '1.08rem', color: '#181A20', fontWeight: 500, lineHeight: 1.6 }}>
                        “I cannot believe that I have got a brand new landing page after getting PromoAI. It was super easy to edit and publish.”
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar src="https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-female.png" alt="Jenny Wilson" sx={{ width: 44, height: 44, mr: 2 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#181A20', fontSize: '1.08rem' }}>Jenny Wilson</Typography>
                          <Typography sx={{ mt: 0.5, fontSize: '0.98rem', color: '#888' }}>Graphic Designer</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
                <IconButton sx={{ bgcolor: 'background.paper', boxShadow: 2, width: 48, height: 48, ml: { xs: 1, md: 3 }, '&:hover': { bgcolor: 'background.paper' } }}>
                  <ArrowForwardIosIcon sx={{ color: '#FF5700' }} />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 8 } }}>
              <a href="#" style={{
                paddingBottom: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#00FFFF',
                borderBottom: '2px solid #00FFFF',
                textDecoration: 'none',
                transition: 'color 0.2s, border-color 0.2s',
              }}>Check all 2,157 reviews</a>
            </Box>
          </Container>
        </Box>

        {/*FAQ Section*/}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 700, color: '#23272F', textShadow: '0 0 6px #00FFFF, 0 0 12px #00FFFF' }}>
            Frequently Asked Questions
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4, justifyContent: 'center' }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', width: '100%', minHeight: '200px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600, 
                  color: '#FF00FF'
                }}>
                  📌 Why was my Reddit post removed?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Reddit's bots auto-filter posts from:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                  <li>New accounts (&lt;7 days old)</li>
                  <li>Low karma accounts (&lt;10 points)</li>
                  <li>Links to "spammy" domains</li>
                  <li>Accounts with posting history issues</li>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', width: '100%', minHeight: '200px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600, 
                  color: '#00FF00'
                }}>
                  ✅ How to fix Reddit posting issues?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Build your Reddit presence:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                  <li>Comment in r/AskReddit, r/aww, r/movies</li>
                  <li>Upvote 10+ posts to build karma</li>
                  <li>Wait 48 hours between posts</li>
                  <li>Use trusted domains (GitHub, ProductHunt)</li>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', width: '100%', minHeight: '200px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600, 
                  color: '#FFA500'
                }}>
                  🚀 What if my posts keep getting filtered?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Try these alternatives:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                  <li>Contact subreddit moderators directly</li>
                  <li>Post on Twitter, LinkedIn, or HackerNews</li>
                  <li>Wait 24-48 hours and try again</li>
                  <li>Use different subreddits</li>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', width: '100%', minHeight: '200px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600, 
                  color: '#00FFFF'
                }}>
                  💡 Best practices for Reddit promotion?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Follow Reddit's guidelines:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                  <li>Be transparent about self-promotion</li>
                  <li>Add value to the community</li>
                  <li>Ask for feedback, don't just promote</li>
                  <li>Follow each subreddit's specific rules</li>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Container>

      <Footer />
      <SignupLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  )
}