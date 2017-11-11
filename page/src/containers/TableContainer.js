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
    this.fetchStudents = this.fetchStudents.bind(this);
  }

  componentDidMount() {
    this.fetchBots();
  }

  async fetchBots() {
    this.setState({
      bots: {
        data: [],
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

  async fetchStudents(id) {
    await this.setState({
      students: {
        data: [],
        isFetching: true
      }
    });

    const students = await getStudent(id);

    await this.setState({
      students: {
        data: students,
        isFetching: false
      }
    });
  }

  render() {
    const { bots, students } = this.state;
    console.log(bots);
    console.log(students);
    let botsComponent = '';
    let studentsComponent = '';

    if (bots.data) {
      botsComponent = <Grid.Column className="data__table" mobile={14} tablet={6} computer={4}>{bots.isFetching ? <Loader active size="big">Loading</Loader> : <Table data={bots.data} fetchStudents={this.fetchStudents} selectable />}</Grid.Column>;
    }

    if (students.data) {
      studentsComponent = <Grid.Column className="data__table" mobile={14} tablet={6} computer={4}>{students.isFetching ? <Loader active size="medium">Loading</Loader> : <Table data={students.data} />}</Grid.Column>;
    }

    return (
      <Grid.Row>
        {botsComponent}
        {studentsComponent}
      </Grid.Row>
    );
  }
}

export default TableContainer;
