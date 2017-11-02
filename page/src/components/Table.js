import React from 'react';
import { Table as STable, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Table = ({ data }) => {
  const Body = data.map((el, idx) => {
    return (
      <STable.Row key={el.id}>
        <STable.Cell>{idx + 1}</STable.Cell>
        <STable.Cell>{el.name}</STable.Cell>
        <STable.Cell>{el.point}</STable.Cell>
      </STable.Row>
    );
  });

  return (
    <STable striped>
      <STable.Header>
        <STable.Row>
          <STable.HeaderCell>ranking</STable.HeaderCell>
          <STable.HeaderCell>name</STable.HeaderCell>
          <STable.HeaderCell>point</STable.HeaderCell>
        </STable.Row>
      </STable.Header>
      <STable.Body>
        {Body}
      </STable.Body>
    </STable>
  );
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Table;
