import React from 'react';
import ReactDOMServer from 'react-dom/server';
import AboutPremium from '../../../general_components/tooltip/about_premium.jsx';
import ConceptResultStats from '../../../general_components/tooltip/concept_result_stats.jsx';
import ActivityDetails from '../../../general_components/tooltip/activity_details.jsx';
import LoadingDots from '../../../shared/loading_dots.jsx';

export default function (percentageDisplayer) {
  this.generate = function (data) {
    let totalScoreOrNot,
      aboutPremiumOrNot,
      conceptResults,
      conceptResultsOrLoading = <LoadingDots loadingMessage={'Loading concept results'} />;
    if (data.concept_results && data.concept_results.length) {
      conceptResults = true;
      conceptResultsOrLoading = <ConceptResultStats results={data.concept_results} />;
    }
    if (data.percentage == null) {
      totalScoreOrNot = null;
    } else if (data.activity.classification.id === 4 && data.percentage) {
      totalScoreOrNot = <p style={{ fontSize: '13px', color: '#3b3b3b', }}><strong>100% Complete</strong></p>;
    } else {
      totalScoreOrNot = <p style={{ fontSize: '13px', color: '#3b3b3b', }}><strong>Score:</strong> <span className="percentage">{percentageDisplayer.run(data.percentage)}</span></p>;
    }
    if ((data.premium_state === 'school') || (data.premium_state === 'paid') || (data.premium_state === 'trial')) {
      aboutPremiumOrNot = null;
    } else {
      aboutPremiumOrNot = <AboutPremium />;
    }
    const result = (
      <div className="scorebook-tooltip">
        <div className="title">
          {data.activity.name}
        </div>
        <div className="main">
          <ActivityDetails data={data} />
          {totalScoreOrNot}
          <div className={conceptResults ? 'concept-results' : 'loading flex-row vertically-centered space-around'}>
            {conceptResultsOrLoading}
          </div>
        </div>
        {aboutPremiumOrNot}
      </div>
    );
    return ReactDOMServer.renderToString(result);
  };
}
