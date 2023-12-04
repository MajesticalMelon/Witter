import { Post } from '../models/index.js';

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
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making a post!' });
  }
};

export const getPost = async (req, res) => {
  try {
    const query = { };

    if (req.params.user) {
      query.owner = req.params.user;
    }

    const docs = await Post.find(query).populate('user').select('user data createdDate likes').lean()
      .exec();

    return res.json({ posts: docs, user: req.session.account });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};
