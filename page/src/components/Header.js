import React from 'react';
import { Statistic, Image } from 'semantic-ui-react';
import character from '../../static/character.svg';
import './Header.css';

const Header = () => {
  return (
    <div id="header">
      <Image src={character} alt="character" centered />
      <Statistic>
        <Statistic.Value text>
          Dumbledore
        </Statistic.Value>
        <Statistic.Label>
          Welcome To <br />The Hogwarts
        </Statistic.Label>
      </Statistic>
    </div>
  );
};

export default Header;
