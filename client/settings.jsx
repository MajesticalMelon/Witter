import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom';
import Nav from './components/nav.jsx';

const navRoot = createRoot(document.getElementById('navContainer'));
const settingsRoot = createRoot(document.getElementById('settingsContainer'));

const SettingsPage = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    if (currentUser === undefined) {
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
        response.json().then((json) => {
          setCurrentUser(json.user);
        });
      });
    }
  }, [currentUser]);

  return <div onClick={() => {
    fetch(
      '/password',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          oldPassword: 'New',
          newPassword: 'ahhh',
        }),
      },
    ).then((response) => {
      console.log(response);
    });
  }}>AHHHHHHH</div>;
};

const init = () => {
  navRoot.render(<Nav isSignedIn={true}></Nav>);
  settingsRoot.render(<SettingsPage></SettingsPage>);
};

window.onload = init;
