import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react';
import './RegisterModal.css';

const registerModal = ({ open, closeHandler }) => (
  <Modal id="register__modal" size="mini" open={open}>
    <Header icon="user plus" content="Bot-register" />
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
        <Form.Field required>
          <label>retype password</label>
          <input placeholder="retype password" id="retype-password" />
        </Form.Field>
      </Form>
    </Modal.Content>
    <Modal.Actions>
      <Button color="grey" onClick={() => closeHandler('registerModal')}>
        <Icon name="cancel" /> cancel
      </Button>
      <Button color="black" >
        <Icon name="fort awesome" /> submit
      </Button>
    </Modal.Actions>
  </Modal>
);

registerModal.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default registerModal;
