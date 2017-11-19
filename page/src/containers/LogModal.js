import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react';
import LogList from '../components/LogList';
import { getLiveQuery, getUserName } from '../helper/fetch';

class LogModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      logs: []
    };

    this.onLive = this.onLive.bind(this);
    this.onChange = this.onChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onLive() {
    const { token } = this.state;
    if (!token) return;

    getLiveQuery(token).then(subscription => {
      subscription.on('open', () => {
        this.setState({
          logs: [this.logParser('open'), ...this.state.logs]
        });
      });

      subscription.on('create', async object => {
        const user = await getUserName(object.attributes.userId);
        this.setState({
          logs: [this.logParser('point', user, object), ...this.state.logs]
        });
      });
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onKeyDown() {
  }

  logParser(type, user, object) {
    if (type === 'open') return { type: 'open' };

    const { createdAt, amount, op } = object.attributes;

    return {
      userName: user, type, createdAt, amount, op
    };
  }

  closeModal() {
    this.props.closeHandler('logModal');
    this.setState({
      logs: []
    });
  }

  render() {
    const { open } = this.props;
    const { logs, token } = this.state;

    return (
      <Modal id="log__modal" size="tiny" open={open} onClose={this.closeModal}>
        <Header icon="fort awesome" content="live log" />
        <Modal.Content>
          <Form>
            <Form.Field>
              <div className="ui action input">
                <input type="text" id="token" name="token" placeholder="api token..." value={token} onChange={this.onChange} />
                <div className="ui button" onClick={this.onLive} onKeyDown={this.onKeyDown} role="button" tabIndex="0"><Icon loading name="lightning" /></div>
              </div>
            </Form.Field>
          </Form>
          <LogList logs={logs} />
        </Modal.Content>
        <Modal.Actions>
          <Button color="grey" onClick={this.closeModal}>
            <Icon name="close" /> close
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
