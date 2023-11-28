const mongoose = require('mongoose');

let PostModel = {};

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  data: {
    type: String,
    required: true,
  },
  likes: { type: Number, default: 0 },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.statics.toAPI = (doc) => ({
  _id: doc._id,
  user: doc.user,
  likes: doc.likes,
  createdDate: doc.createdDate,
});

PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;
