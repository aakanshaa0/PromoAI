import { useState, useEffect, useContext } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Stack, 
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material'
import { 
  TrendingUp, 
  ContentCopy, 
  Campaign, 
  Analytics,
  Assessment,
  OpenInNew,
  Create,
  Reddit,
  Twitter,
  LinkedIn,
  Instagram,
  Email
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AuthContext } from '../main'

export default function Dashboard() {
  const { isLoggedIn, user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalContentGenerated: 0,
    recentProducts: []
  })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [contentDialogOpen, setContentDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err.message)
        setStats({
          totalProducts: 0,
          totalContentGenerated: 0,
          recentProducts: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0A0A0A' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 8, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center',
            background: '#1A1A1A',
            border: '2px solid #00FFFF',
            boxShadow: '0 0 30px rgba(0,255,255,0.3)'
          }}>
            <Typography variant="h4" sx={{ 
              color: '#00FFFF',
              mb: 2
            }}>
              Access Denied
            </Typography>
            <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 3 }}>
              Please log in to access your dashboard.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #00FFFF, #0080FF)',
                border: '2px solid #00FFFF',
                boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0080FF, #00FFFF)',
                  boxShadow: '0 0 25px rgba(0,255,255,0.8)',
                }
              }}
            >
              Go to Home
            </Button>
          </Paper>
        </Container>
        <Footer />
      </Box>
    )
  }

  const handleContentClick = (product) => {
    setSelectedProduct(product)
    setContentDialogOpen(true)
    setActiveTab(0)
  }

  const handleCloseContent = () => {
    setContentDialogOpen(false)
    setSelectedProduct(null)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ 
            color: '#FF00FF',
            fontWeight: 800,
            mb: 2
          }}>
            Dashboard
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#00FFFF',
            opacity: 0.8
          }}>
            Welcome back! Here's your content generation overview.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ 
            mb: 3,
            background: 'rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,0,0,0.5)',
            color: '#FF0000'
          }}>
            {error}
          </Alert>
        )}

        {copySuccess && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid #4CAF50',
              color: '#4CAF50'
            }}
            onClose={() => setCopySuccess(false)}
          >
            Content copied to clipboard successfully!
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#00FFFF' }} />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
              <Grid container spacing={3} sx={{ maxWidth: 800 }}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ 
                    background: '#1A1A1A',
                    border: '1px solid rgba(0,255,255,0.3)',
                    boxShadow: '0 0 20px rgba(0,255,255,0.2)',
                    '&:hover': {
                      border: '1px solid rgba(0,255,255,0.8)',
                      boxShadow: '0 0 30px rgba(0,255,255,0.4)',
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <TrendingUp sx={{ 
                        fontSize: 40, 
                        color: '#00FFFF',
                        mb: 1,
                        filter: 'drop-shadow(0 0 8px #00FFFF)'
                      }} />
                      <Typography variant="h4" sx={{ 
                        color: '#FFFFFF',
                        fontWeight: 700
                      }}>
                        {stats.totalProducts}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#00FFFF'
                      }}>
                        Products Created
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card sx={{ 
                    background: '#1A1A1A',
                    border: '1px solid rgba(0,255,255,0.3)',
                    boxShadow: '0 0 20px rgba(0,255,255,0.2)',
                    '&:hover': {
                      border: '1px solid rgba(0,255,255,0.8)',
                      boxShadow: '0 0 30px rgba(0,255,255,0.4)',
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <ContentCopy sx={{ 
                        fontSize: 40, 
                        color: '#00FFFF',
                        mb: 1,
                        filter: 'drop-shadow(0 0 8px #00FFFF)'
                      }} />
                      <Typography variant="h4" sx={{ 
                        color: '#FFFFFF',
                        fontWeight: 700
                      }}>
                        {stats.totalContentGenerated}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#00FFFF'
                      }}>
                        Content Pieces Generated
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
              <Paper sx={{ 
                p: 4, 
                background: '#1A1A1A',
                border: '1px solid rgba(0,255,255,0.3)',
                boxShadow: '0 0 20px rgba(0,255,255,0.2)',
                width: '100%',
                maxWidth: 1000
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ 
                    color: '#00FFFF',
                    fontWeight: 700
                  }}>
                    Recent Products
                  </Typography>
                  <Button
                    component={Link}
                    to="/promote"
                    variant="contained"
                    startIcon={<Create />}
                    sx={{
                      background: 'linear-gradient(45deg, #00FFFF, #0080FF)',
                      border: '2px solid #00FFFF',
                      boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0080FF, #00FFFF)',
                        boxShadow: '0 0 25px rgba(0,255,255,0.8)',
                      }
                    }}
                  >
                    Generate New Content
                  </Button>
                </Box>

                {stats.recentProducts && stats.recentProducts.length > 0 ? (
                  <Stack spacing={2}>
                    {stats.recentProducts.map((product, index) => (
                      <Paper key={index} sx={{ 
                        p: 3, 
                        background: '#0A0A0A',
                        border: '1px solid rgba(0,255,255,0.2)',
                        '&:hover': {
                          border: '1px solid rgba(0,255,255,0.5)',
                        }
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ 
                              color: '#FFFFFF',
                              fontWeight: 600,
                              mb: 1
                            }}>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#00FFFF',
                              mb: 2
                            }}>
                              {product.description}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              {product.categories && product.categories.map((category, catIndex) => (
                                <Chip
                                  key={catIndex}
                                  label={category}
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(0,255,255,0.2)',
                                    color: '#00FFFF',
                                    border: '1px solid rgba(0,255,255,0.3)'
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                          <Tooltip title="View Generated Content">
                            <IconButton
                              onClick={() => handleContentClick(product)}
                              sx={{ color: '#00FFFF' }}
                            >
                              <OpenInNew />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Divider sx={{ borderColor: 'rgba(0,255,255,0.2)', my: 2 }} />
                        <Typography variant="body2" sx={{ 
                          color: '#00FFFF',
                          fontStyle: 'italic'
                        }}>
                          Click the link icon to view generated content for: Reddit, Twitter, LinkedIn, Instagram, Email
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Create sx={{ 
                      fontSize: 60, 
                      color: 'rgba(0,255,255,0.3)',
                      mb: 2
                    }} />
                    <Typography variant="h6" sx={{ 
                      color: '#00FFFF',
                      mb: 2
                    }}>
                      No products yet
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#FFFFFF',
                      opacity: 0.7,
                      mb: 3
                    }}>
                      Start creating products to generate promotional content
                    </Typography>
                    <Button
                      component={Link}
                      to="/promote"
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(45deg, #00FFFF, #0080FF)',
                        border: '2px solid #00FFFF',
                        boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #0080FF, #00FFFF)',
                          boxShadow: '0 0 25px rgba(0,255,255,0.8)',
                        }
                      }}
                    >
                      Create Your First Product
                    </Button>
                  </Box>
                )}
              </Paper>
            </Box>

            <Dialog open={contentDialogOpen} onClose={handleCloseContent} maxWidth="md" fullWidth>
              <DialogTitle sx={{ 
                background: '#1A1A1A', 
                color: '#00FFFF',
                borderBottom: '1px solid rgba(0,255,255,0.3)'
              }}>
                {selectedProduct ? selectedProduct.name : ''}
              </DialogTitle>
              <DialogContent sx={{ background: '#0A0A0A', p: 0 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(event, newValue) => setActiveTab(newValue)}
                  sx={{ 
                    background: '#1A1A1A',
                    borderBottom: '1px solid rgba(0,255,255,0.3)',
                    '& .MuiTab-root': {
                      color: '#FFFFFF',
                      '&.Mui-selected': {
                        color: '#00FFFF'
                      }
                    }
                  }}
                >
                  <Tab label="Generated Content" />
                  <Tab label="Product Details" />
                </Tabs>

                {activeTab === 0 && (
                  <Box sx={{ p: 3 }}>
                    {selectedProduct?.multiPlatformContent ? (
                      <>
                        {/*Reddit Content*/}
                        {selectedProduct.multiPlatformContent.reddit && (
                          <Paper sx={{ p: 3, mb: 3, background: '#1A1A1A', border: '1px solid rgba(0,255,255,0.2)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Reddit sx={{ color: '#FF4500', mr: 1, fontSize: 24 }} />
                                <Typography variant="h6" sx={{ color: '#00FFFF' }}>
                                  Reddit Post
                                </Typography>
                              </Box>
                              <IconButton 
                                onClick={() => copyToClipboard(
                                  `**Title:** ${selectedProduct.multiPlatformContent.reddit.title}\n\n${selectedProduct.multiPlatformContent.reddit.post}`
                                )} 
                                sx={{ color: '#00FFFF' }}
                              >
                                <ContentCopy />
                              </IconButton>
                            </Box>
                            {selectedProduct.multiPlatformContent.reddit.title && (
                              <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 'bold', mb: 2 }}>
                                {selectedProduct.multiPlatformContent.reddit.title}
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ color: '#FFFFFF', whiteSpace: 'pre-wrap' }}>
                              {selectedProduct.multiPlatformContent.reddit.post}
                            </Typography>
                          </Paper>
                        )}

                        {/*Twitter Content*/}
                        {selectedProduct.multiPlatformContent.twitter && selectedProduct.multiPlatformContent.twitter.thread && (
                          <Paper sx={{ p: 3, mb: 3, background: '#1A1A1A', border: '1px solid rgba(0,255,255,0.2)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Twitter sx={{ color: '#1DA1F2', mr: 1, fontSize: 24 }} />
                                <Typography variant="h6" sx={{ color: '#00FFFF' }}>
                                  Twitter/X Thread
                                </Typography>
                              </Box>
                              <IconButton 
                                onClick={() => copyToClipboard(selectedProduct.multiPlatformContent.twitter.thread.join('\n\n'))} 
                                sx={{ color: '#00FFFF' }}
                              >
                                <ContentCopy />
                              </IconButton>
                            </Box>
                            {selectedProduct.multiPlatformContent.twitter.thread.map((tweet, index) => (
                              <Box key={index} sx={{ mb: 2, p: 2, background: '#0A0A0A', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ color: '#FFFFFF', whiteSpace: 'pre-wrap' }}>
                                  {tweet}
                                </Typography>
                              </Box>
                            ))}
                          </Paper>
                        )}

                        {/*LinkedIn Content*/}
                        {selectedProduct.multiPlatformContent.linkedin && (
                          <Paper sx={{ p: 3, mb: 3, background: '#1A1A1A', border: '1px solid rgba(0,255,255,0.2)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LinkedIn sx={{ color: '#0077B5', mr: 1, fontSize: 24 }} />
                                <Typography variant="h6" sx={{ color: '#00FFFF' }}>
                                  LinkedIn Post
                                </Typography>
                              </Box>
                              <IconButton 
                                onClick={() => copyToClipboard(selectedProduct.multiPlatformContent.linkedin)} 
                                sx={{ color: '#00FFFF' }}
                              >
                                <ContentCopy />
                              </IconButton>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#FFFFFF', whiteSpace: 'pre-wrap' }}>
                              {selectedProduct.multiPlatformContent.linkedin}
                            </Typography>
                          </Paper>
                        )}

                        {/*Instagram Content*/}
                        {selectedProduct.multiPlatformContent.instagram && (
                          <Paper sx={{ p: 3, mb: 3, background: '#1A1A1A', border: '1px solid rgba(0,255,255,0.2)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Instagram sx={{ color: '#E4405F', mr: 1, fontSize: 24 }} />
                                <Typography variant="h6" sx={{ color: '#00FFFF' }}>
                                  Instagram Caption
                                </Typography>
                              </Box>
                              <IconButton 
                                onClick={() => copyToClipboard(selectedProduct.multiPlatformContent.instagram)} 
                                sx={{ color: '#00FFFF' }}
                              >
                                <ContentCopy />
                              </IconButton>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#FFFFFF', whiteSpace: 'pre-wrap' }}>
                              {selectedProduct.multiPlatformContent.instagram}
                            </Typography>
                          </Paper>
                        )}

                        {/*Email Content*/}
                        {selectedProduct.multiPlatformContent.email && (
                          <Paper sx={{ p: 3, mb: 3, background: '#1A1A1A', border: '1px solid rgba(0,255,255,0.2)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Email sx={{ color: '#EA4335', mr: 1, fontSize: 24 }} />
                                <Typography variant="h6" sx={{ color: '#00FFFF' }}>
                                  Email Marketing
                                </Typography>
                              </Box>
                              <IconButton 
                                onClick={() => copyToClipboard(
                                  `Subject: ${selectedProduct.multiPlatformContent.email.subject}\n\n${selectedProduct.multiPlatformContent.email.body}`
                                )} 
                                sx={{ color: '#00FFFF' }}
                              >
                                <ContentCopy />
                              </IconButton>
                            </Box>
                            {selectedProduct.multiPlatformContent.email.subject && (
                              <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 'bold', mb: 2 }}>
                                Subject: {selectedProduct.multiPlatformContent.email.subject}
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ color: '#FFFFFF', whiteSpace: 'pre-wrap' }}>
                              {selectedProduct.multiPlatformContent.email.body}
                            </Typography>
                          </Paper>
                        )}

                        {/*No content fallback*/}
                        {(!selectedProduct.multiPlatformContent.reddit && 
                          !selectedProduct.multiPlatformContent.twitter && 
                          !selectedProduct.multiPlatformContent.linkedin && 
                          !selectedProduct.multiPlatformContent.instagram && 
                          !selectedProduct.multiPlatformContent.email) && (
                          <Paper sx={{ p: 3, background: '#1A1A1A', border: '1px solid rgba(255,0,0,0.3)' }}>
                            <Typography variant="h6" sx={{ color: '#FF0000', textAlign: 'center', mb: 2 }}>
                              No Generated Content Found
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#FFFFFF', textAlign: 'center' }}>
                              This product doesn't have any generated promotional content yet.
                            </Typography>
                          </Paper>
                        )}
                      </>
                    ) : (
                      <Paper sx={{ p: 3, background: '#1A1A1A', border: '1px solid rgba(255,0,0,0.3)' }}>
                        <Typography variant="h6" sx={{ color: '#FF0000', textAlign: 'center', mb: 2 }}>
                          No Content Data Available
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFFFFF', textAlign: 'center' }}>
                          This product doesn't have the multiPlatformContent field.
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFFFFF', textAlign: 'center', mt: 1, fontSize: '12px' }}>
                          Product data: {JSON.stringify(selectedProduct, null, 2)}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#00FFFF', mb: 2, fontWeight: 'bold' }}>
                      Product Details
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#00FFFF', fontWeight: 'bold' }}>
                          Name:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                          {selectedProduct?.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#00FFFF', fontWeight: 'bold' }}>
                          Description:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                          {selectedProduct?.description}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#00FFFF', fontWeight: 'bold' }}>
                          Categories:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                          {selectedProduct?.categories?.join(', ')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#00FFFF', fontWeight: 'bold' }}>
                          URL:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                          {selectedProduct?.url}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#00FFFF', fontWeight: 'bold' }}>
                          Contact:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                          {selectedProduct?.contact}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#00FFFF', fontWeight: 'bold' }}>
                          Created:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                          {selectedProduct?.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ background: '#1A1A1A', borderTop: '1px solid rgba(0,255,255,0.3)' }}>
                <Button 
                  onClick={handleCloseContent} 
                  sx={{ 
                    color: '#00FFFF',
                    border: '1px solid #00FFFF',
                    '&:hover': {
                      background: 'rgba(0,255,255,0.1)'
                    }
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Container>
      <Footer />
    </Box>
  )
} 