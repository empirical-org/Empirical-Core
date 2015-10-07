'use strict';
EC.Cms.UnitTemplate = React.createClass({
  propTypes: {
    unitTemplate: React.PropTypes.object.isRequired,
    returnToIndex: React.PropTypes.func.isRequired
  },

  resourceNameSingular: 'unit_template',
  resourceNamePlural: 'unit_templates',

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
    var server = new EC.Server(this.resourceNameSingular, this.resourceNamePlural);
    this.modules = {
      textInputGenerator: new EC.TextInputGenerator(this, this.updateModelState),
      server: server,
      indicatorGenerator: new EC.IndicatorGenerator(this.getModelState, this.updateModelState, fnl),
      optionsLoader: new EC.OptionLoader(this.initializeModelOptions(), this.updateState, server)
    };
  },

  initializeModelOptions: function () {
    this.modelOptions = [
      {name: 'times', value: this.timeOptions(), fromServer: false},
      {name: 'grades', value: [], fromServer: true},
      {name: 'unit_template_categories', value: [], fromServer: true, cmsController: true},
      {name: 'authors', value: [], fromServer: true, cmsController: true}
    ];
    return this.modelOptions;
  },

  getInitialState: function () {
    this.initializeModules();


    var model = {
      name: null,
      description: null,
      time: null,
      grades: [],
      activities: [],
      unit_template_category_id: null,
      author_id: null
    };

    model = _.extend(model, this.props.unitTemplate);
    var options = this.modules.optionsLoader.initialOptions()

    var hash = {model: model, options: options};
    return hash;
  },

  componentDidMount: function () {
    this.modules.optionsLoader.get();
  },


  // TODO: abstract out the below 3 methods
  // can also combine first two by replacing 'key' with fnl equivalent
  updateState: function (key, value) {
    var newState = this.state;
    newState[key] = value;
    this.setState(newState);
  },

  getModelState: function (key) {
    return this.model.state[key];
  },

  updateModelState: function (key, value) {
    var newState = this.state;
    newState.model[key] = value;
    console.log('newState', newState)
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

  save: function () {
    var data = _.omit(this.state.model, ['activities', 'author'])

    data.activity_ids = _.pluck(this.state.model.activities, 'id');
    console.log('data', data)
    this.modules.server.cmsSave(data, this.props.returnToIndex)
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
            items={this.state.options.grades}
            selectedItems={this.state.model.grades}
            toggleItem={this.modules.indicatorGenerator.stateItemToggler('grades')} />;
  },

  getUnitTemplateCategorySelect: function () {
    return <EC.DropdownSelector
                select={this.modules.indicatorGenerator.selector('unit_template_category_id')}
                defaultValue={this.state.model.unit_template_category_id}
                options={this.state.options.unit_template_categories}
                label={'Select Activity Pack Category'} />;
  },

  getAuthorSelect: function () {
    return <EC.DropdownSelector
              select={this.modules.indicatorGenerator.selector('author_id')}
              defaultValue={this.state.model.author_id}
              options={this.state.options.authors}
              label={'Select Author'} />;
  },

  getTimeDropdownSelect: function () {
      return <EC.DropdownSelector
                select={this.modules.indicatorGenerator.selector('time')}
                defaultValue={this.state.model.time}
                options={this.state.options.times}
                label={'Select time in minutes'} />;
  },

  getActivitySearchAndSelect: function () {
    return <EC.ActivitySearchAndSelect selectedActivities={this.state.model.activities}
                                      toggleActivitySelection={this.modules.indicatorGenerator.stateItemToggler('activities')}
                                      clickContinue={this.clickContinue}
                                      isEnoughInputProvidedToContinue={this.isEnoughInputProvidedToContinue()}
                                      errorMessage={this.props.errorMessage} />
  },

  getErrorMessageAndButton: function () {
    return <div className='error-message-and-button'>
              <div className={this.determineErrorMessageClass()}>{this.determineErrorMessage()}</div>
              <button onClick={this.save} className={this.determineContinueButtonClass()} id='continue'>Continue</button>
          </div>
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
        {this.getAuthorSelect()}
        {this.getUnitTemplateCategorySelect()}
        {this.getTimeDropdownSelect()}
        {this.getGradeCheckBoxes()}
        <span>
          {this.getActivitySearchAndSelect()}
          {this.getErrorMessageAndButton()}
        </span>
      </span>
    );
  }
})