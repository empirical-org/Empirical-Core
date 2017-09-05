import React from 'react';
import ReactDOMServer from 'react-dom/server';
import TotalScore from '../../../general_components/tooltip/total_score.jsx';
import AboutPremium from '../../../general_components/tooltip/about_premium.jsx';
import ConceptResultStats from '../../../general_components/tooltip/concept_result_stats.jsx';
import ActivityDetails from '../../../general_components/tooltip/activity_details.jsx';

export default function (percentageDisplayer) {
  const _displayPercentage = percentageDisplayer.run;
  this.generate = function (data) {
    let result,
      totalScoreOrNot,
      aboutPremiumOrNot,
      ready,
      body = 'Loading';
    if (data.concept_results) {
      ready = true;
      if (data.percentage == null) {
        totalScoreOrNot = null;
      } else if (data.activity.classification.id === 4 && data.percentage) {
        totalScoreOrNot = <TotalScore diagnostic={Boolean(true)} />;
      } else {
        totalScoreOrNot = <TotalScore percentage={_displayPercentage(data.percentage)} />;
      }

      if ((data.premium_state === 'school') || (data.premium_state === 'paid') || (data.premium_state === 'trial')) {
        aboutPremiumOrNot = null;
      } else {
        aboutPremiumOrNot = <AboutPremium />;
      }
    }

    if (ready) {
      body = (
        <div className="main">
          <ConceptResultStats results={data.concept_results} />
          {totalScoreOrNot}
          <ActivityDetails data={data} />
        </div>
      );
    }

    result = (
      <div className="scorebook-tooltip">
        <div className="title">
          {data.activity.name}
        </div>
        {body}
        {aboutPremiumOrNot}
      </div>
    );
    console.log(ReactDOMServer.renderToString(result));
    return ReactDOMServer.renderToString(result);
  };
}
