import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react';
import './LoginModal.css';

const LoginModal = ({ open, closeHandler }) => (
  <Modal id="login__modal" size="mini" open={open}>
    <Header icon="fort awesome" content="LogIn" />
    <Modal.Content>
      <Form>
        <Form.Field required>
          <label>api key</label>
          <input placeholder="api key" id="key" />
        </Form.Field>
        <Form.Field required>
          <label>password</label>
          <input placeholder="password" id="password" />
        </Form.Field>
      </Form>
    </Modal.Content>
    <Modal.Actions>
      <Button color="grey" onClick={() => closeHandler('loginModal')}>
        <Icon name="cancel" /> cancel
      </Button>
      <Button color="black" >
        <Icon name="fort awesome" /> submit
      </Button>
    </Modal.Actions>
  </Modal>
);

LoginModal.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default LoginModal;
