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
        py: 2,
        px: 2,
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
          direction="row" 
          spacing={6} 
          justifyContent="center" 
          alignItems="center"
          sx={{ flexWrap: 'wrap', gap: 4 }}
        >
          <Stack direction="row" spacing={1}>


            <IconButton 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener" 
              sx={{
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 0 15px rgba(255,255,255,0.5)',
                  color: '#FFFFFF',
                }
              }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton 
              href="https://github.com" 
              target="_blank" 
              rel="noopener" 
              sx={{
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 0 15px rgba(255,255,255,0.5)',
                  color: '#FFFFFF',
                }
              }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton 
              href="https://mail.google.com/mail/u/3/#inbox?compose=CllgCJlKFhMfRnGwgNNPzgVPtgqmSJRcqHHFhSrLkwRXcGVffDQjqczgVZpKVKgSZXjgbQzsrHL" 
              target="_blank" 
              rel="noopener" 
              sx={{
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 0 15px rgba(255,255,255,0.5)',
                  color: '#FFFFFF',
                }
              }}
            >
              <EmailIcon />
            </IconButton>
          </Stack>

          <Box sx={{ 
            width: '1px', 
            height: '24px', 
            background: 'rgba(255,255,255,0.3)',
            mx: 2
          }} />

          <Typography variant="body2" sx={{
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontWeight: 500
          }}>
            Made with 
            <FavoriteIcon sx={{ 
              fontSize: 16, 
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