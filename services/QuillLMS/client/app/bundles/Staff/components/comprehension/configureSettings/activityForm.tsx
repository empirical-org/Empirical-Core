import * as React from "react";
import { DropdownInput, Input, TextEditor } from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import { flagOptions } from '../../../../../constants/comprehension'
import { validateForm } from '../../../../../helpers/comprehension';

// TODO: add form inputs for course, target reading level and reading level score

const ActivityForm = (props) => {

  const { activity, closeModal, submitActivity } = props;
  const { flag, passages, prompts } = activity;
  const formattedFlag = flag ? { label: flag, value: flag } : flagOptions[0];
  const formattedPassage = passages ? passages[0] : '';
  const becausePrompt = prompts ? prompts[0].text : '';
  const butPrompt = prompts ? prompts[1].text : '';
  const soPrompt = prompts ? prompts[2].text : '';

  const [activityTitle, setActivityTitle] = React.useState(activity.title || '');
  const [activityFlag, setActivityFlag] = React.useState(formattedFlag);
  const [activityPassage, setActivityPassage] = React.useState(formattedPassage);
  const [activityBecausePrompt, setActivityBecausePrompt] = React.useState(becausePrompt);
  const [activityButPrompt, setActivityButPrompt] = React.useState(butPrompt);
  const [activitySoPrompt, setActivitySoPrompt] = React.useState(soPrompt);
  const [errors, setErrors] = React.useState([]);

  const handleSetActivityTitle = (e) => { setActivityTitle(e.target.value) };
  const handleSetActivityFlag = (flag) => { setActivityFlag(flag) };
  const handleSetActivityPassage = (text) => { setActivityPassage(text) };
  const handleSetActivityBecausePrompt = (e) => { setActivityBecausePrompt(e.target.value) };
  const handleSetActivityButPrompt = (e) => { setActivityButPrompt(e.target.value) };
  const handleSetActivitySoPrompt = (e) => { setActivitySoPrompt(e.target.value) };

  const buildActivity = () => {
    return {
      title: activityTitle,
      flag: activityFlag,
      passages: [activityPassage],
      prompts: [becausePrompt, butPrompt, soPrompt]
    };
  }

  const handleSubmitActivity = () => {
    const activity = buildActivity();
    const keys = ['Title', 'Passage', 'Because stem', 'But stem', 'So stem'];
    const state = [activityTitle, activityPassage, activityBecausePrompt, activityButPrompt, activitySoPrompt];
    const validationErrors = validateForm(keys, state);
    if(validationErrors && Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
    } else {
      submitActivity(activity);
    }
  }

  const errorsPresent = Object.keys(errors).length !== 0;

  return(
    <div className="activity-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="submit">x</button>
      </div>
      <form className="activity-form">
        <Input
          className="title-input"
          error={errors['Title']}
          handleChange={handleSetActivityTitle}
          label="Title"
          value={activityTitle}
        />
        <DropdownInput
          className="flag-input"
          handleChange={handleSetActivityFlag}
          isSearchable={true}
          label="Development Stage"
          options={flagOptions}
          value={activityFlag}
        />
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetActivityPassage}
          key="passage-description"
          text={activityPassage}
        />
        {errors['Passage'] && <p className="error-message">{errors['Passage']}</p>}
        <Input
          className="because-input"
          error={errors['Because stem']}
          handleChange={handleSetActivityBecausePrompt}
          label="Because Stem"
          value={activityBecausePrompt}
        />
        <Input
          className="but-input"
          error={errors['But stem']}
          handleChange={handleSetActivityButPrompt}
          label="But Stem"
          value={activityButPrompt}
        />
        <Input
          className="so-input"
          error={errors['So stem']}
          handleChange={handleSetActivitySoPrompt}
          label="So Stem" 
          value={activitySoPrompt}
        />
        <div className="submit-button-container">
          {errorsPresent && <div className="error-message-container">
            <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
          </div>}
          <button className="quill-button fun primary contained" id="activity-submit-button" onClick={handleSubmitActivity} type="submit">
            Submit
          </button>
          <button className="quill-button fun primary contained" id="activity-cancel-button" onClick={closeModal} type="submit">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ActivityForm;
