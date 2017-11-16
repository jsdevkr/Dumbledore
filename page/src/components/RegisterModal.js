import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Form, Message } from 'semantic-ui-react';

class registerModal extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: '',
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
      apiKey
    } = this.state;

    handleRegister(apiKey);
  }

  render() {
    const { open, closeHandler, info } = this.props;

    return (
      <Modal id="register__modal" size="tiny" open={open} onClose={() => closeHandler('registerModal')}>
        <Header icon="user plus" content="register" />
        <Modal.Content>
          <Form>
            <Message
              icon="help"
              content={info}
            />
            <Form.Field>
              <label>api key</label>
              <input placeholder="check your slack service" id="token" name="apiKey" onChange={this.onChange} />
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
  open: PropTypes.bool.isRequired,
  info: PropTypes.string.isRequired
};

export default registerModal;
