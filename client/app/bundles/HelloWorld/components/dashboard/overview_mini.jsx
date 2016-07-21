'use strict'

 import React from 'react'
 import LoadingIndicator from '../shared/loading_indicator'


 export default React.createClass({

  overviewMiniBuilder: function() {
    this.stateSpecificComponents();
    return (
      <div>
        {this.header()}
        {this.stateSpecificComponents()}
      </div>
    );
  },

  stateSpecificComponents: function() {
    var results = this.props.overviewObj.results;
    if (results === 'insufficient data') {
      return <img src={this.props.overviewObj.placeholderImg}/>;
    } else if (results) {
      var button = this.miniSpecificButton();
      var leftColumn = Object.keys(results);
      var dataRows = _.map(leftColumn, function(left) {
        return (
          <tr key={left}>
            <td className="left-column">{left}</td>
            <td className="right-column">{results[left]}%</td>
          </tr>

        );
      });
      return (
        <div>
          <table>
            <tbody>
              {dataRows}
            </tbody>
          </table>
          {button}
        </div>
      );
    } else {
      return (<LoadingIndicator/>);
    }
  },

  miniSpecificButton: function() {
    var header = this.props.overviewObj.header.toLowerCase();
    // this just searches for mention of student, concept, etc, in the header
    // so we can use the queries with minimal meta-data
    var buttonLink = function() {
      if (header.indexOf('student') > -1)
        return (
          <a href="/teachers/progress_reports/concepts/students">
            <button className='button-white'>View All Student Results</button>
          </a>
        );
      else if (header.indexOf('concept') > -1) {
        return (
          <a href="/teachers/progress_reports/standards/classrooms">
            <button className='button-white'>View All Concept Results</button>
          </a>
        );
      }
    };
    return buttonLink();
  },

  header: function() {
    return (
      <div className='header'>
        <h4>{this.props.overviewObj.header}</h4>
        <p>All Time</p>
      </div>
    );
  },

  render: function() {
    return (
      <div className={"mini_container results-overview-mini-container col-md-4 col-sm-5 text-center"}>
        <div className ={"mini_content "}>
          {this.overviewMiniBuilder()}
        </div>
      </div>
    );
  }
});
