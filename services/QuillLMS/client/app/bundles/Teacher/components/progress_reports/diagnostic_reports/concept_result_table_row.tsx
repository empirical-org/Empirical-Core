import React from 'react';
import Concept from '../../../../interfaces/concept.ts';

interface ConceptResultTableRowProps {
  concept: Concept
}

const ConceptResultTableRow: React.SFC<ConceptResultTableRowProps> = (props) => {
  const { concept } = props;
  const { correct, name } = concept;
  return (
    <tr>
      <td>Concept</td>
      <td><img alt="" src={'/images/' + (correct ? 'green_check' : 'red_x') + '.svg'} /></td>
      <td>{name}</td>
    </tr>
  );
}

export default ConceptResultTableRow;
