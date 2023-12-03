export const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }

  return next();
};

export const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/');
  }

  return next();
};

export const requiresSecure = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  return next();
};
