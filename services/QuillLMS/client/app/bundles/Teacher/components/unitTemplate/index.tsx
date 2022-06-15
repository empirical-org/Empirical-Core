import * as React from 'react';
import { EditorState, ContentState } from 'draft-js';
import Dropzone from 'react-dropzone'

import UnitTemplateActivitySelector from './unitTemplateActivitySelector'

import { DropdownInput, Input, TextEditor, Tooltip, Modal, PRODUCTION_FLAG, ALPHA_FLAG, BETA_FLAG, GAMMA_FLAG, ARCHIVED_FLAG, PRIVATE_FLAG } from '../../../Shared/index'
import getAuthToken from '../modules/get_auth_token';
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces';
import { validateUnitTemplateForm } from '../../helpers/unitTemplates';
import { fetchUnitTemplateCategories, updateUnitTemplate, createUnitTemplate } from '../../utils/unitTemplateAPIs';

const FLAG_DROPDOWN_OPTIONS = [PRODUCTION_FLAG, ALPHA_FLAG, BETA_FLAG, GAMMA_FLAG, ARCHIVED_FLAG, PRIVATE_FLAG];
const TIME_OPTIONS = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190'];
const SUCCESS_MESSAGE = 'Activity pack successfully saved!';

export const UnitTemplate = ({ unitTemplate }) => {
  const { id, flag, time, unit_template_category, name, activity_info, readability, diagnostic_names, activities } = unitTemplate;
  const [activityPackFlag, setActivityPackFlag] = React.useState<DropdownObjectInterface>(flag ? {value: flag, label: flag} : null);
  const [activityPackName, setActivityPackName] = React.useState<any>(name);
  const [activityPackInfo, setActivityPackInfo] = React.useState<string>(activity_info);
  const [activityPackType, setActivityPackType] = React.useState<DropdownObjectInterface>(unit_template_category ? {value: unit_template_category.name, label: unit_template_category.name} : null);
  const [activityPackTime, setActivityPackTime] = React.useState<DropdownObjectInterface>(time ? {value: time.toString(), label: time.toString()} : null);
  const [activityPackActivities, setActivityPackActivities] = React.useState<any>(activities ? activities : []);
  const [unitTemplateCategories, setUnitTemplateCategories] = React.useState<any>([])
  const [uploadedFileLink, setUploadedFileLink] = React.useState<string>('');
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [errors, setErrors] = React.useState<any>(null);

  React.useEffect(() => {
    fetchUnitTemplateCategories().then(response => {
      if(response.unitTemplateCategories) {
        const options = response.unitTemplateCategories.map(unitTemplateCategory => ({ label: unitTemplateCategory.name, value: unitTemplateCategory.id }));
        setUnitTemplateCategories(options);
      } else {
        const { error } = response;
        setModalMessage(error);
        setShowModal(true);
      }
    })
  }, []);

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
    const errors = validateUnitTemplateForm({ activityPackFlag, activityPackName, activityPackType });
    if(Object.keys(errors).length) {
      return setErrors(errors);
    }
    setErrors(null);
    const unitTemplateObject = {
      name: activityPackName,
      flag: activityPackFlag.value,
      activity_info: activityPackInfo,
      time: activityPackTime.value,
      unit_template_category_id: activityPackType.value,
      activity_ids: activityPackActivities.map(activity => activity.id),
      invalidParam: true
    };
    if(id) {
      updateUnitTemplate(unitTemplateObject, id).then(response => {
        if(response.success) {
          setModalMessage(SUCCESS_MESSAGE);
          setShowModal(true);
        } else {
          const { error } = response;
          setModalMessage(error);
          setShowModal(true);
        }
      })
    } else {
      createUnitTemplate(unitTemplateObject).then(response => {
        if(response.success) {
          setModalMessage(SUCCESS_MESSAGE);
          setShowModal(true);
        } else {
          const { error } = response;
          setModalMessage(error);
          setShowModal(true);
        }
      })
    }
  }

  function handleCloseSubmissionModal() {
    setShowModal(false);
  }

  function renderActivityPackPreviewLink() {
    if(!id) { return };
    const url = `${process.env.DEFAULT_URL}/assign/featured-activity-packs/${id}`;
    return(
      <div className="padded-element">
        <a className="data-link" href={url} rel="noopener noreferrer" target="_blank">Preview in Featured Activity Pack page</a>
      </div>
    );
  }

  function renderReadabilitySection() {
    return (
      <section className="readability-section padded-element">
        <h3>Readability:</h3>
        {!readability && <p>N/A</p>}
        {readability && <p>{readability}</p>}
      </section>
    )
  }

  function renderDiagnosticsSection() {
    return (
      <section className="diagnostics-section padded-element">
        <h3>Diagnostics:</h3>
        <section className="diagnostics">
          {!diagnostic_names && <p>N/A</p>}
          {diagnostic_names && diagnostic_names.map((diagnostic) => {
            return <p>{diagnostic}</p>;
          })}
        </section>
      </section>
    );
  }

  function renderPdfUploadSection() {
    return (
      <div className="pdf-upload-container padded-element">
        <label>Click the square below or drag a file into it to upload a file:</label>
        <Dropzone onDrop={handleFileDrop} />
        <p>Here is the link to your uploaded file:</p>
        {uploadedFileLink && <a href={uploadedFileLink} rel="noopener noreferrer" target="_blank">{uploadedFileLink}</a>}
      </div>
    )
  }

  function renderSubmissionModal() {
    return(
      <Modal className="rule-view-form-modal">
        <section className="submission-modal-contents">
          <p>{modalMessage}</p>
          <button className="quill-button primary contained fun focus-on-light" onClick={handleCloseSubmissionModal}>Close</button>
        </section>
      </Modal>
    )
  }

  return(
    <div className="cms-unit-template-editor" id="unit-template-editor">
      {showModal && renderSubmissionModal()}
      <DropdownInput
        error={errors && errors['activityPackFlag']}
        handleChange={handleFlagChange}
        isSearchable={true}
        label="Select flag"
        options={getOptions(FLAG_DROPDOWN_OPTIONS)}
        value={activityPackFlag}
      />
      {renderActivityPackPreviewLink()}
      <Input
        className="name-input"
        error={errors && errors['activityPackName']}
        handleChange={handleNameChange}
        label="Name"
        value={activityPackName}
      />
      <section className="activity-pack-description-container padded-element">
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
      <section className="middle-section">
        <section className="activity-pack-type-container">
          <label htmlFor="pack-type-dropdown">
            <Tooltip tooltipText="Unit Template Category" tooltipTriggerText="Pack Type" />
          </label>
          <DropdownInput
            error={errors && errors['activityPackType']}
            handleChange={handlePackTypeChange}
            id="pack-type-dropdown"
            isSearchable={true}
            options={unitTemplateCategories}
            value={activityPackType}
          />
        </section>
        <DropdownInput
          handleChange={handleTimeChange}
          id="time-dropdown"
          isSearchable={true}
          label="Select time in minutes"
          options={getOptions(TIME_OPTIONS)}
          value={activityPackTime}
        />
        {renderDiagnosticsSection()}
        {renderReadabilitySection()}
      </section>
      {renderPdfUploadSection()}
      <section className="activity-selector-container padded-element">
        <UnitTemplateActivitySelector
          parentActivities={activityPackActivities}
          setParentActivities={handleNewSelectedActivities}
          toggleParentActivity={toggleActivitySelection}
        />
      </section>
      <div className="error-message-and-button">
        {errors && <p className="all-errors-message">Please fix the form errors and try submitting again.</p>}
        <button className="quill-button primary contained medium focus-on-light" id="continue" onClick={handleSaveUnitTemplate}>Save</button>
      </div>
    </div>
  );
}

export default UnitTemplate
