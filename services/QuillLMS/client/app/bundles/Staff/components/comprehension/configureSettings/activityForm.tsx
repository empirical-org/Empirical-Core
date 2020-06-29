import * as React from "react";
import { DropdownInput, Input, TextEditor } from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import { flagOptions } from '../../../../../constants/comprehension'
import { validateForm, buildBlankPrompt } from '../../../../../helpers/comprehension';
import { BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import { ActivityInterface, FlagInterface, PromptInterface, PassagesInterface } from '../../../interfaces/comprehensionInterfaces';

// TODO: add form inputs for course, target reading level and reading level score

interface ActivityFormProps {
  activity: ActivityInterface,
  closeModal: (event: React.MouseEvent) => void,
  submitActivity: (activity: ActivityInterface) => void
}
type InputEvent = React.ChangeEvent<HTMLInputElement>;

const ActivityForm = ({ activity, closeModal, submitActivity }: ActivityFormProps) => {

  const { id, flag, passages, prompts } = activity;
  const formattedFlag = flag ? { label: flag, value: flag } : flagOptions[0];
  const formattedPassage = passages && passages.length ? passages : [{ text: ''}];
  const becausePrompt = prompts && prompts.length ? prompts[0] : buildBlankPrompt(BECAUSE);
  const butPrompt = prompts && prompts.length ? prompts[1] : buildBlankPrompt(BUT);
  const soPrompt = prompts && prompts.length ? prompts[2] : buildBlankPrompt(SO);

  const [activityTitle, setActivityTitle] = React.useState<string>(activity.title || '');
  const [activityFlag, setActivityFlag] = React.useState<FlagInterface>(formattedFlag);
  const [activityPassages, setActivityPassages] = React.useState<PassagesInterface[]>(formattedPassage);
  const [activityBecausePrompt, setActivityBecausePrompt] = React.useState<PromptInterface>(becausePrompt);
  const [activityButPrompt, setActivityButPrompt] = React.useState<PromptInterface>(butPrompt);
  const [activitySoPrompt, setActivitySoPrompt] = React.useState<PromptInterface>(soPrompt);
  const [errors, setErrors] = React.useState<{}>({});

  const handleSetActivityTitle = (e: InputEvent) => { setActivityTitle(e.target.value) };
  const handleSetActivityFlag = (flag: FlagInterface) => { setActivityFlag(flag) };
  const handleSetActivityPassages = (text: string) => { 
    const updatedPassages = [...activityPassages];
    updatedPassages[0].text = text;
    setActivityPassages(updatedPassages)
   };
  const handleSetActivityBecausePrompt = (e: InputEvent) => {
    const updatedBecausePrompt = {...activityBecausePrompt};
    updatedBecausePrompt.text = e.target.value;
    setActivityBecausePrompt(updatedBecausePrompt) 
  };
  const handleSetActivityButPrompt = (e: InputEvent) => { 
    const updatedButPrompt = {...activityButPrompt};
    updatedButPrompt.text = e.target.value;
    setActivityButPrompt(updatedButPrompt)  
  };
  const handleSetActivitySoPrompt = (e: InputEvent) => { 
    const updatedSoPrompt = {...activitySoPrompt};
    updatedSoPrompt.text = e.target.value;
    setActivitySoPrompt(updatedSoPrompt)  
  };

  const buildActivity = () => {
    const { label } = activityFlag;
    return {
      id: id || null,
      title: activityTitle,
      flag: label,
      passages: activityPassages,
      prompts: [activityBecausePrompt, activityButPrompt, activitySoPrompt]
    };
  }

  const handleSubmitActivity = () => {
    const activityObject = buildActivity();
    const keys = ['Title', 'Passage', 'Because stem', 'But stem', 'So stem'];
    const state = [activityTitle, activityPassages[0].text, activityBecausePrompt.text, activityButPrompt.text, activitySoPrompt.text];
    const validationErrors = validateForm(keys, state);
    if(validationErrors && Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
    } else {
      submitActivity(activityObject);
    }
  }

  const errorsPresent = !!Object.keys(errors).length;

  return(
    <div className="activity-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="button">x</button>
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
          handleTextChange={handleSetActivityPassages}
          key="passage-description"
          text={activityPassages[0].text}
        />
        {errors['Passage'] && <p className="error-message">{errors['Passage']}</p>}
        <Input
          className="because-input"
          error={errors['Because stem']}
          handleChange={handleSetActivityBecausePrompt}
          label="Because Stem"
          value={activityBecausePrompt.text}
        />
        <Input
          className="but-input"
          error={errors['But stem']}
          handleChange={handleSetActivityButPrompt}
          label="But Stem"
          value={activityButPrompt.text}
        />
        <Input
          className="so-input"
          error={errors['So stem']}
          handleChange={handleSetActivitySoPrompt}
          label="So Stem" 
          value={activitySoPrompt.text}
        />
        <div className="submit-button-container">
          {errorsPresent && <div className="error-message-container">
            <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
          </div>}
          <button className="quill-button fun primary contained" id="activity-submit-button" onClick={handleSubmitActivity} type="submit">
            Submit
          </button>
          <button className="quill-button fun primary contained" id="activity-cancel-button" onClick={closeModal} type="button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ActivityForm;
