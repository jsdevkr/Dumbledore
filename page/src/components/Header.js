import React from 'react';
import pictogram from '../../static/pictogram.svg';
import './Header.css';

const Header = () => {
  return (
    <div id="header">
      <img src={pictogram} alt="pictogram" />
    </div>
  );
};

export default Header;
