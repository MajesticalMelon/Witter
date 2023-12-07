import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom';
import Nav from './components/nav.jsx';
import { ChangeWindow } from './components/auth.jsx';

const navRoot = createRoot(document.getElementById('navContainer'));
const settingsRoot = createRoot(document.getElementById('settingsContainer'));

const setPrivacyDescription = (privacy) => {
  const desc = document.getElementById('privacyDesc');
  switch (privacy) {
    case 'public':
      desc.innerText = 'All users can view your profile';
      break;
    case 'friendly':
      desc.innerText = 'Only users you follow can view your profile';
      break;
    case 'private':
      desc.innerText = 'No users can view your profile unless you allow them';
      break;
    default:
      break;
  }
};

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
          setPrivacyDescription(json.user.privacy);
        });
      });
    }
  }, [currentUser]);

  return <div id="settings">
    <div id="settingsName">
      <h1>{currentUser?.username}</h1>
    </div>
    <div id="settingsPrivacy">
      <div id="selectContainer">
        <label htmlFor="privacy">Privacy:</label>
        <div>
          <select name="privacy" id='privacySelect' defaultValue={currentUser?.privacy} onChange={(e) => {
            setPrivacyDescription(e.target.value);
          }}>
            <option value="public">public</option>
            <option value="friendly">friendly</option>
            <option value="private">private</option>
          </select>
        </div>
      </div>
      <p id="privacyDesc">All users can view your profile</p>
    </div>
    <div id="settingsChange">
      <ChangeWindow></ChangeWindow>
    </div>
    <button>Save Changes</button>
    </div>;
};

const init = () => {
  navRoot.render(<Nav isSignedIn={true}></Nav>);
  settingsRoot.render(<SettingsPage></SettingsPage>);
};

window.onload = init;
