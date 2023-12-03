import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as helper from './helper';

const makePostRoot = ReactDOM.createRoot(document.getElementById('makePost'));
const postsRoot = ReactDOM.createRoot(document.getElementById('posts'));

const loadPostsFromServer = async () => {
  const response = await fetch('/posts');
  const data = await response.json();

  postsRoot.render(<AllPosts posts={data.posts} />);
};

const handlePost = (e) => {
  e.preventDefault();
  const data = e.target.querySelector('#data').value;

  if (!data) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  helper.sendPost(e.target.action, { data }).then(() => loadPostsFromServer());

  return false;
};

const PostWindow = (props) => (
  <form
    id="postForm"
    name="postForm"
    onSubmit={handlePost}
    action="/post"
    method="POST"
    className='mainForm'
    {...props}
  >
    <div className="mainInput">
      <label htmlFor="data">Post: </label>
      <textarea id="data" type="text" name="data" placeholder="data" />
    </div>

    <input className="formSubmit mainInput" type="submit" value="Post" />
  </form>
);

const AllPosts = ({ posts, ...rest }) => <div style={{
  display: 'flex', flexDirection: 'column', alignContent: 'center', width: '800px', overflow: 'hidden',
}} {...rest}>
    {posts.map((p, i) => <div key={i} className='postCard'>
        <div className='postTitle'>
          <a href={`/users/${p.user._id}`}><h3 className='username'>@{p.user.username}</h3></a>
          <p>{p.createdDate}</p>
        </div>
        <p className='postData'>{p.data}</p>
      </div>)}
  </div>;

AllPosts.propTypes = {
  posts: [],
};

const init = () => {
  if (window.location.pathname === '/account') {
    makePostRoot.render(<PostWindow />);
  }
  postsRoot.render(<AllPosts posts={[]} />);

  loadPostsFromServer();
};

window.onload = init;
