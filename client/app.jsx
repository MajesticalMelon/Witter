import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './nav.jsx';

const navRoot = ReactDOM.createRoot(document.getElementById('navContainer'));
const postsRoot = ReactDOM.createRoot(document.getElementById('posts'));
const makePostRoot = ReactDOM.createRoot(document.getElementById('makePost'));

const loadPostsFromServer = async () => {
  const response = await fetch('/posts');
  const data = await response.json();

  postsRoot.render(<AllPosts posts={data.posts} />);
};

const AllPosts = ({ posts, ...rest }) => <div id='postsHolder' style={{
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  width: '800px',
  backgroundColor: 'var(--beige)',
  borderRadius: '8px',
  marginTop: '16px',
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
  navRoot.render(<Nav isSignedIn={true} />);
  postsRoot.render(<AllPosts posts={[]} />);

  loadPostsFromServer();
};

window.onload = init;
