import { useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress, 
  Paper, 
  Fade, 
  Alert, 
  Stack, 
  Chip,
  TextField,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material'
import { 
  ContentCopy, 
  Twitter, 
  LinkedIn, 
  Instagram, 
  Email,
  Reddit,
  Launch
} from '@mui/icons-material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PromotionForm from '../components/PromotionForm'
import ReactMarkdown from 'react-markdown'

const PlatformIcon = ({ platform, sx = {} }) => {
  const icons = {
    reddit: <Reddit />,
    twitter: <Twitter />,
    linkedin: <LinkedIn />,
    instagram: <Instagram />,
    email: <Email />
  }
  
  const colors = {
    reddit: '#FF4500',
    twitter: '#1DA1F2',
    linkedin: '#0077B5',
    instagram: '#E4405F',
    email: '#00FFFF'
  }
  
  return (
    <Box sx={{ color: colors[platform], ...sx }}>
      {icons[platform]}
    </Box>
  )
}

const PlatformRedirectButton = ({ platform, content, onCopy }) => {
  const [copied, setCopied] = useState(false)
  
  const platformUrls = {
    reddit: 'https://www.reddit.com/submit',
    twitter: 'https://twitter.com/intent/tweet',
    linkedin: 'https://www.linkedin.com/feed/',
    instagram: 'https://www.instagram.com/',
    email: 'mailto:'
  }
  
  const platformNames = {
    reddit: 'Reddit',
    twitter: 'Twitter/X',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    email: 'Email'
  }
  
  const handleRedirect = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      onCopy && onCopy()
      
      if (platform === 'email') {
        const subject = content.split('\n')[0].replace('Subject: ', '')
        const body = content.replace(/Subject: .+\n/, '')
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      } 
      else {
        window.open(platformUrls[platform], '_blank')
      }
      
      setTimeout(() => setCopied(false), 3000)
    } 
    catch (err) {
      console.error('Failed to copy or redirect:', err)
    }
  }
  
  return (
    <Button
      variant="contained"
      onClick={handleRedirect}
      startIcon={<PlatformIcon platform={platform} />}
      endIcon={<Launch />}
      sx={{
        px: 3,
        py: 1.5,
        textTransform: 'none',
        borderRadius: '12px',
        fontWeight: 600,
        fontSize: '1rem',
        background: 'linear-gradient(45deg, #1A1A1A, #2A2A2A)',
        color: '#FFFFFF',
        border: '2px solid',
        borderColor: platform === 'reddit' ? '#FF4500' : 
                    platform === 'twitter' ? '#1DA1F2' : 
                    platform === 'linkedin' ? '#0077B5' : 
                    platform === 'instagram' ? '#E4405F' : '#00FFFF',
        boxShadow: `0 0 20px ${platform === 'reddit' ? 'rgba(255,69,0,0.3)' : 
                                   platform === 'twitter' ? 'rgba(29,161,242,0.3)' : 
                                   platform === 'linkedin' ? 'rgba(0,119,181,0.3)' : 
                                   platform === 'instagram' ? 'rgba(228,64,95,0.3)' : 'rgba(0,255,255,0.3)'}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 0 30px ${platform === 'reddit' ? 'rgba(255,69,0,0.6)' : 
                                     platform === 'twitter' ? 'rgba(29,161,242,0.6)' : 
                                     platform === 'linkedin' ? 'rgba(0,119,181,0.6)' : 
                                     platform === 'instagram' ? 'rgba(228,64,95,0.6)' : 'rgba(0,255,255,0.6)'}`,
        }
      }}
    >
      {copied ? 'Copied & Redirecting...' : `Post to ${platformNames[platform]}`}
    </Button>
  )
}

const ContentSection = ({ title, content, platform, onCopy }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      onCopy && onCopy()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  return (
    <Paper elevation={3} sx={{
      p: 3,
      background: '#1A1A1A',
      border: '1px solid #00FFFF',
      color: '#FFFFFF',
      position: 'relative'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <PlatformIcon platform={platform} sx={{ fontSize: 28 }} />
        <Typography variant="h6" sx={{ color: '#00FFFF', fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
            <IconButton 
              onClick={handleCopy}
              sx={{ 
                color: copied ? '#00FF00' : '#00FFFF',
                '&:hover': { color: '#00FF00' }
              }}
            >
              <ContentCopy />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)', 
        p: { xs: 2, md: 3 }, 
        borderRadius: '8px',
        border: '1px solid rgba(0,255,255,0.3)',
        fontFamily: 'Arial, sans-serif',
        fontSize: { xs: '14px', md: '16px' },
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        maxHeight: '400px',
        overflow: 'auto',
        minHeight: '140px',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        '&:hover': {
          border: '1px solid rgba(0,255,255,0.6)',
          boxShadow: '0 0 20px rgba(0,255,255,0.1)'
        }
      }}>
        <Typography 
          component="pre" 
          sx={{ 
            margin: 0,
            color: '#FFFFFF',
            fontWeight: 400,
            fontFamily: 'Arial, sans-serif',
            textShadow: '0 0 2px rgba(255,255,255,0.3)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          {content}
        </Typography>
      </Box>
    </Paper>
  )
}

export default function Promote() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [showContent, setShowContent] = useState(false)
  const [error, setError] = useState(null)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [copyCount, setCopyCount] = useState(0)
  const [showRegenerateForm, setShowRegenerateForm] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [modificationRequest, setModificationRequest] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

  const handleSubmit = async (productData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)
    setShowContent(false)
    setGeneratedContent(null)
    setCopyCount(0)

    try {
      const token = localStorage.getItem('token')
      
      const productResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          url: productData.url,
          contact: productData.contact,
          categories: productData.categories,
          imagePrompt: productData.imagePrompt
        }),
      })

      if (!productResponse.ok) {
        const data = await productResponse.json()
        throw new Error(data.error || 'Failed to create product')
      }

      const productResponseData = await productResponse.json()
      setGeneratedContent(productResponseData.product.multiPlatformContent)
      setCurrentProduct(productResponseData.product)
      setShowContent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = () => {
    setCopyCount(prev => prev + 1)
  }

  const handleRegenerate = async () => {
    if (!modificationRequest.trim()) {
      setError('Please specify what modifications you want in the promotional text.')
      return
    }

    setIsRegenerating(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const token = localStorage.getItem('token')
      
      const regenerateResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/products/${currentProduct._id}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          modificationRequest: modificationRequest.trim()
        }),
      })

      if (!regenerateResponse.ok) {
        const data = await regenerateResponse.json()
        throw new Error(data.error || 'Failed to regenerate content')
      }

      const regenerateData = await regenerateResponse.json()
      setGeneratedContent(regenerateData.product.multiPlatformContent)
      setCurrentProduct(regenerateData.product)
      setShowRegenerateForm(false)
      setModificationRequest('')
      setCopyCount(0)
      setSuccessMessage(regenerateData.message || 'Content regenerated successfully!')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRegenerating(false)
    }
  }

  const getPlatformDisplayName = (platform) => {
    const names = {
      reddit: 'Reddit Post',
      twitter: 'Twitter/X Thread',
      linkedin: 'LinkedIn Post',
      instagram: 'Instagram Caption',
      email: 'Email Marketing'
    }
    return names[platform] || platform
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)' }}>
      <Navbar />
      <Container maxWidth={false} sx={{ py: 6, flex: 1, px: { xs: 0, md: 4 } }}>
        <Box sx={{ maxWidth: { xs: '100%', md: '800px' }, width: '100%', mx: 'auto', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 700, 
            color: '#FF00FF'
          }}>
            Generate Promotional Content
          </Typography>
          <Typography variant="body1" sx={{ color: '#CCCCCC', mt: 1 }}>
            Create engaging promotional content for multiple platforms. Copy and paste where you want to promote.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ 
            mb: 3,
            background: 'rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,0,0,0.5)',
            color: '#FF0000',
            '& .MuiAlert-icon': {
              color: '#FF0000'
            }
          }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ 
            mb: 3,
            background: 'rgba(0,255,0,0.1)',
            border: '1px solid rgba(0,255,0,0.5)',
            color: '#00FF00',
            '& .MuiAlert-icon': {
              color: '#00FF00'
            }
          }}>
            {successMessage}
          </Alert>
        )}

        {!generatedContent ? (
          <Fade in={!generatedContent} timeout={700}>
            <Box sx={{ maxWidth: { xs: '100%', md: '800px' }, width: '100%', mx: 'auto' }}>
              <PromotionForm 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting} 
              />
            </Box>
          </Fade>
        ) : (
          <Fade in={showContent} timeout={700}>
            <Box sx={{ mt: 4 }}>
              <Box sx={{ 
              maxWidth: { xs: '100%', md: '1000px' }, 
              width: '100%', 
              mx: 'auto', 
              mb: 4,
              overflow: 'hidden',
              '& > *': { maxWidth: '100%' }
            }}>
                <Box sx={{ 
                  mb: 6, 
                  p: 3, 
                  background: 'linear-gradient(135deg, rgba(255,0,255,0.1) 0%, rgba(0,255,255,0.1) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,0,255,0.3)',
                  textAlign: 'left'
                }}>
                  <Typography variant="h6" sx={{ color: '#FF00FF', mb: 2, fontWeight: 600 }}>
                    Product: {currentProduct?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#CCCCCC', mb: 2 }}>
                    {currentProduct?.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {currentProduct?.categories?.map((category, index) => (
                      <Chip
                        key={index}
                        label={category}
                      size="small"
                        sx={{
                          bgcolor: 'rgba(255,0,255,0.2)',
                          color: '#FF00FF',
                          border: '1px solid rgba(255,0,255,0.3)',
                          fontSize: '0.8rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Typography variant="h4" sx={{ color: '#00FFFF', mb: 3, fontWeight: 700 }}>
                    Your Content Pack is Ready!
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3, fontWeight: 500 }}>
                    Generated content for all platforms
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#CCCCCC', mb: 4, maxWidth: '600px', mx: 'auto' }}>
                    Below you'll find platform-optimized content for your product. Each section is tailored specifically for its platform's best practices and character limits.
                  </Typography>
                  {copyCount > 0 && (
                    <Chip 
                      label={`${copyCount} content${copyCount > 1 ? 's' : ''} copied!`}
                      sx={{
                        bgcolor: '#00FF00', 
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '1rem',
                        py: 1
                      }}
                    />
                  )}
                </Box>
                
                <Box sx={{ 
                  maxWidth: '100%', 
                  overflow: 'hidden',
                  '& > *': { maxWidth: '100%' }
                }}>
                  <Stack spacing={4}>
                  {generatedContent.reddit.title && generatedContent.reddit.post ? (
                    <ContentSection
                      title={getPlatformDisplayName('reddit')}
                      content={`${generatedContent.reddit.title}\n\n${generatedContent.reddit.post}`}
                      platform="reddit"
                      onCopy={handleCopy}
                    />
                  ) : (
                  <Paper elevation={3} sx={{
                    p: 3,
                    background: '#1A1A1A',
                      border: '1px solid #FF0000',
                      color: '#FFFFFF',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ color: '#FF0000', mb: 2 }}>
                        Reddit content not generated
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                        The AI service may not have generated Reddit content properly. Check the console for debugging information.
                      </Typography>
                    </Paper>
                  )}

                  {generatedContent.twitter.thread && generatedContent.twitter.thread.length > 0 ? (
                    <ContentSection
                      title={getPlatformDisplayName('twitter')}
                      content={generatedContent.twitter.thread.join('\n\n')}
                      platform="twitter"
                      onCopy={handleCopy}
                    />
                  ) : (
                    <Paper elevation={3} sx={{
                      p: 3,
                      background: '#1A1A1A',
                      border: '1px solid #FF0000',
                          color: '#FFFFFF',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ color: '#FF0000', mb: 2 }}>
                        Twitter content not generated
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                        The AI service may not have generated Twitter content properly. Check the console for debugging information.
                      </Typography>
                    </Paper>
                  )}

                  {generatedContent.linkedin ? (
                    <ContentSection
                      title={getPlatformDisplayName('linkedin')}
                      content={generatedContent.linkedin}
                      platform="linkedin"
                      onCopy={handleCopy}
                    />
                ) : (
                  <Paper elevation={3} sx={{
                    p: 3,
                    background: '#1A1A1A',
                      border: '1px solid #FF0000',
                      color: '#FFFFFF',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ color: '#FF0000', mb: 2 }}>
                        LinkedIn content not generated
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                        The AI service may not have generated LinkedIn content properly. Check the console for debugging information.
                      </Typography>
                  </Paper>
                )}

                  {generatedContent.instagram ? (
                    <ContentSection
                      title={getPlatformDisplayName('instagram')}
                      content={generatedContent.instagram}
                      platform="instagram"
                      onCopy={handleCopy}
                    />
                  ) : (
                    <Paper elevation={3} sx={{
                      p: 3,
                      background: '#1A1A1A',
                      border: '1px solid #FF0000',
                      color: '#FFFFFF',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ color: '#FF0000', mb: 2 }}>
                        Instagram content not generated
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                        The AI service may not have generated Instagram content properly. Check the console for debugging information.
                      </Typography>
                    </Paper>
                  )}

                  {generatedContent.email.subject && generatedContent.email.body ? (
                    <ContentSection
                      title={getPlatformDisplayName('email')}
                      content={`Subject: ${generatedContent.email.subject}\n\n${generatedContent.email.body}`}
                      platform="email"
                      onCopy={handleCopy}
                    />
                  ) : (
                    <Paper elevation={3} sx={{
                      p: 3,
                        background: '#1A1A1A',
                      border: '1px solid #FF0000',
                      color: '#FFFFFF',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ color: '#FF0000', mb: 2 }}>
                        Email content not generated
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                        The AI service may not have generated Email content properly. Check the console for debugging information.
                      </Typography>
                    </Paper>
                  )}
                  </Stack>
                </Box>



                <Box sx={{ 
                  my: 6, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 2
                }}>
                  <Box sx={{ 
                    height: '2px', 
                    flex: 1, 
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.5) 50%, transparent 100%)' 
                  }} />
                  <Box sx={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: '#00FFFF',
                    boxShadow: '0 0 10px #00FFFF'
                  }} />
                  <Box sx={{ 
                    height: '2px', 
                    flex: 1, 
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.5) 50%, transparent 100%)' 
                  }} />
                </Box>
                
                {currentProduct?.generatedImage?.url && (
                  <Box sx={{ 
                    mt: 6, 
                    textAlign: 'center',
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(255,0,255,0.05) 0%, rgba(0,255,255,0.05) 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,0,255,0.3)'
                  }}>
                    <Typography variant="h5" sx={{ color: '#FF00FF', mb: 3, fontWeight: 700 }}>
                      Generated Promotional Image
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#CCCCCC', mb: 3, maxWidth: '600px', mx: 'auto' }}>
                      Based on your description: "{currentProduct.imagePrompt}"
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mb: 3,
                      position: 'relative'
                    }}>
                      <Box
                        component="img"
                        src={currentProduct.generatedImage.url}
                        alt="Generated promotional image"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '400px',
                          borderRadius: '12px',
                          border: '2px solid rgba(255,0,255,0.5)',
                          boxShadow: '0 0 30px rgba(255,0,255,0.3)',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 0 40px rgba(255,0,255,0.5)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" sx={{ color: '#CCCCCC', display: 'block', mb: 1 }}>
                        Format: {currentProduct.generatedImage.format?.toUpperCase()} | 
                        Size: {(currentProduct.generatedImage.size / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = currentProduct.generatedImage.url;
                        link.download = `promotional-image-${currentProduct.name.replace(/\s+/g, '-').toLowerCase()}.${currentProduct.generatedImage.format}`;
                        link.click();
                      }}
                      sx={{
                        borderColor: '#FF00FF',
                        color: '#FF00FF',
                        '&:hover': {
                          borderColor: '#FF00FF',
                          background: 'rgba(255,0,255,0.1)'
                        }
                      }}
                    >
                      Download Image
                    </Button>
                  </Box>
                )}

                {currentProduct?.imageGenerationError && (
                  <Box sx={{ 
                    mt: 6, 
                    textAlign: 'center',
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(255,0,0,0.05) 0%, rgba(255,165,0,0.05) 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,0,0,0.3)'
                  }}>
                    <Typography variant="h6" sx={{ color: '#FF0000', mb: 2, fontWeight: 600 }}>
                      Image Generation Issue
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#CCCCCC', mb: 2 }}>
                      {currentProduct.imageGenerationError}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#FFA500', fontStyle: 'italic' }}>
                      The promotional content was generated successfully, but there was an issue with image generation.
                    </Typography>
                  </Box>
                )}

                <Box sx={{ 
                  mt: 8, 
                  textAlign: 'center',
                  p: 4,
                  background: 'linear-gradient(135deg, rgba(0,255,255,0.05) 0%, rgba(255,0,255,0.05) 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(0,255,255,0.2)'
                }}>
                  <Typography variant="h5" sx={{ color: '#00FFFF', mb: 3, fontWeight: 700 }}>
                    Ready to Post? One-Click Platform Access
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 500 }}>
                    Your content will be automatically copied to your clipboard
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#CCCCCC', mb: 5 }}>
                    Then you'll be redirected directly to each platform to paste and post
                  </Typography>
                  
                  <Grid container spacing={3} justifyContent="center">
                    {generatedContent.reddit.title && generatedContent.reddit.post && (
                      <Grid item>
                        <PlatformRedirectButton
                          platform="reddit"
                          content={`${generatedContent.reddit.title}\n\n${generatedContent.reddit.post}`}
                          onCopy={handleCopy}
                        />
                      </Grid>
                    )}
                    
                    {generatedContent.twitter.thread && generatedContent.twitter.thread.length > 0 && (
                      <Grid item>
                        <PlatformRedirectButton
                          platform="twitter"
                          content={generatedContent.twitter.thread.join('\n\n')}
                          onCopy={handleCopy}
                        />
                      </Grid>
                    )}
                    
                    {generatedContent.linkedin && (
                      <Grid item>
                        <PlatformRedirectButton
                          platform="linkedin"
                          content={generatedContent.linkedin}
                          onCopy={handleCopy}
                        />
                      </Grid>
                    )}
                    
                    {generatedContent.instagram && (
                      <Grid item>
                        <PlatformRedirectButton
                          platform="instagram"
                          content={generatedContent.instagram}
                          onCopy={handleCopy}
                        />
                      </Grid>
                    )}
                    
                    {generatedContent.email.subject && generatedContent.email.body && (
                      <Grid item>
                        <PlatformRedirectButton
                          platform="email"
                          content={`Subject: ${generatedContent.email.subject}\n\n${generatedContent.email.body}`}
                          onCopy={handleCopy}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setGeneratedContent(null)
                      setShowContent(false)
                      setCurrentProduct(null)
                      setCopyCount(0)
                      setShowRegenerateForm(false)
                      setSuccessMessage(null)
                      setError(null)
                    }}
                    sx={{
                      borderColor: '#00FFFF',
                      color: '#00FFFF',
                      '&:hover': { borderColor: '#00FFFF' }
                    }}
                  >
                    Generate New Content
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    onClick={() => setShowRegenerateForm(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #FF00FF, #8000FF)',
                      color: '#FFFFFF',
                      border: '2px solid #FF00FF',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #8000FF, #FF00FF)',
                        boxShadow: '0 0 20px rgba(255,0,255,0.6)'
                      }
                    }}
                  >
                    Regenerate Content
                  </Button>
                </Box>

                {showRegenerateForm && (
                  <Fade in={showRegenerateForm} timeout={500}>
                    <Paper elevation={6} sx={{
                      mt: 4,
                      p: 4,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(255,0,255,0.1) 0%, rgba(0,255,255,0.1) 100%)',
                      border: '2px solid rgba(255,0,255,0.5)',
                      boxShadow: '0 0 30px rgba(255,0,255,0.3)'
                    }}>
                      <Typography variant="h6" sx={{ 
                        color: '#FF00FF', 
                        mb: 3, 
                        fontWeight: 600,
                        textAlign: 'center'
                      }}>
                        Regenerate Promotional Content
                      </Typography>
                      
                      <Typography variant="body1" sx={{ 
                        color: '#CCCCCC', 
                        mb: 3,
                        textAlign: 'center'
                      }}>
                        Tell us what modifications you want in your promotional text. We'll regenerate content for all platforms based on your feedback.
                      </Typography>

                      <TextField
                        label="What modifications do you want?"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        required
                        value={modificationRequest}
                        onChange={(e) => setModificationRequest(e.target.value)}
                        placeholder="e.g., Make it more casual and friendly, Add more technical details, Focus on the problem-solving aspect, Make it shorter, etc."
                        sx={{
                          background: '#0A0A0A',
                          borderRadius: '8px',
                          mb: 3,
                          textarea: { 
                            color: '#FFFFFF', 
                            fontWeight: 500,
                            fontFamily: 'Arial, sans-serif'
                          },
                          label: { 
                            color: '#00FFFF',
                            fontWeight: 600
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { 
                              borderColor: 'rgba(0,255,255,0.5)',
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

                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button 
                          variant="outlined" 
                          onClick={() => {
                            setShowRegenerateForm(false)
                            setModificationRequest('')
                          }}
                          sx={{
                            borderColor: '#00FFFF',
                            color: '#00FFFF',
                            '&:hover': { borderColor: '#00FFFF' }
                          }}
                        >
                          Cancel
                        </Button>
                        
                        <Button 
                          variant="contained" 
                          onClick={handleRegenerate}
                          disabled={isRegenerating || !modificationRequest.trim()}
                          endIcon={isRegenerating ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : null}
                          sx={{
                            background: 'linear-gradient(45deg, #FF00FF, #8000FF)',
                            color: '#FFFFFF',
                            border: '2px solid #FF00FF',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #8000FF, #FF00FF)',
                              boxShadow: '0 0 20px rgba(255,0,255,0.6)'
                            },
                            '&:disabled': {
                              background: '#333333',
                              color: '#666666',
                              border: '2px solid #666666'
                            }
                          }}
                        >
                          {isRegenerating ? 'Regenerating...' : 'Regenerate Content'}
                        </Button>
                      </Box>
                    </Paper>
                  </Fade>
                )}
              </Box>
          </Box>
          </Fade>
        )}
      </Container>
      <Footer />
    </Box>
  )
}