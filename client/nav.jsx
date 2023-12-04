import * as React from 'react';
import * as MdIcon from 'react-icons/md';

const Nav = ({ isSignedIn }) => <div id="navBar"><a href="/witter"><img id="navLogo" src="/assets/img/witter.png" alt="Witter logo" /></a>
  {!isSignedIn ? <div className="navlink">
    <a id="loginButton" className="navButton" href="/login">
      <div id="loginIcon" className='navIcon'><MdIcon.MdLogin/></div>
      <div className="navText">
        Login
      </div>
    </a>
  </div> : <></>}
  {!isSignedIn ? <div className="navlink"><a id="signupButton" className="navButton" href="/signup">
      <div id="signupIcon" className='navIcon'><MdIcon.MdLogin/></div>
      <div className="navText">
        Sign up
      </div>
    </a>
  </div>
    : <div className="navlink">
    <a href="/logout" className="navButton">
      <div id="logoutIcon" className='navIcon'><MdIcon.MdLogout/></div>
      <div className="navText">
        Log out
      </div>
    </a>
  </div>}
  {isSignedIn ? <div className="navlink">
    <a id="accountButton" className="navButton" href="/account">
      <div id="accountIcon" className='navIcon'><MdIcon.MdDesktopWindows/></div>
      <div className="navText">
        Account
      </div>
    </a>
  </div> : <></>}
</div>;

Nav.propTypes = {
  isSignedIn: false,
  isLoginWindow: false,
};

export default Nav;
