import React from 'react'

import PercentageGraph from './percentage_graph'
import CheckboxSection from './checkbox_sections'

import LoadingIndicator from '../shared/loading_indicator'

export default class GettingStartedMini extends React.Component {
  checklistSection() {
    const { checkboxData} = this.props
    if (checkboxData.loading) {
      return <LoadingIndicator />;
    }
    return (
      <CheckboxSection
        checkboxes={checkboxData}
        dashboard
      />
    )
  }

  graphSection() {
    let content;
    const { checkboxData} = this.props
    if (checkboxData.loading) {
      content = <LoadingIndicator />;
    } else {
      content =
      [
        <h3 key='h3-tag'>Getting Started</h3>,
        <PercentageGraph key='percentage-graph' percentage={this.percentageCompleted()} />,
        <a className='green-link' href='/teachers/teacher_guide' key='all-tasks'>View All Tasks</a>
      ]
    }
    return <div id='graph-section'>{content}</div>
  }

  percentageCompleted = () => {
    const { checkboxData} = this.props
    const boxes = checkboxData
    const ratio = boxes.filter(obj => obj.completed).length / boxes.length
    return Math.floor(ratio * 100)
  }

  render() {
    return (
      <div className='mini-content'>
        <div className='row'>
          <div className='col-sm-4'>
            {this.graphSection()}
          </div>
          <div className='col-sm-8'>
            {this.checklistSection()}
          </div>
        </div>
      </div>
    )
  }
}
