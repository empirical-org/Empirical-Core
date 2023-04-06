import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ActivityDetails from '../../../general_components/tooltip/activity_details.jsx';

export default function (percentageDisplayer) {
  const _displayPercentage = percentageDisplayer.run;

  this.generate = function (data) {
    let totalScoreOrNot;
    if (data.percentage == null) {
      totalScoreOrNot = null;
    }

    return ReactDOMServer.renderToString(
      <div className="student-profile-tooltip">
        <div className="title">
          {data.activity.name}
        </div>
        <div className="main">
          <ActivityDetails data={data} />
        </div>
      </div>
    );
  };
}
