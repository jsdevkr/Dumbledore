import React from 'react';
import { Button, Header, Icon, Modal, Input } from 'semantic-ui-react';

const LoginModal = () => (
<<<<<<< HEAD
  <Modal id="modal_size" trigger={<div id="login-modal">Sign In</div>} closeIcon>
    <Header icon="fort awesome" content="LogIn" />
    <Modal.Content>
       api-key <Input id="modal_login_key" type="text" name="api-key" placeholder="api key" />
      <p />
       password <Input id="modal_login_pw" type="text" name="password" placeholder="password" />
=======
  <Modal id="modal-size" trigger={<div id="login-modal">Sign In</div>} closeIcon>
    <Header icon="fort awesome" content="LogIn" />
    <Modal.Content>
       api-key <Input id="login_key" type="text" name="api-key" placeholder="api key" />
      <p />
       password <Input id="login_pw" type="text" name="password" placeholder="password" />
>>>>>>> d559303c2a49ca797eed19acac0efe1047296991
    </Modal.Content>
    <Modal.Actions>

      <Button color="black">
        <Icon name="sign in" />LogIn
      </Button>
    </Modal.Actions>
  </Modal>
);

export default LoginModal;
