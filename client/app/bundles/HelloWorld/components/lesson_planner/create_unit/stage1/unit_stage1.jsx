
'use strict'

 import React from 'react'
 import ActivitySearchAndSelect from '../activity_search/activity_search_and_select'
 import NameTheUnit from './name_the_unit'
 import LoadingIndicator from '../../../shared/loading_indicator.jsx'
 import AssigningIndicator from '../../../shared/button_loading_indicator'

 export default React.createClass({
  propTypes: {
    unitName: React.PropTypes.string.isRequired,
    updateUnitName: React.PropTypes.func,
    selectedActivities: React.PropTypes.array.isRequired,
    toggleActivitySelection: React.PropTypes.func.isRequired,
    errorMessage: React.PropTypes.string,
    clickContinue: React.PropTypes.func,
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

  handleClick: function(){
    this.props.updateActivities()
    this.setState({loading: true})
  },

  ctaButton: function () {
    if (this.props.editing) {
      const clickHandler = this.state.loading ? null : this.handleClick;
      const color = this.state.loading ? 'lightgray' : 'quillgreen';
      const text = this.state.loading ? <span>Saving <AssigningIndicator/></span> : 'Update Activities'
      return <button onClick={clickHandler} className={`q-button cta-button bg-${color} text-white pull-right`} id='continue'>{text}</button>
    } else if (this.props.determineIfInputProvidedAndValid) {
      return <button onClick={this.clickContinue} className='button-green pull-right' id='continue'>Continue</button>
    } else {
      return <button onClick={this.clickContinue} className='button-grey pull-right' id='continue'>Continue</button>
    }
  },

  nameComponent: function(){
    if (!this.props.hideNameTheUnit) {
      const nameError = this.state.prematureContinueAttempted && this.props.errorMessage && this.props.errorMessage.includes('name') ? 'name-error' : ''
      return <NameTheUnit unitName={this.props.unitName} updateUnitName={this.props.updateUnitName} nameError={nameError}/>
    } else if (this.props.unitName) {
      return <h2 className='edit-activities-h2'>Activities In {this.props.unitName}</h2>
    }
  },



  render: function() {
    const error = this.props.errorMessage ? <span><i className="fa fa-exclamation-triangle"/>{this.props.errorMessage}</span> : ''
    return (
      <div className="container">
        {this.nameComponent()}
        <ActivitySearchAndSelect selectedActivities={this.props.selectedActivities}
                                    toggleActivitySelection={this.props.toggleActivitySelection}
                                    clickContinue={this.props.clickContinue}
                                    errorMessage={this.props.errorMessage} />
        <div className='error-message-and-button'>
          <div className={this.determineErrorMessageClass()}>{error}</div>
          {this.ctaButton()}
        </div>
      </div>
    );
  }
});
