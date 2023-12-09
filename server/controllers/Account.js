import { Account } from '../models/index.js';

export const loginPage = (req, res) => res.render('login');
export const userPage = (req, res) => res.render('user');

export const showUserPage = async (req, res) => {
  if (req.session.account && req.params.id === req.session.account._id) {
    return res.redirect('/account');
  }

  const user = await Account.findById(req.params.id);

  if (user.privacy === 'friendly') {
    if (!req.session.account) {
      // Cannot view
      return res.status(404);
    }
    const followIndex = user.following.findIndex((f) => f.toString() === req.session.account._id);
    if (followIndex !== -1) {
      return userPage(req, res);
    }
    return res.status(404);
  } if (user.privacy === 'private') {
    if (!req.session.account) {
      return res.status(404);
    }
    const allowedIndex = user.allowedUsers.findIndex(
      (f) => f.toString() === req.session.account._id,
    );
    if (allowedIndex !== -1) {
      return userPage(req, res);
    }
    return res.status(404);
  }

  return userPage(req, res);
};

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
        req.session.account = Account.toAPI(user);

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
    const user = await Account.findById(req.params.id);
    const followingIndex = docs.following.findIndex((f) => f.toString() === req.params.id);
    if (followingIndex === -1) {
      docs.following.push(req.params.id);
      user.followedBy.push(req.session.account._id);
    } else {
      const followedByIndex = user.followedBy.findIndex(
        (f) => f.toString() === req.session.account._id,
      );
      docs.following.splice(followingIndex, 1);
      user.followedBy.splice(followedByIndex, 1);
    }
    await docs.save();
    await user.save();
    req.session.account = Account.toAPI(docs);
    return res.json({ following: docs.following });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Could not friend user!' });
  }
};

export const addAllowed = async (req, res) => {
  try {
    const docs = await Account.findById(req.session.account._id);
    const allowedIndex = docs.allowedUsers.findIndex((f) => f.toString() === req.params.id);
    if (allowedIndex === -1) {
      docs.allowedUsers.push(req.params.id);
    } else {
      docs.allowedUsers.splice(allowedIndex, 1);
    }
    await docs.save();
    req.session.account = Account.toAPI(docs);
    return res.json({ allowed: docs.allowedUsers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Could not friend user!' });
  }
};

export const getIsFollowing = async (req, res) => {
  if (!req.session.account) {
    return res.status(500).json({ error: 'Not logged in!' });
  }

  try {
    const docs = req.session.account;
    const followIndex = docs.following.findIndex((f) => f.toString() === req.params.id);
    return res.json({ isFollowing: followIndex !== -1 });
  } catch (err) {
    console.log(err);
    v
  }
};

export const getIsAllowed = async (req, res) => {
  if (!req.session.account) {
    return res.status(500).json({ error: 'Not logged in!' });
  }

  try {
    const docs = req.session.account;
    const allowIndex = docs.allowedUsers.findIndex((f) => f.toString() === req.params.id);
    return res.json({ isAllowed: allowIndex !== -1 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Not logged in!' });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const docs = await Account.findById(req.session.account._id);

    if (req.body.premium !== undefined) {
      docs.premium = req.body.premium;
    }

    if (req.body.desc) {
      docs.description = req.body.desc;
    }

    if (req.body.privacy) {
      docs.privacy = req.body.privacy;
    }
    await docs.save();
    req.session.account = Account.toAPI(docs);

    return res.json({ user: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Not logged in!' });
  }
};

export const getIsPremium = async (req, res) => {
  if (!req.session.account) {
    return res.status(500).json({ error: 'Not logged in!' });
  }

  try {
    const docs = req.session.account;
    return res.json({ isPremium: !!docs.premium });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Not logged in!' });
  }
};