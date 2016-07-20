import React from 'react'
import ReactDOMServer from 'react-dom/server';
import TotalScore from '../../../general_components/tooltip/total_score.jsx'
import AboutPremium from '../../../general_components/tooltip/about_premium.jsx'
import ConceptResultStats from '../../../general_components/tooltip/concept_result_stats.jsx'
import ActivityDetails from '../../../general_components/tooltip/activity_details.jsx'


export default function (percentageDisplayer) {

  var _displayPercentage = percentageDisplayer.run

  this.generate = function (data) {
    var result, totalScoreOrNot, aboutPremiumOrNot;

    if (data.percentage == null) {
      totalScoreOrNot = null
    } else {
      totalScoreOrNot = <TotalScore percentage={_displayPercentage(data.percentage)} />
    }

    if ((data.premium_state == 'school') || (data.premium_state == 'paid') || (data.premium_state == 'trial') ) {
      aboutPremiumOrNot = null;
    } else {
      aboutPremiumOrNot = <AboutPremium />;
    }



    result = (
      <div className='scorebook-tooltip'>
        <div className='title'>
          ACTIVITY RESULTS
        </div>
        <div className='main'>
          <ConceptResultStats results={data.concept_results} />
          {totalScoreOrNot}
          <ActivityDetails data={data} />
        </div>
        {aboutPremiumOrNot}
      </div>
    );
    return ReactDOMServer.renderToString(result);
  };
}
