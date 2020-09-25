import React from 'react';

import ActivitySearchAndSelect from './activity_search/activity_search_and_select';

import AssignmentFlowNavigation from '../assignment_flow_navigation.tsx'
import AssigningIndicator from '../../shared/button_loading_indicator';

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

  renderSelectActivitiesButton = () => {
    let buttonClass = 'quill-button contained primary medium';
    if (!(this.props.selectedActivities && this.props.selectedActivities.length)) {
      buttonClass += ' disabled';
    }
    return <button className={buttonClass} onClick={this.clickContinue}>Select activities</button>
  }

  render = () => {
    const error = this.props.errorMessage ? <span><i className="fas fa-exclamation-triangle" />{this.props.errorMessage}</span> : '';
    const navigation = this.props.editing ? null : <AssignmentFlowNavigation button={this.renderSelectActivitiesButton()} />

    return (
      <div>
        {navigation}
        <div className="container">
          <ActivitySearchAndSelect
            activities={this.props.activities}
            clickContinue={this.props.clickContinue}
            errorMessage={this.props.errorMessage}
            selectedActivities={this.props.selectedActivities}
            toggleActivitySelection={this.props.toggleActivitySelection}
            unitName={this.props.unitName}
          />
          <div className="error-message-and-button">
            <div className={this.determineErrorMessageClass()}>{error}</div>
            {this.ctaButton()}
          </div>
        </div>
      </div>
    );
  }
}
