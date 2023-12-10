import {
  loginPage,
  login,
  signup,
  getPost,
  getUser,
  makePost,
  userPage,
  logout,
  likePost,
  addFollowing,
  getIsFollowing,
  changePassword,
  updateAccount,
  getIsAllowed,
  addAllowed,
  showUserPage,
  getIsPremium,
} from './controllers/index.js';
import { requiresLogin, requiresLogout, requiresSecure } from './middleware/index.js';

const router = (app) => {
  app.get('/login', requiresSecure, requiresLogout, loginPage);
  app.post('/login', requiresSecure, requiresLogout, login);

  app.get('/signup', requiresSecure, requiresLogout, loginPage);
  app.post('/signup', requiresSecure, requiresLogout, signup);

  app.get('/logout', requiresLogin, logout);

  app.get('/witter', requiresSecure, (req, res) => res.render('app'));

  app.get('/', requiresSecure, (req, res) => res.render('app'));

  app.get('/posts', requiresSecure, getPost);
  app.get('/posts/:user', requiresSecure, getPost);
  app.post('/post', requiresLogin, makePost);

  app.get('/user', requiresSecure, requiresLogin, getUser);
  app.get('/user/:id', requiresSecure, getUser);
  app.get('/users/:id', requiresSecure, showUserPage);
  app.get('/account', requiresSecure, requiresLogin, userPage);

  app.patch('/like/:id', requiresSecure, requiresLogin, likePost);
  app.patch('/follow/:id', requiresSecure, requiresLogin, addFollowing);
  app.get('/follow/:id', requiresSecure, requiresLogin, getIsFollowing);
  app.patch('/allow/:id', requiresSecure, requiresLogin, addAllowed);
  app.get('/allow/:id', requiresSecure, requiresLogin, getIsAllowed);

  app.get('/settings', requiresSecure, requiresLogin, (req, res) => res.render('settings'));
  app.patch('/password', requiresSecure, requiresLogin, changePassword);
  app.patch('/account', requiresSecure, requiresLogin, updateAccount);
  app.get('/premium', requiresSecure, requiresLogin, getIsPremium);

  app.get('/credits', requiresSecure, (req, res) => res.render('credits'));

  app.get('*', requiresSecure, (req, res) => res.render('badGateway'));
};

export default router;
