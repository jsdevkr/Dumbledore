import React from 'react';
import { Table as STable, Label, Icon, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './Table.css';

const Table = ({ data }) => {
  const [first, second, third] = data.slice(0, 3);

  const firstRow = first ? (
    <STable.Row>
      <STable.Cell><Label className="first-ribbon" ribbon color="yellow"><Icon name="fire" />1st</Label></STable.Cell>
      <STable.Cell>{first.userName}</STable.Cell>
      <STable.Cell>{first.point}</STable.Cell>
    </STable.Row>
  ) : '';
  const secondRow = second ? (
    <STable.Row>
      <STable.Cell><Label className="second-ribbon" ribbon color="grey">2st</Label></STable.Cell>
      <STable.Cell>{second.userName}</STable.Cell>
      <STable.Cell>{second.point}</STable.Cell>
    </STable.Row>
  ) : '';
  const thirdRow = third ? (
    <STable.Row>
      <STable.Cell><Label className="third-ribbon" ribbon color="brown">3rd</Label></STable.Cell>
      <STable.Cell>{third.userName}</STable.Cell>
      <STable.Cell>{third.point}</STable.Cell>
    </STable.Row>
  ) : '';
  const Etc = data.slice(3).map((el, idx) => {
    return (
      <STable.Row key={el.id}>
        <STable.Cell>{idx + 4}</STable.Cell>
        <STable.Cell>{el.userName}</STable.Cell>
        <STable.Cell>{el.point}</STable.Cell>
      </STable.Row>
    );
  });

  return (
    <Grid.Column className="data__table" mobile={14} tablet={6} computer={4}>
      <STable striped unstackable>
        <STable.Header>
          <STable.Row>
            <STable.HeaderCell width={3}>Rank</STable.HeaderCell>
            <STable.HeaderCell>Name</STable.HeaderCell>
            <STable.HeaderCell>Point</STable.HeaderCell>
          </STable.Row>
        </STable.Header>
        <STable.Body>
          {firstRow}
          {secondRow}
          {thirdRow}
          {Etc}
        </STable.Body>
      </STable>
    </Grid.Column>
  );
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
