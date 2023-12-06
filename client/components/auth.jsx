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
    name="loginForm"
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
