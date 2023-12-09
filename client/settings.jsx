import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom';
import Nav from './components/nav.jsx';
import { ChangeWindow } from './components/auth.jsx';
import { MdStar } from 'react-icons/md';

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
      <h1>{currentUser?.username} {currentUser?.premium ? <MdStar size={36} color='var(--primary)' /> : <></>}</h1>
    </div>
    <div id="settingsBio">
      <textarea id="bio" type="text" name="bio" placeholder={'Tell us about yourself...'} defaultValue={currentUser?.description ?? ''} />
    </div>
    <div id="settingsPrivacy">
      <div id="selectContainer">
        <label htmlFor="privacy">Privacy:</label>
        <div>
          <select name="privacy" id='privacySelect' onChange={(e) => {
            setPrivacyDescription(e.target.value);
          }}>
            <option selected={currentUser?.privacy === 'public'} value="public">public</option>
            <option selected={currentUser?.privacy === 'friendly'} value="friendly">friendly</option>
            <option selected={currentUser?.privacy === 'private'} value="private">private</option>
          </select>
        </div>
      </div>
      <p id="privacyDesc">All users can view your profile</p>
    </div>
    <div id="settingsChange">
      <ChangeWindow></ChangeWindow>
    </div>
    <div id="settingsPremium">
      <button onClick={() => {
        fetch(
          '/account',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({ premium: !currentUser?.premium ?? false }),
          },
        ).then((response) => {
          response.json().then((json) => {
            setCurrentUser(json.user);
          });
        });
      }}>{currentUser?.premium ? 'Unsubscribe from Premium' : 'Subscribe to Premium'}</button>
      <p>Premium gets rid of all advertisements</p>
    </div>
    <button onClick={() => {
      const bio = document.getElementById('bio').value;
      const privacy = document.getElementById('privacySelect').value;
      fetch(
        '/account',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ desc: bio, privacy }),
        },
      ).then((response) => {
        response.json().then((json) => {
          setCurrentUser(json.user);
        });
      });
    }}>Save Changes</button>
  </div>;
};

const init = () => {
  navRoot.render(<Nav isSignedIn={true}></Nav>);
  settingsRoot.render(<SettingsPage></SettingsPage>);
};

window.onload = init;
