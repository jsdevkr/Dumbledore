import React from 'react';
import './NavBar.css';
import LoginModal from '../components/LoginModal';
import BotregisterModal from '../components/BotregisterModal';

const NavBar = () => {
  return (
    <div id="navbar">
      Dumbledore

      <div id="botRegister">
        <BotregisterModal />
      </div>

      <div id="login">
        <LoginModal />
      </div>

    </div>
  );
};

export default NavBar;
