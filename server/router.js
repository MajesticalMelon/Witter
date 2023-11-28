const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/witter', mid.requiresSecure, (req, res) => res.render('app'));

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/posts', mid.requiresSecure, controllers.Post.getPost);
  app.get('/posts/:user', mid.requiresSecure, controllers.Post.getPost);
  app.post('/post', mid.requiresLogin, controllers.Post.makePost);
};

module.exports = router;
