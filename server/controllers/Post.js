import { Post, Account } from '../models/index.js';

export const makePost = async (req, res) => {
  if (!req.body.data) {
    return res.status(400).json({ error: 'Cannot have an empty post!' });
  }

  const postData = {
    user: req.session.account,
    data: req.body.data,
  };

  try {
    const newPost = new Post(postData);
    await newPost.save();
    return res.status(201).json({ user: newPost.user, post: newPost.data });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making a post!' });
  }
};

export const getPost = async (req, res) => {
  try {
    const query = {};

    if (req.params.user) {
      query.owner = req.params.user;
    }

    let posts = await Post.find(query).populate('user').select('user data createdDate likes').sort({ createdDate: -1 })
      .lean()
      .exec();

    if (req.session.account) {
      posts = posts.filter((p) => {
        if (p.user._id.toString() === req.session.account._id) {
          return true;
        }

        if (p.user.privacy === 'friendly') {
          return p.user.followedBy.findIndex(
            (f) => f.toString() === req.session.account._id,
          ) !== -1;
        }

        if (p.user.privacy === 'private') {
          return p.user.allowedUsers.findIndex(
            (f) => f.toString() === req.session.account._id,
          ) !== -1;
        }

        return true;
      });
    } else {
      posts = posts.filter((p) => p.user.privacy === 'public');
    }

    return res.json({ posts, user: req.session.account });
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

export const likePost = async (req, res) => {
  if (!req.session.account) {
    return res.status(500).json({ error: 'Must be logged in to like a post!' });
  }

  try {
    const user = await Account.findById(req.session.account._id);
    const post = await Post.findById(req.params.id);

    const likedPostIndex = user.likedPosts.findIndex((p) => p.toString() === req.params.id);

    if (likedPostIndex === -1) {
      post.likes++;
      user.likedPosts.push(req.params.id);
    } else {
      post.likes--;
      user.likedPosts.splice(likedPostIndex, 1);
    }

    await post.save();
    await user.save();

    return res.status(200).json({ message: 'Liked post!' });
  } catch (err) {
    return res.status(500).json({ error: 'Cannot find post!' });
  }
};
