import React from 'react';
import ActivitySearchAndSelect from './activity_search/activity_search_and_select';
import LoadingIndicator from '../../shared/loading_indicator.jsx';
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

  ctaButton = () => {
    if (this.props.editing) {
      const clickHandler = this.state.loading ? null : this.handleClick;
      const color = this.state.loading ? 'lightgray' : 'quillgreen';
      const text = this.state.loading ? <span>Saving <AssigningIndicator /></span> : 'Update Activities';
      return <button className={`q-button cta-button bg-${color} text-white pull-right`} id="continue" onClick={clickHandler}>{text}</button>;
    } else if (this.props.determineIfInputProvidedAndValid) {
      return <button className="button-green pull-right" id="continue" onClick={this.clickContinue}>Continue</button>;
    }
    return <button className="button-grey pull-right" id="continue" onClick={this.clickContinue}>Continue</button>;
  }

  render = () => {
    const error = this.props.errorMessage ? <span><i className="fa fa-exclamation-triangle" />{this.props.errorMessage}</span> : '';
    return (
      <div>
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
    );
  }
}
