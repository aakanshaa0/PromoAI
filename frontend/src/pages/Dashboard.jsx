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
  IconButton
} from '@mui/material'
import { 
  TrendingUp, 
  Visibility, 
  ThumbUp, 
  Comment, 
  Share, 
  Refresh,
  Analytics,
  Campaign,
  Timeline,
  Assessment,
  OpenInNew
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
    totalPosts: 0,
    totalViews: 0,
    totalUpvotes: 0,
    totalComments: 0,
    successRate: 0,
    recentPosts: []
  })

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('/api/dashboard', {
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
        //Data for demo-Empty posts to show no posts state
        setStats({
          totalPosts: 0,
          totalViews: 0,
          totalUpvotes: 0,
          totalComments: 0,
          successRate: 0,
          recentPosts: []
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        {/*Header*/}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ 
            color: '#FF00FF',
            mb: 2,
            fontWeight: 800
          }}>
            Dashboard
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#00FFFF',
            opacity: 0.8
          }}>
            Welcome back! Here's your promotion performance overview.
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#00FFFF' }} />
          </Box>
        ) : (
          <>
            {/*Stats Cards*/}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
              <Grid container spacing={3} sx={{ maxWidth: 1000 }}>
                <Grid item xs={12} sm={6} md={2.4}>
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
                        {stats.totalPosts}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#00FFFF'
                      }}>
                        Total Posts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ 
                    background: '#1A1A1A',
                    border: '1px solid rgba(0,255,0,0.3)',
                    boxShadow: '0 0 20px rgba(0,255,0,0.2)',
                    '&:hover': {
                      border: '1px solid rgba(0,255,0,0.8)',
                      boxShadow: '0 0 30px rgba(0,255,0,0.4)',
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Visibility sx={{ 
                        fontSize: 40, 
                        color: '#00FF00',
                        mb: 1,
                        filter: 'drop-shadow(0 0 8px #00FF00)'
                      }} />
                      <Typography variant="h4" sx={{ 
                        color: '#FFFFFF',
                        fontWeight: 700
                      }}>
                        {stats.totalViews.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#00FF00'
                      }}>
                        Total Views
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ 
                    background: '#1A1A1A',
                    border: '1px solid rgba(255,255,0,0.3)',
                    boxShadow: '0 0 20px rgba(255,255,0,0.2)',
                    '&:hover': {
                      border: '1px solid rgba(255,255,0,0.8)',
                      boxShadow: '0 0 30px rgba(255,255,0,0.4)',
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <ThumbUp sx={{ 
                        fontSize: 40, 
                        color: '#FFFF00',
                        mb: 1,
                        filter: 'drop-shadow(0 0 8px #FFFF00)'
                      }} />
                      <Typography variant="h4" sx={{ 
                        color: '#FFFFFF',
                        fontWeight: 700
                      }}>
                        {stats.totalUpvotes}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#FFFF00'
                      }}>
                        Total Upvotes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ 
                    background: '#1A1A1A',
                    border: '1px solid rgba(255,0,255,0.3)',
                    boxShadow: '0 0 20px rgba(255,0,255,0.2)',
                    '&:hover': {
                      border: '1px solid rgba(255,0,255,0.8)',
                      boxShadow: '0 0 30px rgba(255,0,255,0.4)',
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Comment sx={{ 
                        fontSize: 40, 
                        color: '#FF00FF',
                        mb: 1,
                        filter: 'drop-shadow(0 0 8px #FF00FF)'
                      }} />
                      <Typography variant="h4" sx={{ 
                        color: '#FFFFFF',
                        fontWeight: 700
                      }}>
                        {stats.totalComments}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#FF00FF'
                      }}>
                        Total Comments
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ 
                    background: '#1A1A1A',
                    border: '1px solid rgba(255,165,0,0.3)',
                    boxShadow: '0 0 20px rgba(255,165,0,0.2)',
                    '&:hover': {
                      border: '1px solid rgba(255,165,0,0.8)',
                      boxShadow: '0 0 30px rgba(255,165,0,0.4)',
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Assessment sx={{ 
                        fontSize: 40, 
                        color: '#FFA500',
                        mb: 1,
                        filter: 'drop-shadow(0 0 8px #FFA500)'
                      }} />
                      <Typography variant="h4" sx={{ 
                        color: '#FFFFFF',
                        fontWeight: 700
                      }}>
                        {stats.successRate}%
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#FFA500'
                      }}>
                        Success Rate
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Promote Button */}
            <Box sx={{ mt: 6, mb: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/promote"
                variant="contained"
                size="large"
                startIcon={<Campaign />}
                sx={{
                  background: '#00FFFF',
                  border: '2px solid #00FFFF',
                  color: '#181A1A',
                  boxShadow: '0 0 20px rgba(0,255,255,0.6)',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  '&:hover': {
                    background: '#00e6e6',
                    boxShadow: '0 0 30px rgba(0,255,255,0.9)',
                    border: '2px solid #00FFFF',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                Promote New Product
              </Button>
            </Box>

            {/* All Posts Section */}
            <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ 
                color: '#00FF00',
                mb: 4,
                fontWeight: 800,
                textAlign: 'center'
              }}>
                Your Reddit Posts
              </Typography>
              
              {stats.recentPosts.length === 0 ? (
                <Paper sx={{ 
                  p: 6,
                  textAlign: 'center',
                  background: '#1A1A1A',
                  border: '1px solid rgba(0,255,255,0.3)',
                  boxShadow: '0 0 20px rgba(0,255,255,0.2)'
                }}>
                  <Share sx={{ 
                    fontSize: 80, 
                    color: '#00FFFF',
                    mb: 2,
                    opacity: 0.5,
                    filter: 'drop-shadow(0 0 10px #00FFFF)'
                  }} />
                  <Typography variant="h5" sx={{ 
                    color: '#FFFFFF',
                    mb: 2
                  }}>
                    No Posts Made Yet
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#00FFFF',
                    mb: 4,
                    opacity: 0.8
                  }}>
                    Start promoting your products on Reddit to see your posts here!
                  </Typography>
                  <Button
                    component={Link}
                    to="/promote"
                    variant="contained"
                    startIcon={<Campaign />}
                    sx={{
                      background: '#00FFFF',
                      border: '2px solid #00FFFF',
                      color: '#181A1A',
                      boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                      '&:hover': {
                        background: '#00e6e6',
                        boxShadow: '0 0 25px rgba(0,255,255,0.8)',
                        border: '2px solid #00FFFF',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Create Your First Post
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {stats.recentPosts.map((post) => (
                    <Grid item xs={12} md={6} lg={4} key={post.id}>
                      <Paper 
                        component={post.redditUrl ? 'a' : 'div'}
                        href={post.redditUrl || undefined}
                        target={post.redditUrl ? '_blank' : undefined}
                        rel={post.redditUrl ? 'noopener noreferrer' : undefined}
                        sx={{ 
                          p: 3,
                          height: '100%',
                          background: '#1A1A1A',
                          border: post.status === 'posted' ? '1px solid rgba(0,255,0,0.3)' : 
                                  post.status === 'failed' ? '1px solid rgba(255,0,0,0.3)' : 
                                  '1px solid rgba(255,165,0,0.3)',
                          boxShadow: post.status === 'posted' ? '0 0 20px rgba(0,255,0,0.2)' : 
                                    post.status === 'failed' ? '0 0 20px rgba(255,0,0,0.2)' : 
                                    '0 0 20px rgba(255,165,0,0.2)',
                          '&:hover': {
                            border: post.status === 'posted' ? '1px solid rgba(0,255,0,0.8)' : 
                                    post.status === 'failed' ? '1px solid rgba(255,0,0,0.8)' : 
                                    '1px solid rgba(255,165,0,0.8)',
                            boxShadow: post.status === 'posted' ? '0 0 30px rgba(0,255,0,0.4)' : 
                                      post.status === 'failed' ? '0 0 30px rgba(255,0,0,0.4)' : 
                                      '0 0 30px rgba(255,165,0,0.4)',
                            transform: 'translateY(-2px)',
                            cursor: post.redditUrl ? 'pointer' : 'default',
                          },
                          transition: 'all 0.3s ease',
                          textDecoration: 'none',
                          display: 'block'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ 
                            color: '#FFFFFF',
                            fontWeight: 600,
                            flex: 1,
                            mr: 2
                          }}>
                            {post.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {post.redditUrl && (
                              <OpenInNew sx={{ 
                                fontSize: 16, 
                                color: '#00FFFF',
                                filter: 'drop-shadow(0 0 3px #00FFFF)'
                              }} />
                            )}
                            <Chip 
                              label={post.status} 
                              size="small"
                              sx={{
                                background: post.status === 'posted' ? 'rgba(0,255,0,0.2)' : 
                                           post.status === 'failed' ? 'rgba(255,0,0,0.2)' : 
                                           'rgba(255,165,0,0.2)',
                                color: post.status === 'posted' ? '#00FF00' : 
                                       post.status === 'failed' ? '#FF0000' : 
                                       '#FFA500',
                                border: `1px solid ${post.status === 'posted' ? 'rgba(0,255,0,0.5)' : 
                                                   post.status === 'failed' ? 'rgba(255,0,0,0.5)' : 
                                                   'rgba(255,165,0,0.5)'}`,
                                textShadow: `0 0 3px ${post.status === 'posted' ? '#00FF00' : 
                                                       post.status === 'failed' ? '#FF0000' : 
                                                       '#FFA500'}`,
                                fontWeight: 600
                              }}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" sx={{ 
                          color: '#00FFFF',
                          mb: 2,
                          fontWeight: 500
                        }}>
                          {post.subreddit}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ 
                          color: '#FFFFFF',
                          mb: 3,
                          opacity: 0.8
                        }}>
                          Posted on {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                        
                        <Divider sx={{ 
                          mb: 2, 
                          borderColor: 'rgba(0,255,255,0.3)'
                        }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Visibility sx={{ fontSize: 18, color: '#00FF00' }} />
                              <Typography variant="body2" sx={{ 
                                color: '#00FF00',
                                fontWeight: 600
                              }}>
                                {post.views.toLocaleString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ThumbUp sx={{ fontSize: 18, color: '#FFFF00' }} />
                              <Typography variant="body2" sx={{ 
                                color: '#FFFF00',
                                fontWeight: 600
                              }}>
                                {post.upvotes}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Comment sx={{ fontSize: 18, color: '#FF00FF' }} />
                              <Typography variant="body2" sx={{ 
                                color: '#FF00FF',
                                fontWeight: 600
                              }}>
                                {post.comments}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        {post.redditUrl && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,255,255,0.2)' }}>
                            <Typography variant="caption" sx={{ 
                              color: '#00FFFF',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              opacity: 0.8
                            }}>
                              <OpenInNew sx={{ fontSize: 14 }} />
                              Click to view on Reddit
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </>
        )}
      </Container>
      <Footer />
    </Box>
  )
} 