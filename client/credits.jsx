import React from 'react';
import { createRoot } from 'react-dom';
import Nav from './components/nav.jsx';

const navRoot = createRoot(document.getElementById('navContainer'));

window.onload = () => {
  fetch(
    '/user',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  ).then((response) => {
    response.json().then((data) => {
      navRoot.render(<Nav isSignedIn={!!data.user}></Nav>)
    });
  }).catch((err) => {
    navRoot.render(<Nav isSignedIn={false}></Nav>)
  });

}