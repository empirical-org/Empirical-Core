import React from 'react'

const ConceptResultTableRow = (
  {
    concept,
  },
) => {
  return (
    <tr>
      <td>Concept</td>
      <td>
        <img alt={concept.correct ? "Green check" : "Red x"} src={'/images/' + (concept.correct ? 'green_check' : 'red_x') + '.svg'} />
      </td>
      <td>{concept.name}</td>
    </tr>
  );
};

export default ConceptResultTableRow;
