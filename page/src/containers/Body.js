import React, { Component } from 'react';
import { Grid, Search, Loader, Sticky } from 'semantic-ui-react';
import _ from 'lodash';
import Table from '../components/Table';
import { getBot, getAllStudent } from '../helper/fetch';
import './Body.css';

class Body extends Component {
  constructor(props) {
    super(props);

    this.state = {
      botIsLoading: false,
      bots: [],
      studentIsLoading: false,
      students: [],
      value: '',
      errMessage: ''
    };

    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  async handleResultSelect(e, { result }) {
    this.setState({
      value: result.botName,
      studentIsLoading: true
    });
    try {
      const students = await getAllStudent(result.id);
      this.setState({ students, studentIsLoading: false });
    } catch (error) {
      this.setState({ errMessage: error.message, studentIsLoading: false });
    }
  }

  async handleSearchChange(e, { value }) {
    this.setState({ botIsLoading: true, value });
    const results = await getBot();
    const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
    const isMatch = result => re.test(result.botName);

    this.setState({
      botIsLoading: false,
      bots: _.filter(results, isMatch),
    });
  }

  render() {
    const {
      botIsLoading, studentIsLoading, value, bots, students, errMessage
    } = this.state;
    const resultRenderer = ({ botName }) => <div className="searchBox">{botName}</div>;
    const studentsTable = students.length > 0 ? <Table data={students} /> : '';

    return (
      <Grid.Row>
        <Grid.Row centered className="search">
          <Sticky>
            <Search
              loading={botIsLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={this.handleSearchChange}
              results={bots}
              value={value}
              input={{ placeholder: 'what is bot name...?' }}
              resultRenderer={resultRenderer}
              fluid
              {...this.props}
            />
          </Sticky>
        </Grid.Row>

        {errMessage}
        <Grid.Row>
          {studentsTable}
          {studentIsLoading ? <Loader active size="big">Loading</Loader> : ''}
        </Grid.Row>
      </Grid.Row>
    );
  }
}

export default Body;
