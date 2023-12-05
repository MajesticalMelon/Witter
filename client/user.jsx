import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './nav.jsx';
import { PostWindow, AllPosts } from './windows.jsx';

const navRoot = ReactDOM.createRoot(document.getElementById('navContainer'));
const makePostRoot = ReactDOM.createRoot(document.getElementById('makePost'));
const postsRoot = ReactDOM.createRoot(document.getElementById('posts'));
const userInfoRoot = ReactDOM.createRoot(document.getElementById('userInfo'));

const loadPostsFromServer = async () => {
  const response = await fetch('/posts');
  const data = await response.json();
  let likedPosts = [];
  if (data.user) {
    const userResponse = await fetch(`/user/${data.user._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const userData = await userResponse.json();
    likedPosts = userData.user.likedPosts;
  }
  if (window.location.pathname === '/account') {
    postsRoot.render(<AllPosts
      posts={data.posts}
      userId={data.user._id}
      likedPosts={likedPosts}
      callback={loadPostsFromServer}
    />);
  } else {
    const id = window.location.pathname.split('/').at(-1);
    postsRoot.render(<AllPosts
      posts={data.posts}
      userId={id}
      likedPosts={likedPosts}
      callback={loadPostsFromServer}
    />);
  }
  navRoot.render(<Nav isSignedIn={!!data.user} />);
  const postButton = document.getElementById('postButton');
  postButton.style.disabled = !!data.user;
};

const UserInfo = () => <div>User Info</div>;

const init = () => {
  userInfoRoot.render(<UserInfo />);
  if (window.location.pathname === '/account') {
    makePostRoot.render(<PostWindow callback={loadPostsFromServer} />);
  } else {
    document.getElementById('makePost').style.backgroundColor = 'transparent';
  }
  postsRoot.render(<AllPosts posts={[]} />);

  loadPostsFromServer();
};

window.onload = init;
