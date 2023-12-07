import * as React from 'react';
import * as helper from '../helper.js';

const handleLogin = (e) => {
  e.preventDefault();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;

  if (!username || !pass) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass });

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const pass2 = e.target.querySelector('#pass2').value;

  if (!username || !pass || !pass2) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  if (pass !== pass2) {
    helper.handleError('Passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass, pass2 });

  return false;
};

const handleChange = (e) => {
  e.preventDefault();

  const oldPass = e.target.querySelector('#oldPass').value;
  const newPass = e.target.querySelector('#newPass').value;
  const newPass2 = e.target.querySelector('#newPass2').value;

  if (!oldPass || !newPass || !newPass2) {
    helper.handleError('Password is empty!');
    return false;
  }

  if (newPass !== newPass2) {
    helper.handleError('Wrong password or passwords do not match!');
    return false;
  }

  fetch(
    '/password',
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        oldPassword: oldPass,
        newPassword: newPass,
      }),
    },
  ).then((response) => {
    response.json().then((json) => {
      if (json.error) {
        helper.handleError(json.error);
      }
    });
  });

  e.target.querySelector('#oldPass').value = '';
  e.target.querySelector('#newPass').value = '';
  e.target.querySelector('#newPass2').value = '';

  return false;
};

export const LoginWindow = (props) => (
    <form
      id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
      {...props}
    >
      <div className="mainInput">
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username" />
      </div>

      <div className="mainInput">
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />
      </div>

      <input className="formSubmit" type="submit" value="Sign in" />

      <div id="errorHolder">
        <p id="errorMessage"></p>
      </div>
    </form>
);

export const SignupWindow = (props) => (
  <form
    id="signupForm"
    name="signupForm"
    onSubmit={handleSignup}
    action="/signup"
    method="POST"
    className="mainForm"
    {...props}
  >
    <div className="mainInput">
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
    </div>

    <div className="mainInput">
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
    </div>

    <div className="mainInput">
      <label htmlFor="pass2">Confirm Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
    </div>

    <input className="formSubmit mainInput" type="submit" value="Sign up" />

    <div id="errorHolder">
      <p id="errorMessage"></p>
    </div>
  </form>
);

export const ChangeWindow = (props) => (
  <form
    id="changeForm"
    name="changeForm"
    onSubmit={handleChange}
    action="/password"
    method="POST"
    className="mainForm"
    {...props}
  >
    <div className="mainInput">
      <label htmlFor="oldPass">Old password: </label>
      <input id="oldPass" type="password" name="oldPass" placeholder="old password" />
    </div>

    <div className="mainInput">
      <label htmlFor="newPass">New Password: </label>
      <input id="newPass" type="password" name="newPass" placeholder="new password" />
    </div>

    <div className="mainInput">
      <label htmlFor="newPass2">Confirm Password: </label>
      <input id="newPass2" type="password" name="newPass2" placeholder="retype new password" />
    </div>

    <input className="formSubmit mainInput" type="submit" value="Change Password" />

    <div id="errorHolder">
      <p id="errorMessage"></p>
    </div>
  </form>
);
