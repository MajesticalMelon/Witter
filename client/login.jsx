import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './components/nav.jsx';
import { LoginWindow, SignupWindow } from './components/auth.jsx';

const navRoot = ReactDOM.createRoot(document.getElementById('navContainer'));
const formsRoot = ReactDOM.createRoot(document.getElementById('forms'));

const MainWindow = ({ children }) => <div id="mainWindow">
  <img id="mainLogo" src="/assets/img/witter.png" alt="Witter logo" />
  {children}
</div>;

MainWindow.propTypes = {
  children: <></>,
};

const init = () => {
  navRoot.render(<Nav isSignedIn={false} />);
  if (window.location.pathname === '/signup') {
    formsRoot.render(<MainWindow><SignupWindow /></MainWindow>);
  } else {
    formsRoot.render(<MainWindow><LoginWindow /></MainWindow>);
  }
};

window.onload = init;
