const Recaptcha = require('recaptcha2');

const recaptcha = new Recaptcha({
  siteKey: process.env.RECAPTCHA_SITE_KEY,
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
});

const verifyCaptcha = (req, res, next) => {
  const { captchaToken } = req.body;
  
  console.log('CAPTCHA verification request received');
  console.log('Token length:', captchaToken ? captchaToken.length : 0);
  
  if (!captchaToken) {
    return res.status(400).json({ 
      error: 'CAPTCHA token is required' 
    });
  }

  if (process.env.NODE_ENV === 'development') {
    if (captchaToken === 'test-token' || captchaToken.length > 100) {
      console.log('Development mode: Allowing CAPTCHA token');
      return next();
    }
  }

  console.log('Validating CAPTCHA token...');
  
  recaptcha.validate(captchaToken)
    .then(() => {
      console.log('CAPTCHA validation successful');
      next();
    })
    .catch((errorCodes) => {
      console.log('CAPTCHA validation failed:', errorCodes);
      console.log('Error details:', JSON.stringify(errorCodes, null, 2));
      
      if (process.env.NODE_ENV === 'development' && captchaToken.length > 100) {
        console.log('Development mode: Allowing request despite CAPTCHA validation failure');
        return next();
      }
      
      return res.status(400).json({ 
        error: 'CAPTCHA validation failed. Please try again.' 
      });
    });
};

module.exports = { verifyCaptcha };
