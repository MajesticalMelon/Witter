import * as React from 'react';
import * as MdIcon from 'react-icons/md';

const Nav = ({ isSignedIn }) => <div id="navBar"><a href="/witter"><img id="navLogo" src="/assets/img/witter.png" alt="Witter logo" /></a>
  <div className="navlink">
    <a id="homeButton" className="navButton" href="/witter">
      <div id="homeIcon" className='navIcon'><MdIcon.MdHome /></div>
      <div className="navText">
        Home
      </div>
    </a>
  </div>
  {!isSignedIn ? <div className="navlink">
    <a id="loginButton" className="navButton" href="/login">
      <div id="loginIcon" className='navIcon'><MdIcon.MdLogin /></div>
      <div className="navText">
        Login
      </div>
    </a>
  </div> : <></>}
  {!isSignedIn ? <div className="navlink"><a id="signupButton" className="navButton" href="/signup">
    <div id="signupIcon" className='navIcon'><MdIcon.MdOutlineFileUpload /></div>
    <div className="navText">
      Sign up
    </div>
  </a>
  </div>
    : <div className="navlink">
      <a href="/logout" className="navButton">
        <div id="logoutIcon" className='navIcon'><MdIcon.MdLogout /></div>
        <div className="navText">
          Log out
        </div>
      </a>
    </div>}
  {isSignedIn ? <div className="navlink">
    <a id="accountButton" className="navButton" href="/account">
      <div id="accountIcon" className='navIcon'><MdIcon.MdDesktopWindows /></div>
      <div className="navText">
        Account
      </div>
    </a>
  </div> : <></>}
  {isSignedIn ? <div className="navlink">
    <a id="settingsButton" className="navButton" href="/settings">
      <div id="settingsIcon" className='navIcon'><MdIcon.MdSettings /></div>
      <div className="navText">
        Settings
      </div>
    </a>
  </div> : <></>}

  <div className="navlink navBottom">
    <a id="creditsButton" className="navButton" href="/credits">
      <div id="creditsIcon" className='navIcon'><MdIcon.MdInfo /></div>
      <div className="navText">
        Credits
      </div>
    </a>
  </div>
</div>;

Nav.propTypes = {
  isSignedIn: false,
};

export default Nav;
