import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Form, Message } from 'semantic-ui-react';
import './RegisterModal.css';

class registerModal extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: '',
      password: '',
      retype: '',
      botName: '',
      info: 'Add a bot https://my.slack.com/services/new/bot and put the token'
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit() {
    const { handleRegister } = this.props;
    const {
      apiKey, password, botName, retype
    } = this.state;

    if (password === retype) {
      handleRegister(apiKey, botName, password);
    } else {
      this.setState({
        info: 'please check retype password'
      });
    }
  }

  render() {
    const { open, closeHandler } = this.props;
    const { info } = this.state;

    return (
      <Modal id="register__modal" size="mini" open={open} onClose={() => closeHandler('registerModal')}>
        <Header icon="user plus" content="register" />
        <Modal.Content>
          <Form>
            <Message
              icon="help"
              header="before registring..."
              content={info}
            />
            <Form.Field required>
              <label>api key</label>
              <input placeholder="check your slack service" id="key" name="apiKey" onChange={this.onChange} />
            </Form.Field>
            <Form.Field required>
              <label>bot name</label>
              <input placeholder="check your slack service" id="name" name="botName" onChange={this.onChange} />
            </Form.Field>
            <Form.Field required>
              <label>password</label>
              <input placeholder="password" type="password" id="password" name="password" onChange={this.onChange} />
            </Form.Field>
            <Form.Field required>
              <label>retype password</label>
              <input placeholder="retype password" type="password" id="retype-password" name="retype" onChange={this.onChange} />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="grey" onClick={() => closeHandler('registerModal')}>
            <Icon name="cancel" /> cancel
          </Button>
          <Button color="black" onClick={this.onSubmit}>
            <Icon name="fort awesome" /> submit
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

registerModal.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  handleRegister: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default registerModal;
