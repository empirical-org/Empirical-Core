
'use strict'

 import React from 'react'
 import ActivitySearchAndSelect from '../activity_search/activity_search_and_select'
 import NameTheUnit from './name_the_unit'

 export default React.createClass({
  propTypes: {
    unitName: React.PropTypes.string.isRequired,
    updateUnitName: React.PropTypes.func.isRequired,
    selectedActivities: React.PropTypes.array.isRequired,
    toggleActivitySelection: React.PropTypes.func.isRequired,
    isEnoughInputProvidedToContinue: React.PropTypes.bool.isRequired,
    errorMessage: React.PropTypes.string,
    clickContinue: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      prematureContinueAttempted: false
    }
  },

  clickContinue: function () {
    if (this.props.isEnoughInputProvidedToContinue) {
      this.props.clickContinue();
    } else {
      this.setState({prematureContinueAttempted: true});
    }
  },

  determineErrorMessageClass: function () {
    if (this.state.prematureContinueAttempted) {
      return "error-message visible-error-message";
    } else {
      return "error-message hidden-error-message";
    }
  },

  determineContinueButtonClass: function () {
    if (this.props.isEnoughInputProvidedToContinue) {
      return 'button-green pull-right';
    } else {
      return 'button-grey pull-right';
    }
  },

  render: function() {
    return (
      <span>
        <NameTheUnit unitName={this.props.unitName} updateUnitName={this.props.updateUnitName} />
        <ActivitySearchAndSelect selectedActivities={this.props.selectedActivities}
                                    toggleActivitySelection={this.props.toggleActivitySelection}
                                    clickContinue={this.props.clickContinue}
                                    isEnoughInputProvidedToContinue={this.props.isEnoughInputProvidedToContinue}
                                    errorMessage={this.props.errorMessage} />
        <div className='error-message-and-button'>
          <div className={this.determineErrorMessageClass()}>{this.props.errorMessage}</div>
          <button onClick={this.clickContinue} className={this.determineContinueButtonClass()} id='continue'>Continue</button>
        </div>
        <div className="fake-border"></div>
      </span>
    );
  }
});
