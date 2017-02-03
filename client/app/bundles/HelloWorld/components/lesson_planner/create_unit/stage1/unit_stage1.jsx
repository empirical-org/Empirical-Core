
'use strict'

 import React from 'react'
 import ActivitySearchAndSelect from '../activity_search/activity_search_and_select'
 import NameTheUnit from './name_the_unit'
 import LoadingIndicator from '../../../shared/loading_indicator.jsx'
 import AssigningIndicator from '../../../shared/assigning_indicator'


 export default React.createClass({
  propTypes: {
    unitName: React.PropTypes.string.isRequired,
    updateUnitName: React.PropTypes.func.isRequired,
    selectedActivities: React.PropTypes.array.isRequired,
    toggleActivitySelection: React.PropTypes.func.isRequired,
    errorMessage: React.PropTypes.string,
    clickContinue: React.PropTypes.func.isRequired,
    editing: React.PropTypes.bool,
    updateActivities: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      prematureContinueAttempted: false,
      loading: false
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

  continueButtonInside: function(){
    if (this.state.loading) {
      return <span>Saving <AssigningIndicator /></span>
    } else {
      return 'Add Activities'
    }
  },

  handleClick: function(){
    this.props.updateActivities()
    this.setState({loading: true})
  },

  determineCTAButton: function () {
    if (this.props.editing) {
      return <button onClick={this.handleClick} className='button-green pull-right' id='continue'>{this.continueButtonInside()}</button>
    } else if (this.props.determineIfInputProvidedAndValid) {
      return <button onClick={this.clickContinue} className='button-green pull-right' id='continue'>Continue</button>
    } else {
      return <button onClick={this.clickContinue} className='button-grey pull-right' id='continue'>Continue</button>
    }
  },

  nameComponent: function(){
    if (!this.props.hideNameTheUnit) {
      return <NameTheUnit unitName={this.props.unitName} updateUnitName={this.props.updateUnitName} />
    } else if (this.props.unitName) {
      return <h2 className='edit-activities-h2'>Edit Activites In {this.props.unitName}</h2>
    }
  },



  render: function() {
    return (
      <span>
        {this.nameComponent()}
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
