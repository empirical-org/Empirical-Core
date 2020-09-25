import React from 'react';
import _ from 'underscore';

import LoadingIndicator from '../shared/loading_indicator';

export default class extends React.Component {
  overviewMiniBuilder = () => {
    this.stateSpecificComponents();
    return (
      <div>
        {this.header()}
        {this.stateSpecificComponents()}
      </div>
    );
  };

  stateSpecificComponents = () => {
    const results = this.props.overviewObj.results;
      const button = this.miniSpecificButton();
      const leftColumn = Object.keys(results);
      const dataRows = _.map(leftColumn, left => (
        <tr key={left}>
          <td className="left-column">{results[left].name}</td>
          <td className="right-column">{Math.round(results[left].score)}%</td>
        </tr>

        ));
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
  };

  miniSpecificButton = () => {
    const header = this.props.overviewObj.header.toLowerCase();
    // this just searches for mention of student, concept, etc, in the header
    // so we can use the queries with minimal meta-data
    const buttonLink = function () {
      if (header.indexOf('student') > -1) {
        return (
          <a href="/teachers/progress_reports/concepts/students">
            <button className="button-white">View All Student Results</button>
          </a>
        );
      } else if (header.indexOf('concept') > -1) {
        return (
          <a href="/teachers/progress_reports/concepts/students">
            <button className="button-white">View All Concept Results</button>
          </a>
        );
      }
    };
    return buttonLink();
  };

  header = () => {
    return (
      <div className="header">
        <h4>{this.props.overviewObj.header}</h4>
        <p>Last 30 Days</p>
      </div>
    );
  };

  render() {
    return (
      <div className={'mini_container results-overview-mini-container col-md-4 col-sm-5 text-center'}>
        <div className={'mini_content '}>
          {this.overviewMiniBuilder()}
        </div>
      </div>
    );
  }
}
