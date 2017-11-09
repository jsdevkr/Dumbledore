import React from 'react';
import { Button, Header, Icon, Modal, Input } from 'semantic-ui-react';

const BotregisterModal = () => (
  <Modal id="modal_size" trigger={<div id="botregister-modal">Bot register</div>} closeIcon>
    <Header icon="user plus" content="Bot-register" />
    <Modal.Content>
       Bot-name <Input id="modal_bot_name" type="text" name="name" placeholder="bot-name" />
      <p />
       Password <Input id="modal_bot_pw" type="text" name="name" placeholder="password" />
      <p />
       Email <Input id="modal_bot_email" type="text" name="name" placeholder="Email" />
    </Modal.Content>
    <Modal.Actions>
      <Button color="grey">
        <Icon name="cancel" /> cancel
      </Button>
      <Button color="black" >
        <Icon name="fort awesome" /> register
      </Button>
    </Modal.Actions>
  </Modal>
);

export default BotregisterModal;
