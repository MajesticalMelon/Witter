import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './nav.jsx';
import { PostWindow } from './windows.jsx';

const navRoot = ReactDOM.createRoot(document.getElementById('navContainer'));
const makePostRoot = ReactDOM.createRoot(document.getElementById('makePost'));
const postsRoot = ReactDOM.createRoot(document.getElementById('posts'));

const loadPostsFromServer = async () => {
  const response = await fetch('/posts');
  const data = await response.json();

  postsRoot.render(<AllPosts posts={data.posts} />);
};

const AllPosts = ({ posts, ...rest }) => <div style={{
  display: 'flex', flexDirection: 'column', alignContent: 'center', width: '800px',
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
  navRoot.render(<Nav />);

  if (window.location.pathname === '/account') {
    makePostRoot.render(<PostWindow callback={loadPostsFromServer} />);
  }
  postsRoot.render(<AllPosts posts={[]} />);

  loadPostsFromServer();
};

window.onload = init;
