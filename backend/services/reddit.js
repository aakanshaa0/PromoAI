const snoowrap = require('snoowrap');
const snoostorm = require('snoostorm');

// Reddit API credentials
const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

// Subreddit database categorized by topics
const SUBREDDIT_DB = {
  tech: [
    'technology',
    'tech',
    'gadgets',
    'programming',
    'webdev'
  ],
  cybersecurity: [
    'cybersecurity',
    'hacking',
    'netsec',
    'privacy'
  ],
  startup: [
    'startups',
    'entrepreneur',
    'smallbusiness',
    'sideproject'
  ],
  beauty: [
    'MakeupAddiction',
    'SkincareAddiction',
    'beauty'
  ],
  health: [
    'Fitness',
    'nutrition',
    'mentalhealth'
  ],
  finance: [
    'personalfinance',
    'investing',
    'FIRE'
  ],
  other: [
    'promote',
    'shamelessplug',
    'SomethingIMade'
  ]
};

// Post to relevant subreddits
exports.postToReddit = async (content, categories = ['other'], userRefreshToken) => {
  // Initialize user-specific client
  const userClient = new snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: userRefreshToken
  });

  // Get unique subreddits from all categories
  const subreddits = [...new Set(
    categories.flatMap(cat => SUBREDDIT_DB[cat] || [])
  )];

  const results = [];
  
  for (const subreddit of subreddits) {
    try {
      // Check if the user is subscribed to the subreddit (many subreddits require this)
      const isSubscribed = await userClient.getSubreddit(subreddit).getMySubscription()
        .then(() => true)
        .catch(() => false);

      if (!isSubscribed) {
        results.push({
          subreddit,
          status: 'failed',
          error: 'Not subscribed to subreddit'
        });
        continue;
      }

      // Check subreddit rules and posting requirements
      const subredditInfo = await userClient.getSubreddit(subreddit).fetch();
      
      // Create the submission
      const submission = await userClient.getSubreddit(subreddit).submitLink({
        title: content.title,
        url: content.url,
        text: content.description
      });

      results.push({
        subreddit,
        status: 'success',
        submissionId: submission.id,
        submissionUrl: submission.url
      });

      // Rate limiting - be polite to Reddit's API
      await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute between posts

    } catch (err) {
      results.push({
        subreddit,
        status: 'failed',
        error: err.message
      });
    }
  }

  return {
    success: results.some(r => r.status === 'success'),
    results
  };
};

// Get OAuth URL for user authorization
exports.getAuthUrl = () => {
  const scopes = ['identity', 'submit', 'subscribe', 'read'];
  const redirectUri = process.env.REDDIT_REDIRECT_URI;
  
  return `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=random_state&redirect_uri=${redirectUri}&duration=permanent&scope=${scopes.join(' ')}`;
};

// Exchange code for tokens
exports.getTokensFromCode = async (code) => {
  const r = new snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
  });

  return r.auth({
    code,
    redirectUri: process.env.REDDIT_REDIRECT_URI,
    grantType: 'authorization_code'
  });
};
