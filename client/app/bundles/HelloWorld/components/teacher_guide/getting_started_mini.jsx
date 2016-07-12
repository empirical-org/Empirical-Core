'use strict'

import React from 'react'
import PercentageGraph from './percentage_graph'
import CheckboxSection from './checkbox_sections'
import LoadingIndicator from '../shared/loading_indicator'

export default React.createClass({
  propTypes: {
    checkboxData: React.PropTypes.array.isRequired
  },

  percentageCompleted: function(){
    var boxes = this.props.checkboxData;
    var ratio = boxes.filter(obj => obj.completed === true).length / boxes.length;
    var percentage = Math.floor(ratio * 100);
    return percentage;
  },

  graphSection: function(){
    var content;
    if (this.props.checkboxData.loading) {
      content = <LoadingIndicator/>;
    } else {
      content =
        [<h3 key='h3-tag'>Getting Started</h3>,
        <PercentageGraph key='percentage-graph' percentage={this.percentageCompleted()}/>,
        <a className='green-link' key='all-tasks' href='/teachers/teacher_guide'>View All Tasks ></a>]
    }
    return <div id='graph-section'>{content}</div>
  },

  checklistSection: function() {
    var content;
    if (this.props.checkboxData.loading) {
      content = <LoadingIndicator/>;
    } else {
       content = <CheckboxSection checkboxes={this.props.checkboxData} dashboard={true}/>};
   return content;
  },


  render: function() {
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
  );

  }



});
