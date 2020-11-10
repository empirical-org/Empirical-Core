import React from 'react';
import createReactClass from 'create-react-class';
import CheckBoxes from '../general_components/check_boxes/check_boxes.jsx';
import DropdownSelector from '../general_components/dropdown_selectors/dropdown_selector.jsx';
import CustomActivityPack from '../assignment_flow/create_unit/custom_activity_pack/index';
import Server from '../modules/server/server.jsx';
import Fnl from '../modules/fnl.jsx';
import TextInputGenerator from '../modules/componentGenerators/text_input_generator.jsx';
import IndicatorGenerator from '../modules/indicator_generator.jsx';
import OptionLoader from '../modules/option_loader.jsx';
import MarkdownParser from '../shared/markdown_parser.jsx';
import $ from 'jquery';
import _ from 'underscore';

export default createReactClass({
  displayName: 'unit_template',

  getInitialState() {
    this.initializeModules();

    let model = {
      name: null,
      activity_info: null,
      time: null,
      grades: [],
      activities: [],
      unit_template_category_id: null,
      flag: this.props.unitTemplate.flag || null,
      author_id: null,
      order_number: this.props.unitTemplate.order_number || null,
    };
    model = _.extend(model, this.props.unitTemplate);
    const options = this.modules.optionsLoader.initialOptions();

    const hash = { model, options, };
    return hash;
  },

  componentDidMount() {
    this.modules.optionsLoader.get();
  },

  resourceNameSingular: 'unit_template',
  resourceNamePlural: 'unit_templates',

  formFields: [
    {
      name: 'name',
    },
    {
      name: 'image_link',
      label: 'Image Link for Social Media Meta Tag'
    },
    {
      name: 'activity_info',
      label: 'Activity Info',
      size: 'medium',
    }
  ],

  initializeModules() {
    const fnl = new Fnl();
    const server = new Server(this.resourceNameSingular, this.resourceNamePlural, '/cms');
    this.modules = {
      textInputGenerator: new TextInputGenerator(this, this.updateModelState),
      server,
      indicatorGenerator: new IndicatorGenerator(this.getModelState, this.updateModelState, fnl),
      optionsLoader: new OptionLoader(this.initializeModelOptions(), this.updateState, server),
    };
  },

  initializeModelOptions() {
    this.modelOptions = [
      { name: 'times', value: this.timeOptions(), fromServer: false, },
      { name: 'grades', value: [], fromServer: true, },
      { name: 'unit_template_categories', value: [], fromServer: true, cmsController: true, },
      { name: 'authors', value: [], fromServer: true, cmsController: true, },
      { name: 'flag', value: ['production', 'alpha', 'beta', 'archived', 'private'], fromServer: false, cmsController: true, },
      { name: 'order_number', value: _.range(1, 30), fromServer: false, }
    ];
    return this.modelOptions;
  },

  // TODO: abstract out the below 3 methods
  // can also combine first two by replacing 'key' with fnl equivalent
  updateState(key, value) {
    const newState = this.state;
    newState[key] = value;
    this.setState(newState);
  },

  getModelState(key) {
    return this.state.model[key];
  },

  updateModelState(key, value) {
    const newState = this.state;
    newState.model[key] = value;
    this.setState(newState);
  },

  update(hash) {
    let state = this.state;
    state = _.merge(state, hash);
    this.setState(state);
  },

  timeOptions() {
    return _.range(20).map(n => 10 * n);
  },

  save() {
    const model = this.state.model;

    if (this.state.options.authors.length == 1) {
      model.author_id = this.state.options.authors[0].id;
    }
    const fieldsToNormalize = [
      // {name: 'author', idName: 'author_id'},
      { name: 'activities', idName: 'activity_ids', flag: 'flag', }
      // {name: 'related_unit_templates', idName: 'related_unit_template_ids'}
    ];

    this.modules.server.save(model, { callback: (() => { window.location.href = `${process.env.DEFAULT_URL}/cms/unit_templates` }), fieldsToNormalize ,});
  },

  toggleActivitySelection(activity) {
    const { model, } = this.state
    if (model.activities.find(act => act.id === activity.id)) {
      const activities = model.activities.filter(act => act.id !== activity.id)
      this.updateModelState('activities', activities)
    } else {
      const newActivity = activity
      newActivity.order_number = model.activities.length
      const activities = model.activities.concat([newActivity])
      this.updateModelState('activities', activities)
    }
  },

  determineErrorMessage() {
    return null;
  },

  determineContinueButtonClass() {
    return 'button-green pull-right';
  },

  determineMarkdownParser() {
    if (this.state.model.activity_info) {
      return (
        <div>
          <a href="http://commonmark.org/help/" style={{ color: '#027360', }}>Markdown Cheatsheet</a>
          <p>To add linebreaks, type &lt;br&gt;.</p>
          <br />
          <p>Activity Info Preview</p>
          <MarkdownParser className="markdown-preview" markdownText={this.state.model.activity_info} />
        </div>
      );
    }
  },

  determineErrorMessageClass() {
    return '';
  },

  handleNewSelectedActivities(newSelectedActivities) {
    const { model, } = this.state
    const selectedActivities = newSelectedActivities.map(item => item.id);
    const newOrderedActivities = selectedActivities.map((key, i) => {
      const activity = model.activities.find(a => a.id === key);
      activity.order_number = i;
      return activity;
    }).sort((act1, act2) => act1.order_number - act2.order_number)
    model.activities = newOrderedActivities
    this.updateModelState('activities', newOrderedActivities)
  },

  getGradeCheckBoxes() {
    return (<CheckBoxes
      items={this.state.options.grades}
      label={'Grades'}
      selectedItems={this.state.model.grades}
      toggleItem={this.modules.indicatorGenerator.stateItemToggler('grades')}
    />);
  },

  getUnitTemplateCategorySelect() {
    return (<DropdownSelector
      defaultValue={this.state.model.unit_template_category_id}
      label={'Select Activity Pack Category'}
      options={this.state.options.unit_template_categories}
      select={this.modules.indicatorGenerator.selector('unit_template_category_id')}
    />);
  },

  getStatusFlag() {
    // The label is a quick hack as it wasn't automatically turning to the correct one
    return (<DropdownSelector
      defaultValue={this.state.model.flag}
      label={'Select Flag'}
      options={this.state.options.flag}
      select={this.modules.indicatorGenerator.selector('flag')}
    />);
  },

  getAuthorSelect() {
    return (<DropdownSelector
      defaultValue={this.state.model.author_id}
      label={'Select Author'}
      options={this.state.options.authors}
      select={this.modules.indicatorGenerator.selector('author_id')}
    />);
  },

  getTimeDropdownSelect() {
    return (<DropdownSelector
      defaultValue={this.state.model.time}
      label={'Select time in minutes'}
      options={this.state.options.times}
      select={this.modules.indicatorGenerator.selector('time')}
    />);
  },

  getCustomActivityPack() {
    return (<CustomActivityPack
      clickContinue={this.save}
      selectedActivities={this.state.model.activities}
      setSelectedActivities={this.handleNewSelectedActivities}
      toggleActivitySelection={this.toggleActivitySelection}
    />);
  },

  getErrorMessageAndButton() {
    return (<div className="error-message-and-button">
      <div className={this.determineErrorMessageClass()}>{this.determineErrorMessage()}</div>
      <button className={this.determineContinueButtonClass()} id="continue" onClick={this.save}>Continue</button>
    </div>);
  },

  render() {
    let inputs;
    inputs = this.modules.textInputGenerator.generate(this.formFields);
    return (
      <span id="unit-template-editor">
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
        <span>
          {this.getCustomActivityPack()}
          {this.getErrorMessageAndButton()}
        </span>
      </span>
    );
  },
});
