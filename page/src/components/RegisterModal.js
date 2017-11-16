import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Form, Message } from 'semantic-ui-react';
import './RegisterModal.css';

class registerModal extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: '',
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
      apiKey, botName
    } = this.state;

    handleRegister(apiKey, botName);
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
