import React from 'react'
import ConceptResult from './conceptResult.jsx'
import _ from 'lodash'

export default class conceptResultList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numberOfConceptResults: 1,
      conceptResults: {}
    }

    this.updateConceptResult = this.updateConceptResult.bind(this)
  }

  updateConceptResult(conceptResultUID, conceptResultCorrect) {
    const newConceptResults = Object.assign({}, this.state.conceptResults)
    newConceptResults[conceptResultUID] = conceptResultCorrect
    this.setState({conceptResults: newConceptResults}, () => this.props.updateConceptResults(this.state.conceptResults))
  }

  renderConceptResults() {
    return _.range(this.state.numberOfConceptResults).map((num) => {
      return <ConceptResult updateConceptResult={this.updateConceptResult} key={num}/>
    })
  }

  render() {
    return (
      <div>{this.renderConceptResults()}</div>
    )
  }
}
