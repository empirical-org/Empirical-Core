import React from 'react'
import CheckBoxes from '../general_components/check_boxes/check_boxes.jsx'
import DropdownSelector from '../general_components/dropdown_selectors/dropdown_selector.jsx'
import ActivitySearchAndSelect from '../lesson_planner/create_unit/activity_search/activity_search_and_select.jsx'
import Server from '../modules/server/server.jsx'
import Fnl from '../modules/fnl.jsx'
import TextInputGenerator from '../modules/componentGenerators/text_input_generator.jsx'
import IndicatorGenerator from '../modules/indicator_generator.jsx'
import OptionLoader from '../modules/option_loader.jsx'
import MarkdownParser from '../shared/markdown_parser.jsx'
import $ from 'jquery'
import _ from 'underscore'


export default React.createClass({
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
      name: 'activity_info',
      label: 'Activity Info',
      size: 'medium'
    }
  ],

  initializeModules: function () {
    var fnl = new Fnl();
    var server = new Server(this.resourceNameSingular, this.resourceNamePlural, '/cms');
    this.modules = {
      textInputGenerator: new TextInputGenerator(this, this.updateModelState),
      server: server,
      indicatorGenerator: new IndicatorGenerator(this.getModelState, this.updateModelState, fnl),
      optionsLoader: new OptionLoader(this.initializeModelOptions(), this.updateState, server)
    };
  },

  initializeModelOptions: function () {
    this.modelOptions = [
      {name: 'times', value: this.timeOptions(), fromServer: false},
      {name: 'grades', value: [], fromServer: true},
      {name: 'unit_template_categories', value: [], fromServer: true, cmsController: true},
      {name: 'authors', value: [], fromServer: true, cmsController: true},
      {name: 'flag', value: ['alpha', 'beta', 'archived'], fromServer: false, cmsController: true},
      {name: 'order_number', value: _.range(1, 30), fromServer: false}
    ];
    return this.modelOptions;
  },

  getInitialState: function () {
    this.initializeModules();


    var model = {
      name: null,
      activity_info: null,
      time: null,
      grades: [],
      activities: [],
      unit_template_category_id: null,
      flag: this.props.unitTemplate.flag || null,
      author_id: null,
      order_number: this.props.unitTemplate.order_number || null
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
    return this.state.model[key];
  },

  updateModelState: function (key, value) {
    var newState = this.state;
    newState.model[key] = value;
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
    var model = this.state.model;
    if (this.state.options.authors.length == 1) {
      model.author_id = this.state.options.authors[0].id;
    }
    var fieldsToNormalize = [
      //{name: 'author', idName: 'author_id'},
      {name: 'activities', idName: 'activity_ids', flag: 'flag'}
      //{name: 'related_unit_templates', idName: 'related_unit_template_ids'}
    ];
    this.modules.server.save(model, {callback: this.props.returnToIndex, fieldsToNormalize: fieldsToNormalize})
  },

  determineErrorMessage: function () {
    return null;
  },

  determineContinueButtonClass: function () {
    return 'button-green pull-right';
  },

  determineMarkdownParser: function () {
    if (this.state.model.activity_info) {
      return(
        <div>
          <a href="http://commonmark.org/help/" style={{color: '#027360'}}>Markdown Cheatsheet</a>
          <p>To add linebreaks, type &lt;br&gt;.</p>
          <br/>
          <p>Activity Info Preview</p>
          <MarkdownParser className="markdown-preview" markdownText={this.state.model.activity_info}/>
        </div>
      )
    }
  },

  determineErrorMessageClass: function () {
    return '';
  },

  getGradeCheckBoxes: function () {
      return <CheckBoxes label={"Grades"}
            items={this.state.options.grades}
            selectedItems={this.state.model.grades}
            toggleItem={this.modules.indicatorGenerator.stateItemToggler('grades')} />;
  },

  getUnitTemplateCategorySelect: function () {
    return <DropdownSelector
                select={this.modules.indicatorGenerator.selector('unit_template_category_id')}
                defaultValue={this.state.model.unit_template_category_id}
                options={this.state.options.unit_template_categories}
                label={'Select Activity Pack Category'} />;
  },

  getStatusFlag: function () {
    // The label is a quick hack as it wasn't automatically turning to the correct one
    return <DropdownSelector
                select={this.modules.indicatorGenerator.selector('flag')}
                defaultValue={this.props.unitTemplate.flag}
                options={this.state.options.flag}
                label={'Select Flag'} />;
  },

  getOrderNumber: function () {
    return <DropdownSelector
      select={this.modules.indicatorGenerator.selector('order_number')}
      defaultValue={this.props.unitTemplate.order_number}
      options={this.state.options.order_number}
      label={'Select Order Number'}
    />
  },

  getAuthorSelect: function () {
    return <DropdownSelector
              select={this.modules.indicatorGenerator.selector('author_id')}
              defaultValue={this.state.model.author_id}
              options={this.state.options.authors}
              label={'Select Author'} />;
  },

  getTimeDropdownSelect: function () {
      return <DropdownSelector
                select={this.modules.indicatorGenerator.selector('time')}
                defaultValue={this.state.model.time}
                options={this.state.options.times}
                label={'Select time in minutes'} />;
  },

  getActivitySearchAndSelect: function () {
    return <ActivitySearchAndSelect selectedActivities={this.state.model.activities}
                                      toggleActivitySelection={this.modules.indicatorGenerator.stateItemToggler('activities')}
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
          {this.determineMarkdownParser()}
        </span>
        {this.getAuthorSelect()}
        {this.getUnitTemplateCategorySelect()}
        {this.getTimeDropdownSelect()}
        {this.getGradeCheckBoxes()}
        {this.getStatusFlag()}
        {this.getOrderNumber()}
        <span>
          {this.getActivitySearchAndSelect()}
          {this.getErrorMessageAndButton()}
        </span>
      </span>
    );
  }
})
