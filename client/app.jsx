import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './components/nav.jsx';
import { PostWindow, AllPosts } from './components/post.jsx';

const navRoot = ReactDOM.createRoot(document.getElementById('navContainer'));
const postsRoot = ReactDOM.createRoot(document.getElementById('posts'));
const makePostRoot = ReactDOM.createRoot(document.getElementById('makePost'));
const userInfoRoot = ReactDOM.createRoot(document.getElementById('userInfoContainer'));

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

const Ad = () => {
  const [premium, setPremium] = useState(false);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (quote === '') {
      fetch(
        "https://type.fit/api/quotes",
        {
          method: 'GET',
          headers: {
            'Cross-Origin': 'anonymous',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      ).then((response) => {
        response.json().then((json) => {
          const randIndex = Math.floor(Math.random() * json.length);
          setQuote(json[randIndex].text);
        })
      });

      fetch(
        '/premium',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ).then((response) => {
        response.json().then((data) => {
          setPremium(data.isPremium);
        });
      });
    }
  }, [quote, premium])


  return <div id="infoAdContainer">
    <div className="advertisement" style={{ display: premium ? 'none' : 'flex' }}>
      <img src='https://picsum.photos/1000/2000?random=2' crossOrigin='anonymous'></img>
      <p>{quote}</p>
    </div>
  </div>;
}

const init = () => {
  postsRoot.render(<AllPosts posts={[]} />);
  makePostRoot.render(<PostWindow callback={loadPostsFromServer} />);
  userInfoRoot.render(<Ad></Ad>);

  loadPostsFromServer();
};

window.onload = init;
