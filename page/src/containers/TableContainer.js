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
<<<<<<< HEAD
        data: [],
=======
        ...this.state.bots,
>>>>>>> f2acf382545e366346855f49d546f66eb4dbb667
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

<<<<<<< HEAD
  async fetchStudents(id) {
    await this.setState({
      students: {
        data: [],
=======
  async fetchStudents() {
    this.setState({
      students: {
        ...this.state.students,
>>>>>>> f2acf382545e366346855f49d546f66eb4dbb667
        isFetching: true
      }
    });

<<<<<<< HEAD
    const students = await getStudent(id);

    await this.setState({
=======
    const students = await getStudent();

    this.setState({
>>>>>>> f2acf382545e366346855f49d546f66eb4dbb667
      students: {
        data: students,
        isFetching: false
      }
    });
  }

  render() {
    const { bots, students } = this.state;
<<<<<<< HEAD
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
=======
    const studentTable = students.isFetching ? <Loader active /> : <Table data={students.data} />;

    return (
      <Grid.Row>
        <Grid.Column mobile={14} tablet={6} computer={4}>
          {bots.isFetching || !bots.data ? <Loader active /> : <Table data={bots.data} />}
        </Grid.Column>
        {students.data ? <Grid.Column mobile={14} tablet={6} computer={4}>{studentTable}</Grid.Column> : ''}
>>>>>>> f2acf382545e366346855f49d546f66eb4dbb667
      </Grid.Row>
    );
  }
}

export default TableContainer;
