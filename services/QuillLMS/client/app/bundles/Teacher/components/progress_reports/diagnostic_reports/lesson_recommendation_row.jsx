import React from 'react';
import LoadingIndicator from '../../shared/loading_indicator.jsx';

export default class LessonsRecommendationRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false, };
  }

  handleAssignPackClick() {
    const { assignToWholeClass, activityPackId, } = this.props
    assignToWholeClass(activityPackId)
  }

  handleExpandOrCollapseClick = () => this.setState(prevState => ({ expanded: !prevState.expanded }));

  renderExpandedSection() {
    const { recommendation, } = this.props
    const activities = recommendation.activities.map((act, index) => {
      const previewLessonLink = <a href={act.url} target="_blank">Preview Lesson</a> //eslint-disable-line react/jsx-no-target-blank
      return (<div className="activity-row flex-row vertically-centered" key={act.name}>
        <span>{` ${act.name}`}</span>
        {previewLessonLink}
      </div>)
    });
    return (
      <div className="expanded-section">
        {activities}
      </div>
    );
  }

  statusSpecificComponent() {
    const { status, recommendation, } = this.props
    if (status === 'loading') {
      return (<LoadingIndicator />);
    } else if (recommendation.previously_assigned || status === 'assigned') {
      return <span className="assigned-lesson-pack vertically-centered centered"><i className="fas fa-check-circle" />Pack Assigned</span>;
    }
    return (<a className="assign q-button bg-quillgreen text-white" onClick={this.handleAssignPackClick}>Assign Pack</a>);
  }

  render() {
    const { expanded, } = this.state
    const { recommendation, } = this.props
    const expandState = expanded ? 'expanded' : 'collapsed';
    let expandedSection;
    const recommendationState = recommendation.percentage_needing_instruction > 50 ? 'recommended' : false;
    if (expandState === 'expanded') {
      expandedSection = this.renderExpandedSection();
    }
    return (
      <div className={`${expandState} ${recommendationState} lesson-recommendation-row`}>
        <div className="top-row flex-row vertically-centered space-between ">
          <div className="left-side flex-row vertically-centered">
            <h3 className='lesson-name'>
              {recommendation.name}
            </h3>
            <span onClick={this.handleExpandOrCollapseClick}>{expanded ? 'COLLAPSE' : 'EXPAND'}</span>
          </div>
          <div className="right-side flex-row vertically-centered space-between ">
            <span>
              {`${recommendation.percentage_needing_instruction}% of students need instruction`}
            </span>
            {this.statusSpecificComponent()}
          </div>
        </div>
        {expandedSection}
      </div>
    );
  }
}
