import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Form, List, Input } from 'semantic-ui-react';
import { getLiveQuery } from '../helper/fetch';

class LogModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // logs: []
    };
  }

  componentDidMount() {
    this.onLive('xoxb-248266143441-zgzDCId1tMbBG7GKaToXsUi2');
  }

  async onLive(botId) {
    const subscription = await getLiveQuery(botId); // todo: insert botId

    subscription.on('open', () => {
      console.log('socket open');
    });

    subscription.on('update', (object) => {
      console.log(object);
    });

    subscription.on('enter', (object) => {
      console.log(object);
    });

    subscription.on('create', (object) => {
      console.log(object);
    });
  }

  logParser(parseObj) {
    return parseObj.map(e => ({ userName: e.attributes.userName }));
  }

  render() {
    const { open, closeHandler } = this.props;

    return (
      <Modal id="login__modal" size="tiny" open={open} onClose={() => closeHandler('loginModal')}>
        <Header icon="fort awesome" content="live log" />
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input action={{ icon: 'lightning' }} placeholder="api token..." />
            </Form.Field>
          </Form>
          <List divided relaxed className="log__container">
            <List.Item>
              <List.Icon name="angle double up" size="large" verticalAlign="middle" color="green" />
              <List.Content>
                <List.Header as="a">Semantic-Org/Semantic-UI</List.Header>
                <List.Description as="a">Updated 10 mins ago</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="angle double up" size="large" verticalAlign="middle" color="green" />
              <List.Content>
                <List.Header as="a">Semantic-Org/Semantic-UI-Docs</List.Header>
                <List.Description as="a">Updated 22 mins ago</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="angle double down" size="large" verticalAlign="middle" color="red" />
              <List.Content>
                <List.Header as="a">ho1234c has 10 point</List.Header>
                <List.Description as="a">Updated 34 mins ago</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="compress" color="blue" size="large" verticalAlign="middle" />
              <List.Content>
                <List.Header as="a">Connect successfully</List.Header>
                <List.Description as="a">Updated 10 mins ago</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="github" size="large" verticalAlign="middle" />
              <List.Content>
                <List.Header as="a">Semantic-Org/Semantic-UI-Docs</List.Header>
                <List.Description as="a">Updated 22 mins ago</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="github" size="large" verticalAlign="middle" />
              <List.Content>
                <List.Header as="a">Semantic-Org/Semantic-UI-Meteor</List.Header>
                <List.Description as="a">Updated 34 mins ago</List.Description>
              </List.Content>
            </List.Item>
          </List>
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
  }
}

LogModal.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default LogModal;
