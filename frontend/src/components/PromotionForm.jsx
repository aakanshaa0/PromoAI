import React, { useState, useEffect } from 'react'
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
    contact: '',
    categories: [],
    imagePrompt: '',
  })
  const [errors, setErrors] = useState({})

  const isValidUrl = (value) => {
    try {
      if (value.startsWith('http://') || value.startsWith('https://')) {
        new URL(value)
        return true
      }
      return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(\/[^\s]*)?$/.test(value)
    } catch {
      return false
    }
  }

  useEffect(() => {
    const newErrors = {}
    if (!product.name.trim()) newErrors.name = 'Product name is required.'
    if (!product.description.trim()) newErrors.description = 'Description is required.'
    if (!product.url.trim()) newErrors.url = 'Product URL is required.'
    else if (!isValidUrl(product.url.trim())) newErrors.url = 'Enter a valid URL (e.g. https://example.com or example.com/path)'
    if (product.categories.length === 0) newErrors.categories = 'Select at least one category.'
    setErrors(newErrors)
  }, [product])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (Object.keys(errors).length > 0) return
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
            error={!!errors.name}
            helperText={errors.name}
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
            error={!!errors.description}
            helperText={errors.description}
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
                '&.MMui-focused fieldset': { 
                  borderColor: '#00FFFF',
                  boxShadow: '0 0 15px rgba(0,255,255,0.5)'
                },
              },
            }}
            InputLabelProps={{ style: { color: '#00FFFF', fontWeight: 600 } }}
          />

          <TextField
            label="Product URL"
            type="text"
            variant="outlined"
            fullWidth
            required
            value={product.url}
            onChange={(e) => setProduct({ ...product, url: e.target.value })}
            error={!!errors.url}
            helperText={errors.url || 'Enter a valid link to your product, blog, or landing page.'}
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

          <TextField
            label="Contact Information (Email, Twitter, etc.)"
            variant="outlined"
            fullWidth
            value={product.contact}
            onChange={(e) => setProduct({ ...product, contact: e.target.value })}
            placeholder="your@email.com or @yourtwitter"
            helperText="Optional. Provide an email or social handle for people to contact you."
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
            {errors.categories && (
              <Typography color="error" sx={{ fontWeight: 600, mb: 1 }}>{errors.categories}</Typography>
            )}
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

          <Typography variant="body2" sx={{ 
            color: '#00FFFF', 
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            We'll generate promotional content for Reddit, Twitter, LinkedIn, Instagram, and Email marketing
          </Typography>

          <Divider sx={{ 
            my: 2, 
            borderColor: 'rgba(255,0,255,0.3)',
            '&::before, &::after': {
              borderColor: 'rgba(255,0,255,0.3)'
            }
          }} />

          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              color: '#FF00FF', 
              fontWeight: 600,
              textShadow: '0 0 5px #FF00FF',
              mb: 2
            }}>
              🎨 Generate Promotional Image (Optional)
            </Typography>
            
            <TextField
              label="Image Description"
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              value={product.imagePrompt || ''}
              onChange={(e) => setProduct({ ...product, imagePrompt: e.target.value })}
              placeholder="Describe the image you want to generate (e.g., 'A modern tech startup office with people collaborating, clean design, professional lighting')"
              helperText="Leave empty if you don't want an image generated"
              sx={{
                background: '#0A0A0A',
                borderRadius: '8px',
                textarea: { 
                  color: '#FFFFFF', 
                  fontWeight: 500,
                  textShadow: '0 0 3px #FFFFFF'
                },
                label: { 
                  color: '#FF00FF',
                  textShadow: '0 0 5px #FF00FF'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { 
                    borderColor: 'rgba(255,0,255,0.3)',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': { 
                    borderColor: '#FF00FF',
                    boxShadow: '0 0 10px rgba(255,0,255,0.3)'
                  },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#FF00FF',
                    boxShadow: '0 0 15px rgba(255,0,255,0.5)'
                  },
                },
              }}
              InputLabelProps={{ style: { color: '#FF00FF', fontWeight: 600 } }}
            />
            
            <Typography variant="caption" sx={{ 
              color: '#CCCCCC', 
              display: 'block', 
              mt: 1,
              fontStyle: 'italic'
            }}>
              💡 Tip: Be specific about style, mood, colors, and composition for better results
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={isSubmitting ? <CircularProgress size={24} sx={{ color: '#00FFFF' }} /> : <Send sx={{ color: '#00FFFF' }} />}
            disabled={
              isSubmitting ||
              Object.keys(errors).length > 0
            }
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
            {isSubmitting ? 'Generating Content...' : 'Generate Content Pack'}
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}