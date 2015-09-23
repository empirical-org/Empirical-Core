EC.UnitTemplate = React.createClass({
  propTypes: {
    unitTemplate: React.PropTypes.object.isRequired,
    returnToIndex: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      selectedActivities: []
    };
  },

  toggleActivitySelection: function (true_or_false, activity) {

  },

  updateUnitName: function () {

  },

  determineIfEnoughInputProvidedForStage1: function () {
    return true;
  },

  determineErrorMessage: function () {
    return null;
  },

  clickContinue: function () {

  },

  render: function () {
    return (
      <span id='unit-template-editor'>
        <span onClick={this.props.returnToIndex}>Back to Activity Packs</span>
        <span>
          <EC.UnitStage1 toggleActivitySelection={this.toggleActivitySelection}
                 unitName = {this.props.unitTemplate.name}
                 updateUnitName={this.updateUnitName}
                 selectedActivities={this.state.selectedActivities}
                 isEnoughInputProvidedForStage1={this.determineIfEnoughInputProvidedForStage1()}
                 errorMessage={this.determineErrorMessage()}
                 clickContinue={this.clickContinue} />;
        </span>
      </span>
    );
  }
})