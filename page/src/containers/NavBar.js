import React, { Component } from 'react';
import './NavBar.css';
import LogModal from './LogModal';
import RegisterModal from '../components/RegisterModal';
import { createBot } from '../helper/fetch';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerModal: false,
      logModal: false,
      registerInfo: 'Add a bot https://my.slack.com/services/new/bot and put the token'
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleClick(name) {
    this.setState({
      [name]: !this.state[name]
    });
  }

  handleKeyDown() {
  }

  async handleRegister(key, botName) {
    try {
      await createBot(key, botName);
      this.setState({
        registerModal: false,
        registerInfo: 'Add a bot https://my.slack.com/services/new/bot and put the token'
      });
    } catch (error) {
      this.setState({
        registerInfo: error.message
      });
    }
  }

  render() {
    const { registerModal, logModal, registerInfo } = this.state;

    return (
      <div id="navbar">
        <div id="logo">Dumbledore</div>
        <div id="btn__group">
          <div
            id="register-btn"
            role="button"
            tabIndex={0}
            onClick={() => { this.handleClick('registerModal'); }}
            onKeyDown={this.handleKeyDown}
          >register
          </div>
          <div
            id="log-btn"
            role="button"
            tabIndex={0}
            onClick={() => { this.handleClick('logModal'); }}
            onKeyDown={this.handleKeyDown}
          >live log
          </div>
        </div>
        <RegisterModal open={registerModal} closeHandler={this.handleClick} handleRegister={this.handleRegister} info={registerInfo} />
        <LogModal open={logModal} closeHandler={this.handleClick} />
      </div>
    );
  }
}

export default NavBar;
