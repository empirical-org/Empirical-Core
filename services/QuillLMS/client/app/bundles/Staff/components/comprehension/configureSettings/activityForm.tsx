import * as React from "react";
import { EditorState, ContentState } from 'draft-js';

// import { flagOptions } from '../../../../../constants/comprehension'
import { validateForm, buildActivity, buildBlankPrompt, promptsByConjunction } from '../../../helpers/comprehension';
import {
  BECAUSE,
  BUT,
  SO,
  activityFormKeys,
  TITLE,
  SCORED_READING_LEVEL,
  TARGET_READING_LEVEL,
  PARENT_ACTIVITY_ID,
  MAX_ATTEMPTS_FEEDBACK,
  PASSAGE,
  BECAUSE_STEM,
  BUT_STEM,
  SO_STEM
} from '../../../../../constants/comprehension';
import { ActivityInterface, PromptInterface, PassagesInterface } from '../../../interfaces/comprehensionInterfaces';
import { Input, TextEditor, } from '../../../../Shared/index'

interface ActivityFormProps {
  activity: ActivityInterface,
  closeModal: (event: React.MouseEvent) => void,
  submitActivity: (activity: object) => void
}
type InputEvent = React.ChangeEvent<HTMLInputElement>;

const ActivityForm = ({ activity, closeModal, submitActivity }: ActivityFormProps) => {

  const { parent_activity_id, passages, prompts, scored_level, target_level, title } = activity;
  // const formattedFlag = flag ? { label: flag, value: flag } : flagOptions[0];
  const formattedScoredLevel = scored_level || '';
  const formattedTargetLevel = target_level ? target_level.toString() : '';
  const formattedParentActivityId = parent_activity_id ? parent_activity_id.toString() : '';
  const formattedPassage = passages && passages.length ? passages : [{ text: ''}];
  const formattedMaxFeedback = prompts && prompts[0] && prompts[0].max_attempts_feedback ? prompts[0].max_attempts_feedback : '';
  const formattedPrompts = promptsByConjunction(prompts);
  const becausePrompt = formattedPrompts && formattedPrompts[BECAUSE] ? formattedPrompts[BECAUSE] : buildBlankPrompt(BECAUSE);
  const butPrompt = formattedPrompts && formattedPrompts[BUT] ? formattedPrompts[BUT] : buildBlankPrompt(BUT);
  const soPrompt = formattedPrompts && formattedPrompts[SO] ? formattedPrompts[SO] : buildBlankPrompt(SO);

  const [activityTitle, setActivityTitle] = React.useState<string>(title || '');
  // const [activityFlag, setActivityFlag] = React.useState<FlagInterface>(formattedFlag);
  const [activityScoredReadingLevel, setActivityScoredReadingLevel] = React.useState<string>(formattedScoredLevel);
  const [activityTargetReadingLevel, setActivityTargetReadingLevel] = React.useState<string>(formattedTargetLevel);
  const [activityParentActivityId, setActivityParentActivityId] = React.useState<string>(formattedParentActivityId);
  const [activityPassages, setActivityPassages] = React.useState<PassagesInterface[]>(formattedPassage);
  const [activityMaxFeedback, setActivityMaxFeedback] = React.useState<string>(formattedMaxFeedback)
  const [activityBecausePrompt, setActivityBecausePrompt] = React.useState<PromptInterface>(becausePrompt);
  const [activityButPrompt, setActivityButPrompt] = React.useState<PromptInterface>(butPrompt);
  const [activitySoPrompt, setActivitySoPrompt] = React.useState<PromptInterface>(soPrompt);
  const [errors, setErrors] = React.useState<{}>({});

  function handleSetActivityTitle(e: InputEvent){ setActivityTitle(e.target.value) };

  // const handleSetActivityFlag = (flag: FlagInterface) => { setActivityFlag(flag) };

  function handleSetActivityMaxFeedback(text: string){ setActivityMaxFeedback(text) };

  function handleSetActivityScoredReadingLevel(e: InputEvent){ setActivityScoredReadingLevel(e.target.value) };

  function handleSetActivityTargetReadingLevel(e: InputEvent){ setActivityTargetReadingLevel(e.target.value) };

  function handleSetActivityParentActivityId(e: InputEvent){ setActivityParentActivityId(e.target.value) };

  function handleSetActivityPassages(text: string){
    const updatedPassages = [...activityPassages];
    updatedPassages[0].text = text;
    setActivityPassages(updatedPassages)
   };

  function handleSetActivityBecausePrompt(e: InputEvent){
    const updatedBecausePrompt = {...activityBecausePrompt};
    updatedBecausePrompt.text = e.target.value;
    setActivityBecausePrompt(updatedBecausePrompt)
  };

  function handleSetActivityButPrompt(e: InputEvent){
    const updatedButPrompt = {...activityButPrompt};
    updatedButPrompt.text = e.target.value;
    setActivityButPrompt(updatedButPrompt)
  };

  function handleSetActivitySoPrompt(e: InputEvent){
    const updatedSoPrompt = {...activitySoPrompt};
    updatedSoPrompt.text = e.target.value;
    setActivitySoPrompt(updatedSoPrompt)
  };

  function handleSubmitActivity(){
    const activityObject = buildActivity({
      activityTitle,
      activityScoredReadingLevel,
      activityTargetReadingLevel,
      activityParentActivityId,
      activityPassages,
      activityMaxFeedback,
      activityBecausePrompt,
      activityButPrompt,
      activitySoPrompt
    });
    const state = [
      activityTitle,
      activityScoredReadingLevel,
      activityTargetReadingLevel,
      activityParentActivityId,
      activityMaxFeedback,
      activityPassages[0].text,
      activityBecausePrompt.text,
      activityButPrompt.text,
      activitySoPrompt.text
    ];
    const validationErrors = validateForm(activityFormKeys, state);
    if(validationErrors && Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
    } else {
      submitActivity(activityObject);
    }
  }

  const errorsPresent = !!Object.keys(errors).length;
  const passageLabelStyle = activityPassages[0].text.length  && activityPassages[0].text !== '<br/>' ? 'has-text' : '';
  const maxAttemptStyle = activityMaxFeedback.length && activityMaxFeedback !== '<br/>' ? 'has-text' : '';

  return(
    <div className="activity-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="button">x</button>
      </div>
      <form className="activity-form">
        <Input
          className="title-input"
          error={errors[TITLE]}
          handleChange={handleSetActivityTitle}
          label="Title"
          value={activityTitle}
        />
        {/* <DropdownInput
          className="flag-input"
          handleChange={handleSetActivityFlag}
          isSearchable={true}
          label="Development Stage"
          options={flagOptions}
          value={activityFlag}
        /> */}
        <Input
          className="scored-reading-level-input"
          error={errors[SCORED_READING_LEVEL]}
          handleChange={handleSetActivityScoredReadingLevel}
          label="Scored Reading Level"
          value={activityScoredReadingLevel}
        />
        <Input
          className="target-reading-level-input"
          error={errors[TARGET_READING_LEVEL]}
          handleChange={handleSetActivityTargetReadingLevel}
          label="Target Reading Level"
          value={activityTargetReadingLevel}
        />
        <Input
          className="parent-activity-id-input"
          error={errors[PARENT_ACTIVITY_ID]}
          handleChange={handleSetActivityParentActivityId}
          label="Parent Activity ID"
          value={activityParentActivityId}
        />
        <p className={`text-editor-label ${passageLabelStyle}`}>Passage</p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetActivityPassages}
          key="passage-description"
          text={activityPassages[0].text}
        />
        {errors[PASSAGE] && <p className="error-message">{errors[PASSAGE]}</p>}
        <p className={`text-editor-label ${maxAttemptStyle}`}>Max Attemps Feedback</p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetActivityMaxFeedback}
          key="max-attempt-feedback"
          text={activityMaxFeedback}
        />
        {errors[MAX_ATTEMPTS_FEEDBACK] && <p className="error-message">{errors[MAX_ATTEMPTS_FEEDBACK]}</p>}
        <Input
          className="because-input"
          error={errors[BECAUSE_STEM]}
          handleChange={handleSetActivityBecausePrompt}
          label="Because Stem"
          value={activityBecausePrompt.text}
        />
        <Input
          className="but-input"
          error={errors[BUT_STEM]}
          handleChange={handleSetActivityButPrompt}
          label="But Stem"
          value={activityButPrompt.text}
        />
        <Input
          className="so-input"
          error={errors[SO_STEM]}
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
