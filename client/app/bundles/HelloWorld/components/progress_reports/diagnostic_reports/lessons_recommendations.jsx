import React from 'react';
import LoadingIndicator from '../../shared/loading_indicator.jsx';
import LessonRecommendationRow from './lesson_recommendation_row';
require('../../../../../assets/styles/lesson-recommendations.scss');

export default class LessonsRecommendations extends React.Component {
  constructor(props) {
    super();
  }

  recommendationRows() {
    return this.props.recommendations.map(r => <LessonRecommendationRow key={r.activity_pack_id} activityPackId={r.activity_pack_id} assignToWholeClass={this.props.assignToWholeClass} recommendation={r} />);
  }

  render() {
    if (this.props.recommendations && this.props.recommendations.length) {
      return (
        <div className="lesson-recommendations-wrapper" id="lessons-recommendations-wrapper">
          <h2>
            LOGO: Collaborative Class Lessons Recommendations
          </h2>
          <p>
            Quill Lessons are 30 - 45 minutes whole class collaborative learning sessions. The Quill Lessons tool provides teachers with interactive whole class Quill activities, teacher modeling prompts, and class-wide discussion topics. You can learn more here or try a sample lesson. Quill recommends a whole class Quill Lessons activity when at least 50% of your students in the class need instruction in that area.
          </p>
          <div>
            {this.recommendationRows()}
          </div>
        </div>);
    }
    return <LoadingIndicator />;
  }
}
