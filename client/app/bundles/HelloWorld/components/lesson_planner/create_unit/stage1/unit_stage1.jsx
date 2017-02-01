
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
    errorMessage: React.PropTypes.string,
    clickContinue: React.PropTypes.func.isRequired,
    showNameTheUnit: React.PropTypes.bool,
    editing: React.PropTypes.bool,
    updateActivities: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      prematureContinueAttempted: false
    }
  },

  clickContinue: function () {
    if (this.props.determineIfInputProvidedAndValid()) {
      this.props.clickContinue();
    } else {
      this.setState({prematureContinueAttempted: true});
    }
  },

  determineErrorMessageClass: function () {
    if (this.state.prematureContinueAttempted) {
      return 'error-message visible-error-message';
    } else {
      return 'error-message hidden-error-message';
    }
  },

  determineCTAButton: function () {
    if (this.props.editing) {
      return <button onClick={this.props.updateActivities} className='button-green pull-right' id='continue'>Update</button>
    } else if (this.props.determineIfInputProvidedAndValid) {
      return <button onClick={this.clickContinue} className='button-green pull-right' id='continue'>Continue</button>
    } else {
      return <button onClick={this.clickContinue} className='button-grey pull-right' id='continue'>Continue</button>
    }
  },

  render: function() {
    return (
      <span>
        {this.props.showNameTheUnit ? <NameTheUnit unitName={this.props.unitName} updateUnitName={this.props.updateUnitName} /> : null}
        <ActivitySearchAndSelect selectedActivities={this.props.selectedActivities}
                                    toggleActivitySelection={this.props.toggleActivitySelection}
                                    clickContinue={this.props.clickContinue}
                                    determineIfInputProvidedAndValid={this.props.determineIfInputProvidedAndValid}
                                    errorMessage={this.props.errorMessage} />
        <div className='error-message-and-button'>
          <div className={this.determineErrorMessageClass()}>{this.props.errorMessage}</div>
          {this.determineCTAButton()}
        </div>
        <div className="fake-border"></div>
      </span>
    );
  }
});
