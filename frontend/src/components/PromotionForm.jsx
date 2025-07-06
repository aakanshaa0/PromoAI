import { useState } from 'react'
import {
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material'
import { Send } from '@mui/icons-material'

const categories = [
  'tech', 'startup', 'cybersecurity', 'finance', 'health', 'beauty',
  'gaming', 'education', 'travel', 'food', 'fashion', 'sports', 'music', 'art', 'science', 'books', 'movies', 'pets', 'home', 'other',
]

export default function PromotionForm({ onSubmit, isSubmitting }) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    url: '',
    categories: [],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(product)
  }

  return (
    <Paper elevation={6} sx={{
      p: 4,
      borderRadius: '8px',
      width: '100%',
      background: '#1A1A1A',
      border: '2px solid #00FFFF',
      boxShadow: '0 0 30px rgba(0,255,255,0.4)',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        boxShadow: '0 0 40px rgba(0,255,255,0.6)',
        border: '2px solid #00FFFF',
      }
    }}>
      <Box sx={{ 
        position: 'absolute', 
        inset: 0, 
        opacity: 0.1, 
        background: 'linear-gradient(45deg, transparent 30%, rgba(0,255,255,0.1) 50%, transparent 70%)',
        animation: 'neonPulse 3s ease-in-out infinite alternate',
        zIndex: 0 
      }} />
      <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={3}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#00FFFF', 
            mb: 1, 
            textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF'
          }}>
            Product Details
          </Typography>
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            required
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            sx={{
              background: '#0A0A0A',
              borderRadius: '8px',
              input: { 
                color: '#FFFFFF', 
                fontWeight: 600,
                textShadow: '0 0 3px #FFFFFF'
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
            InputLabelProps={{ style: { color: '#00FFFF', fontWeight: 600 } }}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            required
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            sx={{
              background: '#0A0A0A',
              borderRadius: '8px',
              textarea: { 
                color: '#FFFFFF', 
                fontWeight: 500,
                textShadow: '0 0 3px #FFFFFF'
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
            InputLabelProps={{ style: { color: '#00FFFF', fontWeight: 600 } }}
          />

          <TextField
            label="Product URL"
            type="url"
            variant="outlined"
            fullWidth
            required
            value={product.url}
            onChange={(e) => setProduct({ ...product, url: e.target.value })}
            sx={{
              background: '#0A0A0A',
              borderRadius: '8px',
              input: { 
                color: '#FFFFFF', 
                fontWeight: 500,
                textShadow: '0 0 3px #FFFFFF'
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
            InputLabelProps={{ style: { color: '#00FFFF', fontWeight: 600 } }}
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              color: '#00FFFF', 
              fontWeight: 600,
              textShadow: '0 0 5px #00FFFF'
            }}>
              Select Categories (1-3)
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => {
                    if (product.categories.includes(cat)) {
                      setProduct({
                        ...product,
                        categories: product.categories.filter((c) => c !== cat),
                      })
                    } else if (product.categories.length < 3) {
                      setProduct({
                        ...product,
                        categories: [...product.categories, cat],
                      })
                    }
                  }}
                  color={product.categories.includes(cat) ? 'warning' : 'default'}
                  variant={product.categories.includes(cat) ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.01rem',
                    color: product.categories.includes(cat) ? '#FFFFFF' : '#00FFFF',
                    background: product.categories.includes(cat)
                      ? 'linear-gradient(45deg, #00FFFF, #0080FF)'
                      : '#0A0A0A',
                    border: product.categories.includes(cat) 
                      ? '2px solid #00FFFF' 
                      : '1px solid rgba(0,255,255,0.5)',
                    boxShadow: product.categories.includes(cat)
                      ? '0 0 15px rgba(0,255,255,0.5)'
                      : '0 0 5px rgba(0,255,255,0.2)',
                    textShadow: product.categories.includes(cat) 
                      ? '0 0 5px #FFFFFF' 
                      : '0 0 3px #00FFFF',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: product.categories.includes(cat)
                        ? '0 0 20px rgba(0,255,255,0.7)'
                        : '0 0 10px rgba(0,255,255,0.4)',
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ 
            my: 2, 
            borderColor: 'rgba(0,255,255,0.3)',
            '&::before, &::after': {
              borderColor: 'rgba(0,255,255,0.3)'
            }
          }} />

          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={isSubmitting ? <CircularProgress size={24} sx={{ color: '#00FFFF' }} /> : <Send sx={{ color: '#00FFFF' }} />}
            disabled={isSubmitting || product.categories.length === 0}
            sx={{
              alignSelf: 'flex-end',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #FF00FF, #8000FF)',
              color: '#FFFFFF',
              border: '2px solid #FF00FF',
              textShadow: '0 0 5px #FF00FF',
              boxShadow: '0 0 20px rgba(255,0,255,0.6)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: '0 0 30px rgba(255,0,255,0.9)',
                background: 'linear-gradient(45deg, #8000FF, #FF00FF)',
                textShadow: '0 0 8px #FF00FF',
              },
              '&:disabled': {
                background: '#333333',
                color: '#666666',
                border: '2px solid #666666',
                boxShadow: 'none',
                textShadow: 'none',
              }
            }}
          >
            {isSubmitting ? 'Generating...' : 'Generate Post'}
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}