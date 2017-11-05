import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import Table from '../components/Table';
import { getStudent } from '../helper/fetch';

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
    await this.setState({
      bots: {
        bots: this.state.bots,
        isFetching: true
      }
    });

    const students = await getStudent();

    await this.setState({
      bots: {
        data: students,
        isFetching: false
      }
    });
  }

  render() {
    const { bots, students } = this.state;

    return (
      <Grid.Row>
        <Grid.Column mobile={14} tablet={6} computer={4}>
          {bots.isFetching || !bots.data ? <Loader active /> : <Table data={bots.data} />}
        </Grid.Column>
        <Grid.Column mobile={14} tablet={6} computer={4}>
          {students.isFetching || !students.data ? <Loader active /> : <Table data={students.data} />}
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default TableContainer;
