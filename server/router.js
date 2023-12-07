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
  app.get('/users/:id', requiresSecure, (req, res) => {
    if (req.session.account && req.params.id === req.session.account._id) {
      return res.redirect('/account');
    }
    return userPage(req, res);
  });
  app.get('/account', requiresSecure, requiresLogin, userPage);

  app.patch('/like/:id', requiresSecure, requiresLogin, likePost);
  app.patch('/follow/:id', requiresSecure, requiresLogin, addFollowing);
  app.get('/follow/:id', requiresSecure, requiresLogin, getIsFollowing);

  app.get('/settings', requiresSecure, requiresLogin, (req, res) => res.render('settings'));
  app.patch('/password', requiresSecure, requiresLogin, changePassword);
};

export default router;
