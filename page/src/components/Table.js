import React from 'react';
import { Table as STable, Label, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Table = ({ data }) => {
  const [first, second, third] = data.slice(0, 3);
  const firstRow = (
    <STable.Row>
      <STable.Cell><Label className="first-ribbon" ribbon color="yellow"><Icon name="fire" />1st</Label></STable.Cell>
      <STable.Cell>{first.name}</STable.Cell>
      <STable.Cell>{first.point}</STable.Cell>
    </STable.Row>
  );
  const secondRow = (
    <STable.Row>
      <STable.Cell><Label className="second-ribbon" ribbon color="grey">2st</Label></STable.Cell>
      <STable.Cell>{second.name}</STable.Cell>
      <STable.Cell>{second.point}</STable.Cell>
    </STable.Row>
  );
  const thirdRow = (
    <STable.Row>
      <STable.Cell><Label className="third-ribbon" ribbon color="brown">3rd</Label></STable.Cell>
      <STable.Cell>{third.name}</STable.Cell>
      <STable.Cell>{third.point}</STable.Cell>
    </STable.Row>
  );
  const Etc = data.slice(3).map(el => {
    return (
      <STable.Row key={el.id}>
        <STable.Cell>{el.id + 1}</STable.Cell>
        <STable.Cell>{el.name}</STable.Cell>
        <STable.Cell>{el.point}</STable.Cell>
      </STable.Row>
    );
  });

  return (
    <STable striped unstackable selectable>
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
  );
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Table;
