import * as React from 'react';
import createReactClass from 'create-react-class';
import { EditorState, ContentState } from 'draft-js';
import Dropzone from 'react-dropzone'
import _ from 'underscore';

import UnitTemplateActivitySelector from './unit_template_activity_selector'
import DropdownSelector from '../general_components/dropdown_selectors/dropdown_selector.jsx';
import Server from '../modules/server/server.jsx';
import Fnl from '../modules/fnl.jsx';
import { DropdownInput, Input, TextEditor, Tooltip, PRODUCTION_FLAG, ALPHA_FLAG, BETA_FLAG, GAMMA_FLAG, ARCHIVED_FLAG, PRIVATE_FLAG } from '../../../Shared/index'
import TextInputGenerator from '../modules/componentGenerators/text_input_generator.jsx';
import IndicatorGenerator from '../modules/indicator_generator.jsx';
import OptionLoader from '../modules/option_loader.jsx';
import MarkdownParser from '../shared/markdown_parser.jsx';
import getAuthToken from '../modules/get_auth_token';
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces';

const ELL = 'ELL';
const UNIVERSITY = 'University';
const THEMED = 'Themed';
const DIAGNOSTIC = 'Diagnostic';
const STARTER = 'Starter';
const INTERMEDIATE = 'Intermediate';
const ADVANCED = 'Advanced';

const PACK_TYPE_OPTIONS = [ELL, UNIVERSITY, THEMED, DIAGNOSTIC, STARTER, INTERMEDIATE, ADVANCED];
const FLAG_DROPDOWN_OPTIONS = [PRODUCTION_FLAG, ALPHA_FLAG, BETA_FLAG, GAMMA_FLAG, ARCHIVED_FLAG, PRIVATE_FLAG];
const TIME_OPTIONS = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190'];

// export default createReactClass({
//   displayName: 'unit_template',

//   getInitialState() {
//     this.initializeModules();

//     let model = {
//       id: null,
//       name: null,
//       activity_info: null,
//       time: null,
//       grades: [],
//       activities: [],
//       unit_template_category_id: null,
//       flag: this.props.unitTemplate.flag || null,
//       author_id: null,
//       order_number: this.props.unitTemplate.order_number || null,
//       readability: null,
//       diagnostic_names: []
//     };
//     console.log("🚀 ~ file: unit_template.jsx ~ line 38 ~ getInitialState ~ model", model)
//     model = _.extend(model, this.props.unitTemplate);
//     console.log("🚀 ~ file: unit_template.jsx ~ line 40 ~ getInitialState ~ model", model)
//     const options = this.modules.optionsLoader.initialOptions();
//     const uploadedFileLink = "";

//     const hash = { model, options, uploadedFileLink };
//     return hash;
//   },

//   componentDidMount() {
//     this.modules.optionsLoader.get();
//   },

//   resourceNameSingular: 'unit_template',
//   resourceNamePlural: 'unit_templates',

//   formFields: [
//     {
//       name: 'name',
//     }
//   ],

//   initializeModules() {
//     const fnl = new Fnl();
//     const server = new Server(this.resourceNameSingular, this.resourceNamePlural, '/cms');
//     this.modules = {
//       textInputGenerator: new TextInputGenerator(this, this.updateModelState),
//       server,
//       indicatorGenerator: new IndicatorGenerator(this.getModelState, this.updateModelState, fnl),
//       optionsLoader: new OptionLoader(this.initializeModelOptions(), this.updateState, server),
//     };
//   },

//   initializeModelOptions() {
//     this.modelOptions = [
//       { name: 'times', value: this.timeOptions(), fromServer: false, },
//       { name: 'grades', value: [], fromServer: true, },
//       { name: 'unit_template_categories', value: [], fromServer: true, cmsController: true, },
//       { name: 'authors', value: [], fromServer: true, cmsController: true, },
//       { name: 'flag', value: ['production', 'alpha', 'beta', 'gamma', 'archived', 'private'], fromServer: false, cmsController: true, },
//       { name: 'order_number', value: _.range(1, 30), fromServer: false, }
//     ];
//     return this.modelOptions;
//   },

//   // TODO: abstract out the below 3 methods
//   // can also combine first two by replacing 'key' with fnl equivalent
//   updateState(key, value) {
//     const newState = this.state;
//     newState[key] = value;
//     this.setState(newState);
//   },

//   getModelState(key) {
//     return this.state.model[key];
//   },

//   updateModelState(key, value) {
//     const newState = this.state;
//     newState.model[key] = value;
//     this.setState(newState);
//   },

//   update(hash) {
//     let state = this.state;
//     state = _.merge(state, hash);
//     this.setState(state);
//   },

//   timeOptions() {
//     return _.range(20).map(n => 10 * n);
//   },

//   save() {
//     const model = this.state.model;

//     if (this.state.options.authors.length == 1) {
//       model.author_id = this.state.options.authors[0].id;
//     }
//     const fieldsToNormalize = [
//       // {name: 'author', idName: 'author_id'},
//       { name: 'activities', idName: 'activity_ids', flag: 'flag', }
//       // {name: 'related_unit_templates', idName: 'related_unit_template_ids'}
//     ];

//     this.modules.server.save(model, { fieldsToNormalize ,});
//   },

//   toggleActivitySelection(activity) {
//     const { model, } = this.state
//     if (model.activities.find(act => act.id === activity.id)) {
//       const activities = model.activities.filter(act => act.id !== activity.id)
//       this.updateModelState('activities', activities)
//     } else {
//       const newActivity = activity
//       newActivity.order_number = model.activities.length
//       const activities = model.activities.concat([newActivity])
//       this.updateModelState('activities', activities)
//     }
//   },

//   determineErrorMessage() {
//     return null;
//   },

//   determineContinueButtonClass() {
//     return 'button-green pull-right';
//   },

//   determineMarkdownParser() {
//     if (this.state.model.activity_info) {
//       return (
//         <div>
//           <a href="http://commonmark.org/help/" style={{ color: '#027360', }}>Markdown Cheatsheet</a>
//           <p>To add linebreaks, type &lt;br&gt;.</p>
//           <br />
//           <p>Activity Info Preview</p>
//           <MarkdownParser className="markdown-preview" markdownText={this.state.model.activity_info} />
//         </div>
//       );
//     }
//   },

//   determineErrorMessageClass() {
//     return '';
//   },

//   handleActivityPackDescriptionChange(text) {
//     this.updateModelState('activity_info', text)
//   },

//   handleNewSelectedActivities(newSelectedActivities) {
//     const { model, } = this.state
//     const selectedActivities = newSelectedActivities.map(item => item.id);
//     const newOrderedActivities = selectedActivities.map((key, i) => {
//       const activity = model.activities.find(a => a.id === key);
//       activity.order_number = i;
//       return activity;
//     }).sort((act1, act2) => act1.order_number - act2.order_number)
//     model.activities = newOrderedActivities
//     this.updateModelState('activities', newOrderedActivities)
//   },

//   getUnitTemplateCategorySelect() {
//     return (
//       <DropdownSelector
//         defaultValue={this.state.model.unit_template_category_id}
//         label="Select Activity Pack Category"
//         options={this.state.options.unit_template_categories}
//         select={this.modules.indicatorGenerator.selector('unit_template_category_id')}
//       />
//     );
//   },

//   getStatusFlag() {
//     // The label is a quick hack as it wasn't automatically turning to the correct one
//     return (
//       <DropdownSelector
//         defaultValue={this.state.model.flag}
//         label="Select Flag"
//         options={this.state.options.flag}
//         select={this.modules.indicatorGenerator.selector('flag')}
//       />
//     );
//   },

//   getTimeDropdownSelect() {
//     return (
//       <DropdownSelector
//         defaultValue={this.state.model.time}
//         label="Select time in minutes"
//         options={this.state.options.times}
//         select={this.modules.indicatorGenerator.selector('time')}
//       />
//     );
//   },

//   getActivityPackDescriptionEditor() {
//     const { model } = this.state
//     const { activity_info } = model
//     return (
//       <div className="activity-pack-description">
//         <br />
//         <span>Activity Pack Description</span>
//         <TextEditor
//           ContentState={ContentState}
//           EditorState={EditorState}
//           handleTextChange={this.handleActivityPackDescriptionChange}
//           key="activity-pack-description"
//           shouldCheckSpelling={true}
//           text={activity_info}
//         />
//       </div>
//     );
//   },

//   getErrorMessageAndButton() {
//     return (
//       <div className="error-message-and-button">
//         <div className={this.determineErrorMessageClass()}>{this.determineErrorMessage()}</div>
//         <button className={this.determineContinueButtonClass()} id="continue" onClick={this.save}>Save</button>
//       </div>
//     );
//   },

//   getDiagnostics() {
//     const { model } = this.state
//     const { diagnostic_names } = model
//     return (
//       <div>
//         <h3>Diagnostics:</h3>
//         <span>{diagnostic_names && diagnostic_names.map((diagnostic) => {
//           return (<span>{diagnostic}<br /></span>);
//         })}</span>
//         <br /><br />
//       </div>
//     );
//   },

//   getPreviewLink() {
//     const { model } = this.state
//     const { id } = model
//     let url = `${process.env.DEFAULT_URL}/assign/featured-activity-packs/${id}`
//     return (<a className="link-green" href={url} rel="noopener noreferrer" target="_blank">Preview in Featured Activity Pack page</a>)
//   },

//   getReadability() {
//     const { model } = this.state
//     const { readability } = model
//     return (
//       <div>
//         <h3>Readability:</h3>
//         <span>{readability && `${readability}`}</span>
//         <br /><br />
//       </div>
//     )
//   },

//   handleDrop(acceptedFiles) {
//     acceptedFiles.forEach(file => {
//       const data = new FormData()
//       data.append('file', file)
//       fetch(`${process.env.DEFAULT_URL}/cms/images`, {
//         method: 'POST',
//         mode: 'cors',
//         credentials: 'include',
//         headers: {
//           'X-CSRF-Token': getAuthToken()
//         },
//         body: data
//       })
//         .then(response => response.json()) // if the response is a JSON object
//         .then(response => this.setState({uploadedFileLink: response.url})); // Handle the success response object
//     });
//   },

//   getPdfUpload() {
//     const { uploadedFileLink } = this.state
//     return (
//       <div>
//         <label>Click the square below or drag a file into it to upload a file:</label>
//         <Dropzone onDrop={this.handleDrop} />
//         <label>Here is the link to your uploaded file:</label>
//         <input value={uploadedFileLink} />
//       </div>
//     )
//   },

//   render() {
//     console.log('props', this.props)
//     // console.log('state', this.state)
//     const { model, } = this.state
//     let inputs;
//     inputs = this.modules.textInputGenerator.generate(this.formFields);
//     return (
//       <span id="unit-template-editor">
//         {this.getStatusFlag()}
//         {this.getPreviewLink()}
//         <span>
//           {inputs}
//           {this.getActivityPackDescriptionEditor()}
//         </span>
//         {this.getUnitTemplateCategorySelect()}
//         {this.getTimeDropdownSelect()}
//         {this.getDiagnostics()}
//         {this.getReadability()}
//         {this.getPdfUpload()}
//         <br /><br />
//         <span>
//           <UnitTemplateActivitySelector
//             parentActivities={model.activities}
//             setParentActivities={this.handleNewSelectedActivities}
//             toggleParentActivity={this.toggleActivitySelection}
//           />
//           {this.getErrorMessageAndButton()}
//         </span>
//       </span>
//     );
//   },
// });

export const UnitTemplate = ({ unitTemplate }) => {
  console.log("🚀 ~ file: unit_template.tsx ~ line 355 ~ UnitTemplate ~ unitTemplate", unitTemplate)
  const { flag, time, unit_template_category, name } = unitTemplate;
  const [activityPackFlag, setActivityPackFlag] = React.useState<DropdownObjectInterface>(flag ? {value: flag, label: flag} : null);
  const [activityPackName, setActivityPackName] = React.useState<any>(name);
  const [activityPackType, setActivityPackType] = React.useState<DropdownObjectInterface>(unit_template_category ? {value: unit_template_category.name, label: unit_template_category.name} : null);
  const [activityPackTime, setActivityPackTime] = React.useState<DropdownObjectInterface>(time ? {value: time.toString(), label: time.toString()} : null);
  const [errors, setErrors] = React.useState<any>(null);

  function handleFlagChange(option: DropdownObjectInterface) {
    setActivityPackFlag(option);
  }

  function handleNameChange(e) {
    const { target } = e;
    const { value } = target;
    setActivityPackName(value);
  }

  function handlePackTypeChange(option: DropdownObjectInterface) {
    setActivityPackType(option);
  }

  function handleTimeChange(option: DropdownObjectInterface) {
    setActivityPackTime(option);
  }

  function getOptions(options: string[]) {
    return options.map((option: string) => ({ value: option, label: option }));
  }

  return(
    <div id="unit-template-editor">
      <DropdownInput
        handleChange={handleFlagChange}
        label="Select flag"
        options={getOptions(FLAG_DROPDOWN_OPTIONS)}
        value={activityPackFlag}
      />
      <Input
        className="name-input"
        error={errors ? errors['name'] : null}
        handleChange={handleNameChange}
        label="Name"
        value={activityPackName}
      />
      <section>
        <label htmlFor="pack-type-dropdown">
          <Tooltip tooltipText="Unit Template Category" tooltipTriggerText="Pack Type" />
        </label>
        <DropdownInput
          handleChange={handlePackTypeChange}
          id="pack-type-dropdown"
          options={getOptions(PACK_TYPE_OPTIONS)}
          value={activityPackType}
        />
      </section>
      <DropdownInput
        handleChange={handleTimeChange}
        id="time-dropdown"
        label="Select time in minutes"
        options={getOptions(TIME_OPTIONS)}
        value={activityPackTime}
      />
    </div>
  );
}

export default UnitTemplate
