import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import moment from 'moment';
import './LogList.css';

const LogList = ({ logs }) => {
  const openType = key => (
    <List.Item key={key}>
      <List.Icon name="compress" color="blue" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header as="a">Connect successfully</List.Header>
      </List.Content>
    </List.Item>);

  const pointType = (log, key) => {
    let icon;
    let color;

    if (log.op === 'increment') {
      icon = 'angle double up';
      color = 'green';
    } else {
      icon = 'angle double down';
      color = 'red';
    }

    return (
      <List.Item key={key}>
        <List.Icon name={icon} size="large" verticalAlign="middle" color={color} />
        <List.Content>
          <List.Header as="a">{`${log.userName} take ${log.amount} point`}</List.Header>
          <List.Description as="a">{`${moment(log.createdAt).fromNow()}`}</List.Description>
        </List.Content>
      </List.Item>);
  };

  return (
    <List divided relaxed className="log__container">
      {logs.map((log, key) => {
        return log.type === 'open' ? openType(key) : pointType(log, key);
      })}
    </List>
  );
};

LogList.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default LogList;
