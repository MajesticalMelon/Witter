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
  console.log(window.location);
  if (window.location.pathname === '/account') {
    postsRoot.render(<AllPosts posts={data.posts} userId={data.user._id} />);
  } else {
    const id = window.location.pathname.split('/').at(-1);
    postsRoot.render(<AllPosts posts={data.posts} userId={id} />);
  }
  navRoot.render(<Nav isSignedIn={!!data.user} />);
  const postButton = document.getElementById('postButton');
  postButton.style.disabled = !!data.user;
};

const init = () => {
  makePostRoot.render(<PostWindow callback={loadPostsFromServer} />);
  postsRoot.render(<AllPosts posts={[]} />);

  loadPostsFromServer();
};

window.onload = init;
