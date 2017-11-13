import React, { Component } from 'react';
import { Grid, Search } from 'semantic-ui-react';
import _ from 'lodash';
import { getBot } from '../helper/fetch';

class Body extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      results: [],
      value: ''
    };

    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleResultSelect(e, { result }) {
    this.setState({ value: result.botName });
  }

  async handleSearchChange(e, { value }) {
    this.setState({ isLoading: true, value });
    const results = await getBot();
    const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
    const isMatch = result => re.test(result.botName);

    this.setState({
      isLoading: false,
      results: _.filter(results, isMatch),
    });
  }

  render() {
    const { isLoading, value, results } = this.state;
    const resultRenderer = ({ botName }) => <div>{botName}</div>;

    return (
      <Grid.Row>
        <Search
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={this.handleSearchChange}
          results={results}
          value={value}
          input={{ placeholder: 'what is bot name...?' }}
          fluid
          resultRenderer={resultRenderer}
        />
      </Grid.Row>
    );
  }
}

export default Body;
