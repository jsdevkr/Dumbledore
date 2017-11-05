import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import TableContainer from './TableContainer';
import './App.css';

class App extends Component {
  componentDidMount() {
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
          <TableContainer />
        </Grid>
      </div>
    );
  }
}

export default App;
