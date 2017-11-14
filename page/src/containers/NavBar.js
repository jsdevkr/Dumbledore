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
      loginModal: false
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
    console.log('keyDown');
  }

  async handleRegister(key, botName, password) {
    await createBot(key, botName, password);
    this.setState({
      registerModal: false
    });
  }

  render() {
    const { registerModal, loginModal } = this.state;

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
        <RegisterModal open={registerModal} closeHandler={this.handleClick} handleRegister={this.handleRegister} />
        <LoginModal open={loginModal} closeHandler={this.handleClick} />
      </div>
    );
  }
}

export default NavBar;
