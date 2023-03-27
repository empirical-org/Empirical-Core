'use strict'
import React from 'react';
import ScoreColor from '../../modules/score_color.js';

export default class ResultsIcon extends React.Component {
  backgroundColor = () => {
    const scoreColor = this.scoreColor();
    let color = '#4ea500';
    if (scoreColor === 'red-score-color') {
      color = '#e73030';
    } else if (scoreColor === 'yellow-score-color') {
      color = '#eb9911';
    }
    return { backgroundColor: color };
  }

  imageSrc = () => {
    const { activityType, } = this.props
    let img;
    switch (activityType) {
      case 'connect':
        img = 'tool-connect-white.svg'
        break;
      case 'sentence':
        img = 'tool-grammar-white.svg'
        break;
      default:
        img = 'tool-proofreader-white.svg'
    }
    return `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/tools/${img}`
  }

  scoreColor = () => {
    const { percentage, } = this.props
    return ScoreColor(percentage * 100);
  }

  text = () => {
    const { percentage, } = this.props
    let text = 'Not yet proficient'

    if (percentage > 0.8) {
      text = 'Proficient'
    } else if (percentage > 0.6) {
      text = 'Nearly proficient'
    }

    return text
  }

  render() {
    return (
      <div className="results-icon-container">
        <div className='icon' style={this.backgroundColor()}>
          <img alt='activity-type' src={this.imageSrc()} />
        </div>
        <span>{this.text()}</span>
      </div>
    )
  }
}
