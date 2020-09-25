import React from 'react';

import LessonRecommendationRow from './lesson_recommendation_row';

import LoadingIndicator from '../../shared/loading_indicator.jsx';

export default class LessonsRecommendations extends React.Component {
  constructor(props) {
    super();
  }

  recommendationRows() {
    return this.sortByPercentage().map(r => <LessonRecommendationRow activityPackId={r.activity_pack_id} assignToWholeClass={this.props.assignToWholeClass} key={r.activity_pack_id} recommendation={r} status={r.status} />);
  }

  sortByPercentage() {
    return this.props.recommendations.sort((a, b) => b.percentage_needing_instruction - a.percentage_needing_instruction);
  }

  render() {
    if (this.props.recommendations && this.props.recommendations.length) {
      return (
        <div className="lesson-recommendations-wrapper" id="lessons-recommendations-wrapper">
          <h2>
            <img alt="class practice logo" src="https://assets.quill.org/images/icons/group-lesson-icon-black.svg" />
            Teacher-Led Activity Recommendations
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
