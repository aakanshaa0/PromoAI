import { useState } from 'react'
import { Box, Container, Typography, Button, CircularProgress, Paper, Fade, Alert, Stack } from '@mui/material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PromotionForm from '../components/PromotionForm'
import ReactMarkdown from 'react-markdown'

export default function Promote() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedPost, setGeneratedPost] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState(null)
  const [redditResults, setRedditResults] = useState(null)
  const [showConnectReddit, setShowConnectReddit] = useState(false)
  const [connectUrl, setConnectUrl] = useState('')
  const [isPostingToReddit, setIsPostingToReddit] = useState(false)
  const [redditWarnings, setRedditWarnings] = useState(null)
  const [showRedditGuidance, setShowRedditGuidance] = useState(false)
  const [showFallbackOptions, setShowFallbackOptions] = useState(false)
  const [postResults, setPostResults] = useState(null)

  const handleSubmit = async (productData) => {
    setIsSubmitting(true)
    setError(null)
    setShowPreview(false)
    setGeneratedPost(null)
    setRedditResults(null)
    setShowConnectReddit(false)
    setIsPostingToReddit(false)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })
      if (response.status === 403) {
        const data = await response.json()
        if (data.error && data.error.includes('Reddit account')) {
          // Prompt to connect Reddit
          const authResp = await fetch('/api/auth/reddit/auth', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const authData = await authResp.json()
          setShowConnectReddit(true)
          setConnectUrl(authData.authUrl)
          setIsSubmitting(false)
          return
        }
      }
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate post')
      }
      const data = await response.json()
      setGeneratedPost(data.product.promoText)
      setRedditResults(data.postResults)
      setShowPreview(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if user can post to Reddit
  const checkRedditReadiness = async () => {
    let hasWarnings = false;
    let warningText = '';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/reddit/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.accountAge < 7) {
          hasWarnings = true;
          warningText = "⚠️ New Reddit accounts may get posts auto-removed - we recommend using an aged account (7+ days old)";
        }
        
        if (data.karma < 10) {
          hasWarnings = true;
          warningText = "⚠️ Need 10+ karma? Earn some first by commenting in r/AskReddit";
        }
        
        if (data.domainBlocked) {
          hasWarnings = true;
          warningText = "⚠️ This domain may be blocked by Reddit - consider using a different URL";
        }
      }
    } catch (err) {
      console.log('Could not check Reddit status:', err);
    }
    
    setRedditWarnings(hasWarnings ? warningText : null);
    return !hasWarnings;
  };

  const handlePromoteToReddit = async () => {
    // Check Reddit readiness first
    const isReady = await checkRedditReadiness();
    if (!isReady) {
      setShowRedditGuidance(true);
      return;
    }

    setIsPostingToReddit(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/products/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: generatedPost?.productId || 'latest',
          categories: generatedPost?.categories || ['other']
        }),
      })
      
      if (response.status === 403) {
        const data = await response.json()
        if (data.error && data.error.includes('Reddit account')) {
          // Prompt to connect Reddit
          const authResp = await fetch('/api/auth/reddit/auth', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const authData = await authResp.json()
          setShowConnectReddit(true)
          setConnectUrl(authData.authUrl)
          setIsPostingToReddit(false)
          return
        }
      }
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post to Reddit')
      }
      
      const data = await response.json()
      setRedditResults(data.postResults)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsPostingToReddit(false)
    }
  }

  const handlePromoteToRedditFallback = async () => {
    // Implementation of handlePromoteToRedditFallback
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)' }}>
      <Navbar />
      <Container maxWidth={false} sx={{ py: 6, flex: 1, px: { xs: 0, md: 4 } }}>
        <Box sx={{ maxWidth: { xs: '100%', md: '1000px' }, width: '100%', mx: 'auto', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 700, 
            color: '#FF00FF'
          }}>
            Promote Your Product
          </Typography>
        </Box>
        {error && <Alert severity="error" sx={{ 
          mb: 3,
          background: 'rgba(255,0,0,0.1)',
          border: '1px solid rgba(255,0,0,0.5)',
          color: '#FF0000',
          '& .MuiAlert-icon': {
            color: '#FF0000'
          }
        }}>{error}</Alert>}
        {redditWarnings && (
          <Alert severity="warning" sx={{ 
            mb: 3,
            background: 'rgba(255,165,0,0.1)',
            border: '1px solid rgba(255,165,0,0.5)',
            color: '#FFA500',
            '& .MuiAlert-icon': {
              color: '#FFA500'
            }
          }}>
            <Typography variant="body2">
              {redditWarnings}
            </Typography>
          </Alert>
        )}
        {showConnectReddit && connectUrl && (
          <Alert severity="info" sx={{ 
            mb: 3,
            background: 'rgba(0,255,255,0.1)',
            border: '1px solid rgba(0,255,255,0.5)',
            color: '#00FFFF',
            '& .MuiAlert-icon': {
              color: '#00FFFF'
            }
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <span>Connect your Reddit account to continue.</span>
              <Button 
                variant="contained" 
                color="primary" 
                href={connectUrl} 
                target="_blank" 
                rel="noopener" 
                sx={{ 
                  ml: 2,
                  background: 'linear-gradient(45deg, #00FFFF, #0080FF)',
                  border: '2px solid #00FFFF',
                  boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0080FF, #00FFFF)',
                    boxShadow: '0 0 25px rgba(0,255,255,0.8)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Connect Reddit
              </Button>
            </Stack>
          </Alert>
        )}
        {!generatedPost ? (
          <Fade in={!generatedPost} timeout={700}>
            <Box sx={{ maxWidth: { xs: '100%', md: '800px' }, width: '100%', mx: 'auto' }}>
              <PromotionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </Box>
          </Fade>
        ) : (
          <Fade in={showPreview} timeout={700}>
            <Box sx={{ mt: 4 }}>
              <Box sx={{ maxWidth: { xs: '100%', md: '800px' }, width: '100%', mx: 'auto', mb: 2 }}>
                <Typography variant="h6" gutterBottom color="secondary.main" sx={{ color: '#fff' }}>
                  Generated Post Preview:
                </Typography>
              </Box>
              <Box
                sx={{
                  maxWidth: { xs: '100%', md: '600px' },
                  width: '100%',
                  mx: 'auto',
                  borderRadius: '32px',
                  p: '4px',
                  background: 'linear-gradient(90deg, #FF5700 0%, #FFB300 100%)',
                  mb: 3,
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    whiteSpace: 'pre-line',
                    borderRadius: '28px',
                    background: '#fff',
                    fontSize: '1.08rem',
                    fontFamily: 'Montserrat, Inter, sans-serif',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                    color: '#23272F',
                    width: '100%',
                    overflow: 'hidden',
                    m: 0,
                  }}
                >
                  <ReactMarkdown>{generatedPost}</ReactMarkdown>
                </Paper>
              </Box>
              {redditResults && (
                <Box sx={{ maxWidth: { xs: '100%', md: '600px' }, width: '100%', mx: 'auto', mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Reddit Posting Results:
                  </Typography>
                  {redditResults.results && redditResults.results.length > 0 && (
                    <Alert severity={redditResults.results[0].status === 'success' ? 'success' : 'warning'}>
                      {redditResults.results[0].status === 'success'
                        ? <>Posted to <b>r/{redditResults.results[0].subreddit}</b>: <a href={redditResults.results[0].submissionUrl} target="_blank" rel="noopener noreferrer">View Post</a></>
                        : <>Failed to post to <b>r/{redditResults.results[0].subreddit}</b>: {redditResults.results[0].error}</>}
                    </Alert>
                  )}
                </Box>
              )}
              <Box sx={{ maxWidth: { xs: '100%', md: '600px' }, width: '100%', mx: 'auto', mt: 3, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePromoteToReddit}
                  disabled={isPostingToReddit}
                  sx={{
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(90deg, #FF5700 0%, #FFB300 100%)',
                    color: '#fff',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px rgba(255,87,0,0.10)',
                    transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s, color 0.15s',
                    '&:hover': {
                      transform: 'scale(1.04)',
                      boxShadow: '0 4px 16px rgba(255,87,0,0.15)',
                      background: 'linear-gradient(90deg, #FFB300 0%, #FF5700 100%)',
                      color: '#fff',
                      border: '2px solid #fff',
                    },
                  }}
                >
                  {isPostingToReddit ? 'Promoting...' : 'Promote to Reddit'}
                </Button>
              </Box>
            </Box>
          </Fade>
        )}
        {/* Reddit Guidance Modal */}
        {showRedditGuidance && (
          <Box sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: 1200, 
            backdropFilter: 'blur(7px)',
            background: 'rgba(24,26,32,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}>
            <Paper sx={{ 
              maxWidth: 600, 
              p: 4, 
              borderRadius: '18px',
              background: '#fff',
              color: '#23272F'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#FF5700' }}>
                📌 Reddit Posting Guidelines
              </Typography>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Typography variant="body1">
                  <strong>Why was my post removed?</strong><br/>
                  Reddit's bots auto-filter:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>New accounts (&lt;7 days old)</li>
                  <li>Low karma (&lt;10 points)</li>
                  <li>Links to "spammy" domains</li>
                </Box>
                <Typography variant="body1">
                  <strong>✅ How to fix it:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Upvote 10 posts & comment in r/aww/r/movies</li>
                  <li>Wait 48 hours</li>
                  <li>Try reposting</li>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowRedditGuidance(false)}
                  sx={{ color: '#FF5700', borderColor: '#FF5700' }}
                >
                  Got it
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setShowRedditGuidance(false);
                    handlePromoteToReddit();
                  }}
                  sx={{ 
                    background: 'linear-gradient(90deg, #FF5700 0%, #FFB300 100%)',
                    color: '#fff'
                  }}
                >
                  Try Anyway
                </Button>
              </Stack>
            </Paper>
          </Box>
        )}
        {/*Fallback Options Modal*/}
        {showFallbackOptions && (
          <Box sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: 1200, 
            backdropFilter: 'blur(7px)',
            background: 'rgba(24,26,32,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}>
            <Paper sx={{ 
              maxWidth: 700, 
              p: 4, 
              borderRadius: '18px',
              background: '#fff',
              color: '#23272F'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#FF5700' }}>
                🔄 Alternative Promotion Options
              </Typography>
              
              {postResults && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Some posts may have been filtered by Reddit. Here are your options:
                  </Typography>
                </Alert>
              )}
              
              <Stack spacing={3} sx={{ mb: 4 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    📝 Manual Approval Request
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Contact subreddit moderators to approve your post manually.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                      const modMessage = `Hi mods! I posted about my project but it may have been auto-filtered. Could you please check and approve if it follows the rules? Thanks!`;
                      navigator.clipboard.writeText(modMessage);
                      alert('Mod message copied to clipboard!');
                    }}
                    sx={{ color: '#FF5700', borderColor: '#FF5700' }}
                  >
                    Copy Mod Message
                  </Button>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    🐦 Alternative Platforms
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Generate posts for other platforms while you build Reddit karma.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => {
                        // Generate Twitter post
                        const twitterPost = `Just launched: ${product?.name}! ${product?.description} Check it out: ${product?.url}`;
                        navigator.clipboard.writeText(twitterPost);
                        alert('Twitter post copied!');
                      }}
                    >
                      Twitter
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => {
                        // Generate LinkedIn post
                        const linkedinPost = `Excited to share my latest project: ${product?.name}. ${product?.description} Would love your feedback! ${product?.url}`;
                        navigator.clipboard.writeText(linkedinPost);
                        alert('LinkedIn post copied!');
                      }}
                    >
                      LinkedIn
                    </Button>
                  </Stack>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    ⏰ Schedule for Later
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Wait 24-48 hours and try reposting when your account has more karma.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                      setShowFallbackOptions(false);
                      setSuccess('Reminder set! Try reposting in 24-48 hours.');
                    }}
                  >
                    Set Reminder
                  </Button>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowFallbackOptions(false)}
                  sx={{ color: '#FF5700', borderColor: '#FF5700' }}
                >
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setShowFallbackOptions(false);
                    handlePromoteToReddit();
                  }}
                  sx={{ 
                    background: 'linear-gradient(90deg, #FF5700 0%, #FFB300 100%)',
                    color: '#fff'
                  }}
                >
                  Try Again
                </Button>
              </Stack>
            </Paper>
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  )
}