import React from 'react';
import { Statistic, Image } from 'semantic-ui-react';
import pictogram from '../../static/pictogram.svg';
import './Header.css';

const Header = () => {
  return (
    <div id="header">
      <Image src={pictogram} alt="pictogram" centered />
      <Statistic>
        <Statistic.Value text>
          Dumbledor
        </Statistic.Value>
        <Statistic.Label>
          Welcome To <br />The Hogwarts
        </Statistic.Label>
      </Statistic>
    </div>
  );
};

export default Header;
