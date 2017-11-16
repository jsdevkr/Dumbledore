import React, { Component } from 'react';
import './NavBar.css';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import { createBot } from '../helper/fetch';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerModal: false,
      loginModal: false,
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

  handleKeyDown(e) {
    console.log(e);
  }

  async handleRegister(key, botName) {
    try {
      await createBot(key, botName);
      this.setState({
        registerModal: false
      });
    } catch (error) {
      this.setState({
        registerInfo: error.message
      });
    }
  }

  render() {
    const { registerModal, loginModal, registerInfo } = this.state;

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
            id="login-btn"
            role="button"
            tabIndex={0}
            onClick={() => { this.handleClick('loginModal'); }}
            onKeyDown={this.handleKeyDown}
          >signIn
          </div>
        </div>
        <RegisterModal open={registerModal} closeHandler={this.handleClick} handleRegister={this.handleRegister} info={registerInfo} />
        <LoginModal open={loginModal} closeHandler={this.handleClick} />
      </div>
    );
  }
}

export default NavBar;
