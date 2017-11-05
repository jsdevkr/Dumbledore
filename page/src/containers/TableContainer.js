import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import Table from '../components/Table';
import { getBot, getStudent } from '../helper/fetch';
import './TableContainer.css';

class TableContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bots: { isFetching: false, data: '' },
      students: { isFetching: false, data: '' }
    };

    this.fetchBots = this.fetchBots.bind(this);
  }

  componentDidMount() {
    this.fetchBots();
  }

  async fetchBots() {
    this.setState({
      bots: {
        ...this.state.bots,
        isFetching: true
      }
    });

    const bots = await getBot();

    this.setState({
      bots: {
        data: bots,
        isFetching: false
      }
    });
  }

  async fetchStudents() {
    this.setState({
      students: {
        ...this.state.students,
        isFetching: true
      }
    });

    const students = await getStudent();

    this.setState({
      students: {
        data: students,
        isFetching: false
      }
    });
  }

  render() {
    const { bots, students } = this.state;
    const studentTable = students.isFetching ? <Loader active /> : <Table data={students.data} />;

    return (
      <Grid.Row>
        <Grid.Column mobile={14} tablet={6} computer={4}>
          {bots.isFetching || !bots.data ? <Loader active /> : <Table data={bots.data} />}
        </Grid.Column>
        {students.data ? <Grid.Column mobile={14} tablet={6} computer={4}>{studentTable}</Grid.Column> : ''}
      </Grid.Row>
    );
  }
}

export default TableContainer;
