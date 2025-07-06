const snoowrap = require('snoowrap');
const snoostorm = require('snoostorm');

// Domain validation - only allow trusted domains
const ALLOWED_DOMAINS = [
  'github.com', 'producthunt.com', 'indiehackers.com', 'dev.to',
  'medium.com', 'hashnode.dev', 'substack.com', 'notion.so',
  'figma.com', 'canva.com', 'notion.so', 'airtable.com'
];

//Posting limits based on user type
const POST_LIMITS = {
  newUsers: 1,
  verifiedUsers: 3
};

const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

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
    'SideProject',
    'Entrepreneur',
    'startups',
    'smallbusiness',
    'webdev',
    'programming'
  ]
};

const validateDomain = (url) => {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return ALLOWED_DOMAINS.some(allowed => domain.includes(allowed));
  } catch (err) {
    return false;
  }
};

const checkPostingLimits = async (userRefreshToken) => {
  return true;
};

exports.postToReddit = async (content, categories = ['other'], userRefreshToken) => {
  if (!validateDomain(content.url)) {
    return {
      success: false,
      results: [{
        subreddit: 'all',
        status: 'failed',
        error: 'Domain not allowed by Reddit. Try using GitHub, ProductHunt, or other trusted platforms.'
      }]
    };
  }

  if (!await checkPostingLimits(userRefreshToken)) {
    return {
      success: false,
      results: [{
        subreddit: 'all',
        status: 'failed',
        error: 'Posting limit reached. Try again in an hour.'
      }]
    };
  }

  const userClient = new snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: userRefreshToken
  });

  const subreddits = [...new Set(
    categories.flatMap(cat => SUBREDDIT_DB[cat] || [])
  )];

  //Limit to max 3 subreddits to speed up posting
  const subredditsToPost = subreddits.slice(0, 3);

  const results = [];
  let successCount = 0;
  let failureCount = 0;
  
  for (const subreddit of subredditsToPost) {
    try {
      //First, verify the subreddit exists and is accessible
      let subredditInfo;
      try {
        subredditInfo = await userClient.getSubreddit(subreddit).fetch();
      } catch (fetchErr) {
        results.push({
          subreddit,
          status: 'failed',
          error: 'Subreddit does not exist or is not accessible'
        });
        continue;
      }

      //Check if subreddit allows submissions
      if (subredditInfo.subreddit_type === 'private' || subredditInfo.subreddit_type === 'restricted') {
        results.push({
          subreddit,
          status: 'failed',
          error: 'Subreddit is private or restricted'
        });
        continue;
      }

      //Check if the user is subscribed to the subreddit (many subreddits require this)
      const isSubscribed = await userClient.getSubreddit(subreddit).getMySubscription()
        .then(() => true)
        .catch(() => false);

      if (!isSubscribed) {
        //Automatically subscribe to the subreddit
        try {
          await userClient.getSubreddit(subreddit).subscribe();
          console.log(`Subscribed to r/${subreddit}`);
        } catch (subscribeErr) {
          console.log(`Failed to subscribe to r/${subreddit}:`, subscribeErr.message);
          results.push({
            subreddit,
            status: 'failed',
            error: 'Could not subscribe to subreddit'
          });
          continue;
        }
      }

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
      successCount++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (err) {
      let errorMessage = err.message;
      
      //Handle common Reddit filtering issues
      if (err.message.includes('removed by Reddit') || err.message.includes('filtered')) {
        errorMessage = 'Post was filtered by Reddit (try posting manually first)';
      } else if (err.message.includes('rate limit') || err.message.includes('too many')) {
        errorMessage = 'Rate limited by Reddit (try again later)';
      } else if (err.message.includes('forbidden') || err.message.includes('not allowed')) {
        errorMessage = 'Subreddit does not allow this type of post';
      }
      
      results.push({
        subreddit,
        status: 'failed',
        error: errorMessage
      });
      failureCount++;
      
      //If we have had 2 failures in a row, stop trying to avoid wasting time
      if (failureCount >= 2 && successCount === 0) {
        break;
      }
    }
  }

  return {
    success: results.some(r => r.status === 'success'),
    results
  };
};

//Get OAuth URL for user authorization
exports.getAuthUrl = () => {
  const scopes = ['identity', 'submit', 'subscribe', 'read'];
  const redirectUri = process.env.REDDIT_REDIRECT_URI;
  
  return `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=random_state&redirect_uri=${redirectUri}&duration=permanent&scope=${scopes.join(' ')}`;
};

//Exchange code for tokens
exports.getTokensFromCode = async (code) => {
  const r = await snoowrap.fromAuthCode({
    code,
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    redirectUri: process.env.REDDIT_REDIRECT_URI
  });
  return {
    accessToken: r.accessToken,
    refreshToken: r.refreshToken,
    snoowrapInstance: r
  };
};
