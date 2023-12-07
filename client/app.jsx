import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './components/nav.jsx';
import { PostWindow, AllPosts } from './components/post.jsx';

const navRoot = ReactDOM.createRoot(document.getElementById('navContainer'));
const postsRoot = ReactDOM.createRoot(document.getElementById('posts'));
const makePostRoot = ReactDOM.createRoot(document.getElementById('makePost'));

const loadPostsFromServer = async () => {
  const response = await fetch('/posts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  const data = await response.json();
  let likedPosts = [];
  if (data.user) {
    const userResponse = await fetch(`/user/${data.user._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const userData = await userResponse.json();
    likedPosts = userData.user.likedPosts;
  }
  postsRoot.render(
    <AllPosts
      posts={data.posts}
      likedPosts={likedPosts}
      callback={loadPostsFromServer}
    />,
  );
  navRoot.render(<Nav isSignedIn={!!data.user} />);
};

const init = () => {
  postsRoot.render(<AllPosts posts={[]} />);
  makePostRoot.render(<PostWindow callback={loadPostsFromServer} />);

  loadPostsFromServer();
};

window.onload = init;
