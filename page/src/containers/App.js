import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import NavBar from '../components/NavBar';
import Table from '../components/Table';
import Header from '../components/Header';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    const botDummy = new Array(10).fill(undefined).map((e, idx) => (
      {
        id: idx,
        name: `bot ${idx}`,
        point: `${idx * 100}`
      }
    )).sort((a, b) => b.point - a.point);

    const studentDummy = new Array(10).fill(undefined).map((e, idx) => (
      {
        id: idx,
        name: `student ${idx}`,
        point: `${idx * 10}`
      }
    )).sort((a, b) => b.point - a.point);

    this.state = { botDummy, studentDummy };
  }

  componentDidMount() {
    // Todo: fetch data
    console.log('cdm');
  }

  render() {
    return (
      <div id="container">
        <NavBar />
        <Grid centered>
          <Grid.Row>
            <Header />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={14} tablet={6} computer={4}>
              <Table data={this.state.botDummy} />
            </Grid.Column>
            <Grid.Column mobile={14} tablet={6} computer={4}>
              <Table data={this.state.studentDummy} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
