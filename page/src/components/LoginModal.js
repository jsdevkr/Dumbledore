import React from 'react';
import { Button, Header, Icon, Modal, Input } from 'semantic-ui-react';

const LoginModal = () => (
  <Modal id="modal-size" trigger={<div id="login-modal">Sign In</div>} closeIcon>
    <Header icon="fort awesome" content="LogIn" />
    <Modal.Content>
       api-key <Input id="login_key" type="text" name="api-key" placeholder="api key" />
      <p />
       password <Input id="login_pw" type="text" name="password" placeholder="password" />
    </Modal.Content>
    <Modal.Actions>

      <Button color="black">
        <Icon name="sign in" />LogIn
      </Button>
    </Modal.Actions>
  </Modal>
);

export default LoginModal;
