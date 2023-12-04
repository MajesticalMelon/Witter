import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './nav.jsx';
import { LoginWindow, SignupWindow } from './windows.jsx';

const navRoot = ReactDOM.createRoot(document.getElementById('navContainer'));
const contentRoot = ReactDOM.createRoot(document.getElementById('content'));

const MainWindow = ({ children }) => <div>
  <img id="mainLogo" src="/assets/img/witter.png" alt="Witter logo" />
  {children}
</div>;

MainWindow.propTypes = {
  children: <></>,
};

const init = () => {
  console.log(window.location.href);
  navRoot.render(<Nav />);
  if (window.location.pathname === '/login') {
    contentRoot.render(<MainWindow><LoginWindow /></MainWindow>);
  } else if (window.location.pathname === '/signup') {
    contentRoot.render(<MainWindow><SignupWindow /></MainWindow>);
  }
};

window.onload = init;
