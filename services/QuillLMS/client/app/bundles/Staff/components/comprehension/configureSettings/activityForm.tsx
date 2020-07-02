import * as React from "react";
import { DropdownInput, Input, TextEditor } from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
// import { flagOptions } from '../../../../../constants/comprehension'
import { validateForm, buildBlankPrompt, formatPrompt } from '../../../helpers/comprehension';
import { BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import { ActivityInterface, FlagInterface, PromptInterface, PassagesInterface } from '../../../interfaces/comprehensionInterfaces';
import stripHtml from "string-strip-html";

// TODO: add form inputs for course, target reading level and reading level score

interface ActivityFormProps {
  activity: ActivityInterface,
  closeModal: (event: React.MouseEvent) => void,
  submitActivity: (activity: ActivityInterface, csrfToken: string) => void
}
type InputEvent = React.ChangeEvent<HTMLInputElement>;

const ActivityForm = ({ activity, closeModal, submitActivity }: ActivityFormProps) => {

  const { parent_activity_id, passages, prompts, scored_level, target_level, title } = activity;
  // const formattedFlag = flag ? { label: flag, value: flag } : flagOptions[0];
  const formattedScoredLevel = scored_level ? scored_level : '';
  const formattedTargetLevel = target_level ? target_level.toString() : '';
  const formattedPassage = passages && passages.length ? passages : [{ text: ''}];
  const formattedMaxFeedback = prompts[0] && prompts[0].max_attempts_feedback ? prompts[0].max_attempts_feedback : '';
  const becausePrompt = prompts && prompts.length ? prompts[0] : buildBlankPrompt(BECAUSE);
  const butPrompt = prompts && prompts.length ? prompts[1] : buildBlankPrompt(BUT);
  const soPrompt = prompts && prompts.length ? prompts[2] : buildBlankPrompt(SO);

  const [activityTitle, setActivityTitle] = React.useState<string>(title || '');
  // const [activityFlag, setActivityFlag] = React.useState<FlagInterface>(formattedFlag);
  const [activityScoredReadingLevel, setActivityScoredReadingLevel] = React.useState<string>(formattedScoredLevel);
  const [activityTargetReadingLevel, setActivityTargetReadingLevel] = React.useState<string>(formattedTargetLevel);
  const [activityPassages, setActivityPassages] = React.useState<PassagesInterface[]>(formattedPassage);
  const [activityMaxFeedback, setActivityMaxFeedback] = React.useState<string>(formattedMaxFeedback)
  const [activityBecausePrompt, setActivityBecausePrompt] = React.useState<PromptInterface>(becausePrompt);
  const [activityButPrompt, setActivityButPrompt] = React.useState<PromptInterface>(butPrompt);
  const [activitySoPrompt, setActivitySoPrompt] = React.useState<PromptInterface>(soPrompt);
  const [errors, setErrors] = React.useState<{}>({});

  const handleSetActivityTitle = (e: InputEvent) => { setActivityTitle(e.target.value) };

  // const handleSetActivityFlag = (flag: FlagInterface) => { setActivityFlag(flag) };

  const handleSetActivityMaxFeedback = (text: string) => { setActivityMaxFeedback(text) };

  const handleSetActivityScoredReadingLevel = (e: InputEvent) => { setActivityScoredReadingLevel(e.target.value) };

  const handleSetActivityTargetReadingLevel = (e: InputEvent) => { setActivityTargetReadingLevel(e.target.value) };

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
    // const { label } = activityFlag;
    const prompts = [activityBecausePrompt, activityButPrompt, activitySoPrompt].map(prompt => {
      prompt.max_attempts_feedback = activityMaxFeedback
      return prompt;
    });
    return {
      title: activityTitle,
      parent_activity_id,
      // flag: label,
      scored_level: activityScoredReadingLevel,
      target_level: parseInt(activityTargetReadingLevel),
      passages_attributes: activityPassages,
      prompts_attributes: [
        formatPrompt(prompts[0]), 
        formatPrompt(prompts[1]), 
        formatPrompt(prompts[2])
      ]
    };
  }

  const handleSubmitActivity = () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const activityObject = buildActivity();
    const keys = [
      'Title', 
      'Scored reading level', 
      'Target reading level',
      'Max attempts feedback',
      'Passage', 
      'Because stem', 
      'But stem', 
      'So stem'
    ];
    const state = [
      activityTitle,
      activityScoredReadingLevel,
      activityTargetReadingLevel,
      activityMaxFeedback,
      activityPassages[0].text, 
      activityBecausePrompt.text, 
      activityButPrompt.text, 
      activitySoPrompt.text
    ];
    const validationErrors = validateForm(keys, state);
    if(validationErrors && Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
    } else {
      submitActivity(activityObject, csrfToken);
    }
  }

  const errorsPresent = !!Object.keys(errors).length;
  const passageLabelStyle = stripHtml(activityPassages[0].text).length ? 'has-text' : '';
  const maxAttemptStyle = stripHtml(activityMaxFeedback).length ? 'has-text' : '';

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
          error={errors['Scored reading level']}
          handleChange={handleSetActivityScoredReadingLevel}
          label="Scored Reading Level"
          value={activityScoredReadingLevel}
        />
        <Input
          className="target-reading-level-input"
          error={errors['Target reading level']}
          handleChange={handleSetActivityTargetReadingLevel}
          label="Target Reading Level"
          value={activityTargetReadingLevel}
        />
        <p className={`text-editor-label ${passageLabelStyle}`}>Passage</p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetActivityPassages}
          key="passage-description"
          text={activityPassages[0].text}
        />
        {errors['Passage'] && <p className="error-message">{errors['Passage']}</p>}
        <p className={`text-editor-label ${maxAttemptStyle}`}>Max Attemps Feedback</p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetActivityMaxFeedback}
          key="max-attempt-feedback"
          text={activityMaxFeedback}
        />
        {errors['Max attempts feedback'] && <p className="error-message">{errors['Max attempts feedback']}</p>}
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
