
"use strict";
EC.UnitStage1 = React.createClass({
  propTypes: {
    unitName: React.PropTypes.string.isRequired,
    updateUnitName: React.PropTypes.func.isRequired,
    selectedActivities: React.PropTypes.array.isRequired,
    toggleActivitySelection: React.PropTypes.func.isRequired,
    isEnoughInputProvidedToContinue: React.PropTypes.bool.isRequired,
    errorMessage: React.PropTypes.string.isRequired,
    clickContinue: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
    }
  },

  render: function() {
    return (
      <span>
        <EC.NameTheUnit unitName={this.props.unitName} updateUnitName={this.props.updateUnitName} />
        <EC.ActivitySearchAndSelect selectedActivities={this.props.selectedActivities}
                                    toggleActivitySelection={this.props.toggleActivitySelection}
                                    clickContinue={this.props.clickContinue}
                                    isEnoughInputProvidedToContinue={this.props.isEnoughInputProvidedToContinue}
                                    errorMessage={this.props.errorMessage} />
      </span>
    );
  }
});