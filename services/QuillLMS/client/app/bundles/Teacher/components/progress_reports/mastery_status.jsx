import React from 'react';
import cutOff from '../../../../modules/proficiency_cutoffs.js';

export default class MasteryStatus extends React.Component {
  circleClass = () => {
    if (this.props.score > cutOff.proficient) {
      return 'circle proficient';
    } else {
      return 'circle not-proficient';
    }
  };

  text = () => {
    if (this.props.score > cutOff.proficient) {
      return 'Proficient';
    } else {
      return 'Not yet proficient';
    }
  };

  render() {
    return (
      <div>
        <div className={this.circleClass()} />
        <span>{this.text()}</span>
      </div>
    );
  }
}
