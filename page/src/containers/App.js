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

    const dummy = new Array(10).fill(undefined).map((e, idx) => (
      {
        id: idx,
        name: `name${idx}`,
        point: `${idx * 100}`
      }
    ));

    this.state = { data: dummy };
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
            <Grid.Column mobile={14} tablet={8} computer={6}>
              <Table data={this.state.data} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
