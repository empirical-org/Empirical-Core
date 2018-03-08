import React from 'react'
import createReactClass from 'create-react-class'


export default class ConceptResultTableRow extends React.Component {

  render() {
    return (
      <tr>
      	<td>Concept</td>
      	<td>{<img src={'/images/' + (this.props.concept.correct ? 'green_check' : 'red_x') + '.svg'}/>}
      	</td>
      	<td>{this.props.concept.name}</td>
      </tr>
    );
  }


}
