const AuthenticationController = require('../controllers/authentication.js');
const UserProfileController = require('../controllers/userProfile.js');
const express = require('express');
const passport = require('passport');
const ROLE_MEMBER = require('../config/constants').ROLE_MEMBER;
const ROLE_CLIENT = require('../config/constants').ROLE_CLIENT;
const ROLE_OWNER = require('../config/constants').ROLE_OWNER;
const ROLE_ADMIN = require('../config/constants').ROLE_ADMIN;
const passportService = require('../config/passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

const apiRoutes = express.Router(),
authRoutes = express.Router(),
userProfileRoutes = express.Router()

// Auth Routes

// Set auth routes as subgroup/middleware to apiRoutes
apiRoutes.use('/auth', authRoutes);

// Registration route
authRoutes.post('/register', AuthenticationController.register);

authRoutes.post('/validate', AuthenticationController.aSyncValidation);

// Login route
authRoutes.post('/login', requireLogin, AuthenticationController.login);

// Password reset request route (generate/send token)
authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

// Password reset route (change password using token)
authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);

// get an api key
authRoutes.post('/request-api-key', AuthenticationController.fetchAPIkeys);


// User Routes

// Set user routes as a subgroup/middleware to apiRoutes
apiRoutes.use('/user', userProfileRoutes);

// View user profile route
userProfileRoutes.get('/:userId', requireAuth, UserProfileController.viewProfile);

userProfileRoutes.put('/:userId', requireAuth, UserProfileController.updateProfile);

// Test protected route
apiRoutes.get('/protected', requireAuth, (req, res) => {
res.send({ authenticated: true });

});

apiRoutes.get('/admins-only', requireAuth, AuthenticationController.roleAuthorization(ROLE_ADMIN), (req, res) => {
  res.send({ content: 'Admin dashboard is working.' });
});

module.exports = apiRoutes
