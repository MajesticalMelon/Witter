import { Account } from '../models/index.js';

export const loginPage = (req, res) => res.render('login');
export const userPage = (req, res) => res.render('user');

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

export const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/witter' });
  });
};

export const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({
      username, password: hash, privacy: 'public',
    });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/witter' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }

    return res.status(500).json({ error: 'An error occurred!' });
  }
};

export const changePassword = async (req, res) => {
  try {
    if (!req.body.oldPassword || !req.body.newPassword) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(
      req.session.account.username,
      req.body.oldPassword,
      async (err, account) => {
        if (err || !account) {
          return res.status(400).json({ error: 'Wrong password or passwords do not match!' });
        }

        const user = await Account.findById(req.session.account._id);
        user.password = await Account.generateHash(req.body.newPassword);
        await user.save();

        return res.json({ redirect: '/settings' });
      },
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export const getUser = async (req, res) => {
  try {
    if (req.params.id) {
      const docs = await Account.findById(req.params.id).populate('following');
      return res.json({ user: docs });
    }
    const docs = await Account.findById(req.session.account._id).populate('following');
    return res.json({ user: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving user!' });
  }
};

export const addFollowing = async (req, res) => {
  try {
    const docs = await Account.findById(req.session.account._id);
    const followingIndex = docs.following.findIndex((f) => f.toString() === req.params.id);
    if (followingIndex === -1) {
      docs.following.push(req.params.id);
    } else {
      docs.following.splice(followingIndex, 1);
    }
    await docs.save();
    return res.json({ following: docs.following });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Could not friend user!' });
  }
};

export const getIsFollowing = async (req, res) => {
  try {
    const docs = await Account.findById(req.session.account._id);
    const followIndex = docs.following.findIndex((f) => f.toString() === req.params.id);
    return res.json({ isFollowing: followIndex !== -1 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Not logged in!' });
  }
};
