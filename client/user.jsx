import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './nav.jsx';
import { PostWindow, AllPosts } from './windows.jsx';

const navRoot = ReactDOM.createRoot(document.getElementById('navContainer'));
const makePostRoot = ReactDOM.createRoot(document.getElementById('makePost'));
const postsRoot = ReactDOM.createRoot(document.getElementById('posts'));

const loadPostsFromServer = async () => {
  const response = await fetch('/posts');
  const data = await response.json();

  postsRoot.render(<AllPosts posts={data.posts} />);
  navRoot.render(<Nav isSignedIn={data.loggedIn} />);
};

const init = () => {
  if (window.location.pathname === '/account') {
    makePostRoot.render(<PostWindow callback={loadPostsFromServer} />);
  }
  postsRoot.render(<AllPosts posts={[]} />);

  loadPostsFromServer();
};

window.onload = init;
