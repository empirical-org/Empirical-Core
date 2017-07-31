import React from 'react';
import LoadingIndicator from '../../shared/loading_indicator.jsx';

export default class LessonsRecommendationRow extends React.Component {
  constructor(props) {
    super();
    this.state = { expanded: false, };
    this.assignLessonPack = this.assignLessonPack.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  assignLessonPack() {
    this.props.assignLessonPack(this.props.activity_pack_id);
  }

  toggleExpand() {
    this.setState({ expanded: !this.state.expanded, });
  }

  renderExpandedSection() {
    const rec = this.props.recommendation;
    const activities = rec.activities.map((act, index) => (
      <div key={rec.url} className="activity-row flex-row vertically-centered">
        <span>{`Lesson ${index + 1}: ` + ' '}</span>
        <span>{` ${rec.name}`}</span>
        <a href={rec.url}>Preview Lesson</a>
      </div>));
    return (
      <div className="expanded-section">
        {activities}
      </div>
    );
  }

  render() {
    const expandState = this.state.expanded ? 'expanded' : 'collapsed';
    const rec = this.props.recommendation;
    let expandedSection;
    const recommendationState = rec.percentage_needing_instruction > 50 ? 'recommended' : false;
    if (expandState === 'expanded') {
      expandedSection = this.renderExpandedSection();
    }
    return (
      <div className={`${expandState} ${recommendationState} lesson-recommendation-row`}>
        <div className="top-row flex-row vertically-centered space-between ">
          <div className="left-side flex-row vertically-centered">
            <h3 className={'lesson-name'}>
              {rec.name}
            </h3>
            <span onClick={this.toggleExpand}>{this.state.expanded ? 'COLLAPSE' : 'EXPAND'}</span>
          </div>
          <div className="right-side flex-row vertically-centered space-between ">
            <span>
              {`${rec.percentage_needing_instruction}% of students need instruction`}
            </span>
            <a onClick={this.assignLessonPack} className="assign q-button bg-quillgreen text-white">Assign Pack</a>
          </div>
        </div>
        {expandedSection}
      </div>
    );
  }
}
