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
      conceptResultsOrLoadingOrNotCompleted = <LoadingDots loadingMessage={'Loading concept results'} />;
    const actClassId = data.activity ? data.activity.classification.id : data.activity_classification_id;
    if (data.concept_results && data.concept_results.length) {
      conceptResults = true;
      conceptResultsOrLoadingOrNotCompleted = <ConceptResultStats results={data.concept_results} />;
      if (!['trial', 'school', 'paid'].includes(data.premium_state)) {
        aboutPremiumOrNot = <AboutPremium />;
      }
    }
    if (data.percentage == null) {
      totalScoreOrNot = null;
      conceptResultsOrLoadingOrNotCompleted = <span>This activity has not been completed.</span>;
    } else if (actClassId === 4 && data.percentage) {
      totalScoreOrNot = <p style={{ fontSize: '13px', color: '#3b3b3b', }}><strong>100% Complete</strong></p>;
    } else {
      totalScoreOrNot = <p style={{ fontSize: '13px', color: '#3b3b3b', }}><strong>Score:</strong> <span className="percentage">{percentageDisplayer.run(data.percentage)}</span></p>;
    }

    const result = (
      <div className="scorebook-tooltip" style={{ position: 'relative', }}>
        <i className="fa fa-caret-up" />
        <i className="fa fa-caret-up border-color" />
        <div className="title">
          {data.activity.name}
        </div>
        <div className="main">
          <ActivityDetails data={data} />
          {totalScoreOrNot}
          <div className={conceptResults ? 'concept-results' : 'loading flex-row vertically-centered space-around'}>
            {conceptResultsOrLoadingOrNotCompleted}
          </div>
        </div>
        {aboutPremiumOrNot}
      </div>
    );
    return ReactDOMServer.renderToString(result);
  };
}
