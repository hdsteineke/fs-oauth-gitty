const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { 
  exchangeCodeForToken, 
  getGithubProfile 
} = require('../services/github');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      // res.json({ code });

      const token = await exchangeCodeForToken(code);
      const githubProfile = await getGithubProfile(token);

      let user = await GithubUser.findByUsername(githubProfile.login);

      if (!user) {
        user = await GithubUser.insert({
          username: githubProfile.login,
          email: githubProfile.email,
          avatar: githubProfile.avatar_url,
        });
      }
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (error) {
      next (error);
    }
  })


  .get('/dashboard', authenticate, async (req, res) => {

    res.json(req.user);
  })


  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully' });
  });
