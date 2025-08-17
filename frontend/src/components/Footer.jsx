import { Box, Typography, Container, Stack, IconButton } from '@mui/material'


import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EmailIcon from '@mui/icons-material/Email'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 1.5, sm: 2 },
        px: { xs: 1, sm: 2 },
        mt: 'auto',
        background: 'linear-gradient(90deg, #00FFFF 0%, #0080FF 100%)',
        borderTop: '3px solid #00FFFF',
        color: '#FFFFFF',
        boxShadow: '0 0 20px rgba(0,255,255,0.3)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #00FFFF, transparent)',
          animation: 'neonPulse 2s ease-in-out infinite alternate'
        }
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4, md: 6 }} 
          justifyContent="center" 
          alignItems="center"
          sx={{ flexWrap: 'wrap', gap: { xs: 2, sm: 4 } }}
        >
          <Stack direction="row" spacing={1}>


            <IconButton 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener" 
              sx={{
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                p: { xs: 1, sm: 1.5 },
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 0 15px rgba(255,255,255,0.5)',
                  color: '#FFFFFF',
                }
              }}
            >
              <LinkedInIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <IconButton 
              href="https://github.com" 
              target="_blank" 
              rel="noopener" 
              sx={{
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                p: { xs: 1, sm: 1.5 },
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 0 15px rgba(255,255,255,0.5)',
                  color: '#FFFFFF',
                }
              }}
            >
              <GitHubIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <IconButton 
              href="https://mail.google.com/mail/u/3/#inbox?compose=CllgCJlKFhMfRnGwgNNPzgVPtgqmSJRcqHHFhSrLkwRXcGVffDQjqczgVZpKVKgSZXjgbQzsrHL" 
              target="_blank" 
              rel="noopener" 
              sx={{
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                p: { xs: 1, sm: 1.5 },
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 0 15px rgba(255,255,255,0.5)',
                  color: '#FFFFFF',
                }
              }}
            >
              <EmailIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Stack>

          <Box sx={{ 
            width: { xs: '80%', sm: '1px' }, 
            height: { xs: '1px', sm: '24px' }, 
            background: 'rgba(255,255,255,0.3)',
            mx: { xs: 0, sm: 2 }
          }} />

          <Typography variant="body2" sx={{
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontWeight: 500,
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            textAlign: 'center'
          }}>
            Made with 
            <FavoriteIcon sx={{ 
              fontSize: { xs: 14, sm: 16 }, 
              color: '#FF00FF',
              filter: 'drop-shadow(0 0 3px #FF00FF)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            by Aakansha
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}