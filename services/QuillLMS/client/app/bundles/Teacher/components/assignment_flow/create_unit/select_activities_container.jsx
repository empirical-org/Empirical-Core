import React from 'react';

import AssigningIndicator from '../../shared/button_loading_indicator';
import AssignmentFlowNavigation from '../assignment_flow_navigation.tsx';
import CustomActivityPack from './custom_activity_pack/index';

export default class SelectActivitiesContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      prematureContinueAttempted: false,
      loading: false,
    }
  }

  clickContinue = () => {
    if (this.props.determineIfInputProvidedAndValid()) {
      this.props.clickContinue();
    } else {
      this.setState({ prematureContinueAttempted: true, });
    }
  }

  ctaButton = () => {
    if (this.props.editing) {
      const clickHandler = this.state.loading ? null : this.handleClick;
      const color = this.state.loading ? 'lightgray' : 'quillgreen';
      const text = this.state.loading ? <span>Saving <AssigningIndicator /></span> : 'Update Activities';
      return <button className={`q-button cta-button bg-${color} text-white pull-right`} id="continue" onClick={clickHandler}>{text}</button>;
    }
  }

  determineErrorMessageClass = () => {
    if (this.state.prematureContinueAttempted) {
      return 'error-message visible-error-message';
    }
    return 'error-message hidden-error-message';
  }

  handleClick = () => {
    this.props.updateActivities();
    this.setState({ loading: true, });
  }

  render() {
    const { editing, errorMessage, clickContinue, activities, selectedActivities, setSelectedActivities, toggleActivitySelection, unitName, showLessonsBanner, showEvidenceBanner, flagset, } = this.props
    const error = errorMessage ? <span><i className="fas fa-exclamation-triangle" />{errorMessage}</span> : '';
    const navigation = editing ? null : <AssignmentFlowNavigation />

    const clickFunction = editing ? this.handleClick : clickContinue

    return (
      <div>
        {navigation}
        <CustomActivityPack
          clickContinue={clickFunction}
          errorMessage={errorMessage}
          flagset={flagset}
          passedActivities={activities}
          selectedActivities={selectedActivities}
          setSelectedActivities={setSelectedActivities}
          showEvidenceBanner={showEvidenceBanner}
          showLessonsBanner={showLessonsBanner}
          toggleActivitySelection={toggleActivitySelection}
          unitName={unitName}
        />
      </div>
    );
  }
}
