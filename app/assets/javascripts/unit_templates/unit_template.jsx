'use strict';
EC.UnitTemplate = React.createClass({
  propTypes: {
    unitTemplate: React.PropTypes.object.isRequired,
    returnToIndex: React.PropTypes.func.isRequired
  },

  formFields: [
    {
      name: 'name'
    },
    {
      name: 'description',
      size: 'medium'
    },
    {
      name: 'time'
    }
  ],

  getInitialState: function () {
    var tig = new EC.TextInputGenerator()
    tig.setUpdate(this.update);
    tig.setErrors({});
    return {
      selectedActivities: [],
      fnl: new EC.fnl(),
      textInputGenerator: tig
    };
  },

  update: function (hash) {
    var state = this.state;
    state = _.merge(state, hash)
    this.setState(state);
  },

  toggleActivitySelection: function (true_or_false, activity) {
    var sa = this.state.fnl.toggle(this.state.selectedActivities, activity, true_or_false);
    console.log('sa', sa)
    this.setState({selectedActivities: sa});
  },

  isEnoughInputProvidedToContinue: function () {
    return true;
  },

  determineErrorMessage: function () {
    return null;
  },

  clickContinue: function () {

  },

  render: function () {
    var inputs;
    inputs = this.state.textInputGenerator.generate(this.formFields);
    return (
      <span id='unit-template-editor'>
        <span onClick={this.props.returnToIndex}>Back to List of Activity Packs</span>
        <span>
          {inputs}
        </span>
        <span>
          <EC.ActivitySearchAndSelect selectedActivities={this.state.selectedActivities}
                                      toggleActivitySelection={this.toggleActivitySelection}
                                      clickContinue={this.clickContinue}
                                      isEnoughInputProvidedToContinue={this.isEnoughInputProvidedToContinue()}
                                      errorMessage={this.props.errorMessage} />
        </span>
      </span>
    );
  }
})
