import * as React from 'react';
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

export const UnitTemplate = ({ unitTemplate }) => {
  console.log("🚀 ~ file: unit_template.tsx ~ line 355 ~ UnitTemplate ~ unitTemplate", unitTemplate)
  const { id, flag, time, unit_template_category, name, activity_info, readability, diagnostic_names, activities } = unitTemplate;
  const [activityPackFlag, setActivityPackFlag] = React.useState<DropdownObjectInterface>(flag ? {value: flag, label: flag} : null);
  const [activityPackName, setActivityPackName] = React.useState<any>(name);
  const [activityPackInfo, setActivityPackInfo] = React.useState<string>(activity_info);
  const [activityPackType, setActivityPackType] = React.useState<DropdownObjectInterface>(unit_template_category ? {value: unit_template_category.name, label: unit_template_category.name} : null);
  const [activityPackTime, setActivityPackTime] = React.useState<DropdownObjectInterface>(time ? {value: time.toString(), label: time.toString()} : null);
  const [activityPackActivities, setActivityPackActivities] = React.useState<any>(activities ? activities : []);
  const [uploadedFileLink, setUploadedFileLink] = React.useState<string>('');
  const [errors, setErrors] = React.useState<any>(null);


  function getOptions(options: string[]) {
    return options.map((option: string) => ({ value: option, label: option }));
  }

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

  function handlePackDescriptionChange(text: string) {
    setActivityPackInfo(text);
  }

  function handleFileDrop(acceptedFiles) {
    acceptedFiles.forEach(file => {
      const data = new FormData()
      data.append('file', file)
      fetch(`${process.env.DEFAULT_URL}/cms/images`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': getAuthToken()
        },
        body: data
      })
        .then(response => response.json()) // if the response is a JSON object
        .then(response => setUploadedFileLink(response.url)); // Handle the success response object
    });
  }

  function handleNewSelectedActivities(newSelectedActivities) {
    const selectedActivities = newSelectedActivities.map(item => item.id);
    const newOrderedActivities = selectedActivities.map((key, i) => {
      const activity = activityPackActivities.find(activity => activity.id === key);
      activity.order_number = i;
      return activity;
    }).sort((firstActivity, secondActivity) => firstActivity.order_number - secondActivity.order_number)
    setActivityPackActivities(newOrderedActivities);
  }

  function toggleActivitySelection(activity) {
    if (activityPackActivities.find(act => act.id === activity.id)) {
      const filteredActivities = activityPackActivities.filter(act => act.id !== activity.id);
      setActivityPackActivities(filteredActivities);
    } else {
      const newActivity = {...activity};
      const updatedActivityPackActivities = [...activityPackActivities];
      newActivity.order_number = activityPackActivities.length;
      updatedActivityPackActivities.push(newActivity);
      setActivityPackActivities(updatedActivityPackActivities );
    }
  }

  function handleSaveUnitTemplate() {
    console.log('saved!')
  }

  function renderActivityPackPreviewLink() {
    if(!id) { return };
    const url = `${process.env.DEFAULT_URL}/assign/featured-activity-packs/${id}`;
    return <a className="link-green" href={url} rel="noopener noreferrer" target="_blank">Preview in Featured Activity Pack page</a>;
  }

  function renderReadabilitySection() {
    return (
      <section className="readability-section">
        <h3>Readability:</h3>
        {readability && <p>{readability}</p>}
      </section>
    )
  }

  function renderDiagnosticsSection() {
    return (
      <section className="diagnostic-section">
        <h3>Diagnostics:</h3>
        <section>
          {diagnostic_names && diagnostic_names.map((diagnostic) => {
            return <p>{diagnostic}</p>;
          })}
        </section>
      </section>
    );
  }

  function renderPdfUploadSection() {
    return (
      <div>
        <label>Click the square below or drag a file into it to upload a file:</label>
        <Dropzone onDrop={handleFileDrop} />
        <p>Here is the link to your uploaded file:</p>
        {uploadedFileLink && <a href={uploadedFileLink} rel="noopener noreferrer" target="_blank">{uploadedFileLink}</a>}
      </div>
    )
  }

  return(
    <div id="unit-template-editor">
      <DropdownInput
        handleChange={handleFlagChange}
        label="Select flag"
        options={getOptions(FLAG_DROPDOWN_OPTIONS)}
        value={activityPackFlag}
      />
      {renderActivityPackPreviewLink()}
      <Input
        className="name-input"
        error={errors ? errors['name'] : null}
        handleChange={handleNameChange}
        label="Name"
        value={activityPackName}
      />
      <section className="activity-pack-description">
        <label htmlFor="activity-pack-description">Activity Pack Description</label>
        <TextEditor
          id="activity-pack-description"
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handlePackDescriptionChange}
          key="activity-pack-description"
          shouldCheckSpelling={true}
          text={activityPackInfo}
        />
      </section>
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
      {renderDiagnosticsSection()}
      {renderReadabilitySection()}
      {renderPdfUploadSection()}
      <section>
        <UnitTemplateActivitySelector
          parentActivities={activityPackActivities}
          setParentActivities={handleNewSelectedActivities}
          toggleParentActivity={toggleActivitySelection}
        />
      </section>
      <div className="error-message-and-button">
        <button className="quill-button primary contained medium focus-on-light" id="continue" onClick={handleSaveUnitTemplate}>Save</button>
      </div>
    </div>
  );
}

export default UnitTemplate
