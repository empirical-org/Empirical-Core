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
    }
  ],

  initializeModules: function () {
    var fnl = new EC.fnl();
    this.modules = {
      textInputGenerator: new EC.TextInputGenerator(this, this.updateSelectedState),
      server: new EC.Server(this),
      indicatorGenerator: new EC.IndicatorGenerator(this, fnl)
    };
  },

  getInitialState: function () {
    this.initializeModules();

    var selected = {
      activities: [],
      grades: [],
      time: null,
      unit_template_category: null,
      name: null,
      description: null
    };

    selected = _.extend(selected, this.props.unitTemplate);

    var hash = {
      grades: [],
      times: this.timeOptions(),
      unit_template_categories: ['cat1', 'cat2'],
      selected: selected
    };

    return hash;
  },

  // TODO: abstract out the below 3 methods
  // can also combine first two by replacing 'key' with fnl equivalent
  updateState: function (key, value) {
    var newState = this.state;
    newState[key] = value;
    this.setState(newState);
  },

  updateSelectedState: function (key, value) {
    var newState = this.state;
    newState.selected[key] = value;
    this.setState(newState);
  },

  update: function (hash) {
    var state = this.state;
    state = _.merge(state, hash)
    this.setState(state);
  },

  timeOptions: function () {
    return _.range(20).map(function (n) {return 10*n});
  },

  componentDidMount: function () {
    this.modules.server.getStateFromServer('grades');
    this.modules.server.getStateFromServer('unit_template_categories');
  },

  clickContinue: function () {

  },

  isEnoughInputProvidedToContinue: function () {
    return true;
  },

  determineErrorMessage: function () {
    return null;
  },

  determineContinueButtonClass: function () {
    return 'button-green pull-right';
  },

  determineErrorMessageClass: function () {
    return '';
  },

  getGradeCheckBoxes: function () {
      return <EC.CheckBoxes label={"Grades"}
            items={_.map(this.state.grades, String)}
            selectedItems={this.state.selected.grades}
            toggleItem={this.modules.indicatorGenerator.stateItemToggler('grades')} />;
  },

  getUnitTemplateCategorySelect: function () {
    return <EC.DropdownSelector
                select={this.modules.indicatorGenerator.selector('unit_template_category')}
                options={this.state.unit_template_categories}
                label={'Select Activity Pack Category'} />;
  },

  getTimeDropdownSelect: function () {
      return <EC.DropdownSelector
                select={this.modules.indicatorGenerator.selector('time')}
                options={this.state.times}
                label={'Select time in minutes'} />;
  },

  render: function () {
    var inputs;
    inputs = this.modules.textInputGenerator.generate(this.formFields);
    return (
      <span id='unit-template-editor'>
        <span onClick={this.props.returnToIndex}>Back to List of Activity Packs</span>
        <span>
          {inputs}
        </span>
        {this.getUnitTemplateCategorySelect()}
        {this.getTimeDropdownSelect()}
        {this.getGradeCheckBoxes()}
        <span>
          <EC.ActivitySearchAndSelect selectedActivities={this.state.selected.activities}
                                      toggleActivitySelection={this.modules.indicatorGenerator.stateItemToggler('activities')}
                                      clickContinue={this.clickContinue}
                                      isEnoughInputProvidedToContinue={this.isEnoughInputProvidedToContinue()}
                                      errorMessage={this.props.errorMessage} />
          <div className='error-message-and-button'>
            <div className={this.determineErrorMessageClass()}>{this.determineErrorMessage()}</div>
            <button onClick={this.clickContinue} className={this.determineContinueButtonClass()} id='continue'>Continue</button>
        </div>
        </span>
      </span>
    );
  }
})