import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './nav.jsx';
import { PostWindow, AllPosts } from './windows.jsx';

const navRoot = ReactDOM.createRoot(document.getElementById('navContainer'));
const postsRoot = ReactDOM.createRoot(document.getElementById('posts'));
const makePostRoot = ReactDOM.createRoot(document.getElementById('makePost'));

const loadPostsFromServer = async () => {
  const response = await fetch('/posts');
  const data = await response.json();
  postsRoot.render(<AllPosts posts={data.posts} />);
  navRoot.render(<Nav isSignedIn={data.loggedIn} />);
};

const init = () => {
  postsRoot.render(<AllPosts posts={[]} />);
  makePostRoot.render(<PostWindow callback={loadPostsFromServer} />);

  loadPostsFromServer();
};

window.onload = init;
