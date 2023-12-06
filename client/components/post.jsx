import * as React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import * as helper from '../helper.js';

const handlePost = (e, callback) => {
  e.preventDefault();
  const data = e.target.querySelector('#data').value;

  if (!data) {
    helper.handleError('Cannot make a post without logging in');
    return false;
  }

  helper.sendPost(e.target.action, { data }).then(() => callback());

  return false;
};

export const PostWindow = ({ callback, ...rest }) => (
  <form
    id="postForm"
    name="postForm"
    onSubmit={(e) => handlePost(e, callback)}
    action="/post"
    method="POST"
    className='mainForm'
    {...rest}
  >
    <div className="mainInput postInput">
      <textarea id="data" type="text" name="data" placeholder="data" />
    </div>

    <input id="postButton" className="formSubmit mainInput" type="submit" value="Post" />

    <div id="errorHolder">
      <p id="errorMessage"></p>
    </div>
  </form>
);

PostWindow.propTypes = {
  callback: () => null,
};

export const AllPosts = ({
  posts, userId, likedPosts, callback, ...rest
}) => <div id='postsHolder' {...rest}>
    {posts.filter((p) => {
      if (userId) {
        return p.user._id === userId;
      }
      return true;
    }).map((p, i) => {
      const d = new Date(p.createdDate);
      return <div key={i} className='postCard'>
        <div className='postTitle'>
          <a className='userLink' href={`/users/${p.user._id}`}><p className='username'>@{p.user.username}</p></a>
          <p>{d.toLocaleDateString('en-us')}</p>
        </div>
        <p className='postData'>{p.data}</p>
        <div className='likes'>
          <div className='likeButton' onClick={() => {
            fetch(`/like/${p._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
            }).then(() => callback());
          }}>
            {likedPosts.findIndex((l) => l.toString() === p._id.toString()) === -1
              ? <FaRegHeart size={20} color='var(--primary)' />
              : <FaHeart size={20} color='var(--primary)' />
            }
          </div>
          <p>{p.likes}</p>
        </div>
      </div>;
    })}
  </div>;

AllPosts.propTypes = {
  posts: [],
  userId: '',
  likedPosts: [],
  callback: () => null,
};
