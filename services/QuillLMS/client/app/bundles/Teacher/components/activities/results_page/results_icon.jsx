import React from 'react';

import ScoreColor from '../../modules/score_color.js';

const ResultsIcon = ({ activityType, percentage, }) => {
  const backgroundColor = () => {
    if (activityType === 'diagnostic') {
      return { backgroundColor: '#4D8DD9'} // $quill-blue
    }

    const scoreColor = ScoreColor(percentage * 100);
    let color = '#4ea500';
    if (scoreColor === 'red-score-color') {
      color = '#e73030';
    } else if (scoreColor === 'orange-score-color') {
      color = '#eb9911';
    }
    return { backgroundColor: color };
  }

  const imageSrc = () => {
    let img;
    switch (activityType) {
      case 'connect':
        img = 'tool-connect-white.svg'
        break;
      case 'sentence':
        img = 'tool-grammar-white.svg'
        break;
      case 'diagnostic':
        img = 'tool-diagnostic-white.svg'
        break;
      case 'evidence':
        img = 'tool-evidence-white.svg'
        break;
      default:
        img = 'tool-proofreader-white.svg'
    }
    return `${process.env.CDN_URL}/images/icons/s/${img}`
  }

  return (
    <div className="results-icon-container">
      <div className='icon' style={backgroundColor()}>
        <img alt='activity-type' src={imageSrc()} />
      </div>
    </div>
  )
}


export default ResultsIcon
