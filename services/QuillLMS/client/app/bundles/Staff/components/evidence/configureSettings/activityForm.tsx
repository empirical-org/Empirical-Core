import * as React from "react";
import { Link } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js';

import PromptsForm from './promptsForm';

import { validateForm, buildActivity } from '../../../helpers/evidence/miscHelpers';
import { renderErrorsContainer, renderIDorUID } from '../../../helpers/evidence/renderHelpers';
import { getActivityPrompt, promptsByConjunction, buildBlankPrompt, getActivityPromptSetter } from '../../../helpers/evidence/promptHelpers';
import {
  BECAUSE,
  BUT,
  SO,
  activityFormKeys,
  TITLE,
  NOTES,
  SCORED_READING_LEVEL,
  TARGET_READING_LEVEL,
  MAX_ATTEMPTS_FEEDBACK,
  PASSAGE,
  IMAGE_LINK,
  IMAGE_ALT_TEXT,
  IMAGE_ATTRIBUTION,
  IMAGE_CAPTION,
  PARENT_ACTIVITY_ID,
  HIGHLIGHT_PROMPT,
  flagOptions,
  MAX_ATTEMPTS_FEEDBACK_TEXT
} from '../../../../../constants/evidence';
import { ActivityInterface, PromptInterface, PassagesInterface, InputEvent, ClickEvent,  TextAreaEvent } from '../../../interfaces/evidenceInterfaces';
import { DataTable, Input, TextEditor, DropdownInput, } from '../../../../Shared/index'
import { DEFAULT_HIGHLIGHT_PROMPT, } from '../../../../Shared/utils/constants'

interface ActivityFormProps {
  activity: ActivityInterface,
  handleClickArchiveActivity: (any) => void,
  requestErrors: string[],
  submitActivity: (activity: object) => void
}

interface InvalidHighlightProps {
  rule_id: number,
  rule_type: string,
  prompt_id: number
}

const RULE_TYPE_TO_ROUTE_PART = {
  autoML: 'semantic-labels',
  plagiarism: 'plagiarism-rules',
  'rules-based-1': 'regex-rules',
  'rules-based-2': 'regex-rules',
  'rules-based-3': 'regex-rules'
}

const RULE_TYPE_TO_NAME = {
  autoML: 'Semantic',
  plagiarism: 'Plagiarism',
  'rules-based-1': 'Sentence Structure Regex',
  'rules-based-2': 'Post-topic Regex',
  'rules-based-3': 'Typo Regex'
}

const ActivityForm = ({ activity, handleClickArchiveActivity, requestErrors, submitActivity }: ActivityFormProps) => {
  const { id, parent_activity_id, invalid_highlights, passages, prompts, scored_level, target_level, title, notes, flag, } = activity;
  const formattedScoredLevel = scored_level || '';
  const formattedTargetLevel = target_level ? target_level.toString() : '';
  const formattedPassage = passages && passages.length ? passages : [{ text: '', highlight_prompt: DEFAULT_HIGHLIGHT_PROMPT }];
  let formattedMaxFeedback;
  if(prompts && prompts[0] && prompts[0].max_attempts_feedback) {
    formattedMaxFeedback = prompts[0].max_attempts_feedback
  } else {
    formattedMaxFeedback = MAX_ATTEMPTS_FEEDBACK_TEXT;
  }
  const formattedPrompts = promptsByConjunction(prompts);
  const becausePrompt = formattedPrompts && formattedPrompts[BECAUSE] ? formattedPrompts[BECAUSE] : buildBlankPrompt(BECAUSE);
  const butPrompt = formattedPrompts && formattedPrompts[BUT] ? formattedPrompts[BUT] : buildBlankPrompt(BUT);
  const soPrompt = formattedPrompts && formattedPrompts[SO] ? formattedPrompts[SO] : buildBlankPrompt(SO);

  const [activityTitle, setActivityTitle] = React.useState<string>(title || '');
  const [activityNotes, setActivityNotes] = React.useState<string>(notes || '');
  const [activityFlag, setActivityFlag] = React.useState<string>(flag || 'alpha');
  const [activityScoredReadingLevel, setActivityScoredReadingLevel] = React.useState<string>(formattedScoredLevel);
  const [activityTargetReadingLevel, setActivityTargetReadingLevel] = React.useState<string>(formattedTargetLevel);
  const [activityPassages, setActivityPassages] = React.useState<PassagesInterface[]>(formattedPassage);
  const [activityMaxFeedback, setActivityMaxFeedback] = React.useState<string>(formattedMaxFeedback)
  const [activityBecausePrompt, setActivityBecausePrompt] = React.useState<PromptInterface>(becausePrompt);
  const [activityButPrompt, setActivityButPrompt] = React.useState<PromptInterface>(butPrompt);
  const [activitySoPrompt, setActivitySoPrompt] = React.useState<PromptInterface>(soPrompt);
  const [errors, setErrors] = React.useState<{}>({});
  const [showHighlights, setShowHighlights] = React.useState(true)

  function toggleShowHighlights(e: ClickEvent) { setShowHighlights(!showHighlights)}

  function handleSetActivityFlag(option: { value: string, label: string }) { setActivityFlag(option.value) };

  function handleSetActivityTitle(e: InputEvent){ setActivityTitle(e.target.value) };

  function handleSetActivityNotes(e: InputEvent){ setActivityNotes(e.target.value) };

  function handleSetActivityMaxFeedback(text: string){ setActivityMaxFeedback(text) };

  function handleSetActivityScoredReadingLevel(e: InputEvent){ setActivityScoredReadingLevel(e.target.value) };

  function handleSetActivityTargetReadingLevel(e: InputEvent){ setActivityTargetReadingLevel(e.target.value) };

  function handleSetHighlightPrompt(e: InputEvent){ handleSetActivityPassages('highlight_prompt', e.target.value) };

  function handleSetImageLink(e: InputEvent){ handleSetActivityPassages('image_link', e.target.value) };

  function handleSetImageAltText(e: InputEvent){ handleSetActivityPassages('image_alt_text', e.target.value) };

  function handleSetPassageText(text: string) { handleSetActivityPassages('text', text)}

  function handleSetImageAttribution(e: TextAreaEvent) { handleSetActivityPassages('image_attribution', e.target.value)}

  function handleSetImageCaption(e: InputEvent) { handleSetActivityPassages('image_caption', e.target.value)}

  function handleSetActivityPassages(key, value){
    const updatedPassages = [...activityPassages];
    updatedPassages[0][key] = value;
    setActivityPassages(updatedPassages)
  };

  function handleSetPrompt (e: InputEvent, conjunction: string) {
    const prompt = getActivityPrompt({ activityBecausePrompt, activityButPrompt, activitySoPrompt, conjunction });
    const updatePrompt = getActivityPromptSetter({ setActivityBecausePrompt, setActivityButPrompt, setActivitySoPrompt, conjunction});
    if(prompt && updatePrompt) {
      prompt.text = e.target.value;
      updatePrompt(prompt);
    }
  }

  function handleSubmitActivity(){
    const activityObject = buildActivity({
      activityFlag,
      activityNotes,
      activityTitle,
      activityScoredReadingLevel,
      activityTargetReadingLevel,
      activityParentActivityId: parent_activity_id,
      activityPassages,
      activityMaxFeedback,
      activityBecausePrompt,
      activityButPrompt,
      activitySoPrompt,
      highlightPrompt: activityPassages[0].highlight_prompt || DEFAULT_HIGHLIGHT_PROMPT
    });
    const state = [
      activityFlag,
      activityTitle,
      activityNotes,
      activityScoredReadingLevel,
      activityTargetReadingLevel,
      activityPassages[0].text,
      activityMaxFeedback,
      activityBecausePrompt.text,
      activityButPrompt.text,
      activitySoPrompt.text,
      activityPassages[0].image_link,
      activityPassages[0].image_alt_text,
      activityPassages[0].image_caption,
      activityPassages[0].image_attribution,
      activityPassages[0].highlight_prompt
    ];
    const validationErrors = validateForm(activityFormKeys, state);
    if(validationErrors && Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      submitActivity(activityObject);
    }
  }

  const formErrorsPresent = !!Object.keys(errors).length;
  const requestErrorsPresent = !!(requestErrors && requestErrors.length);
  const showErrorsContainer = formErrorsPresent || requestErrorsPresent;
  const passageLabelStyle = activityPassages[0].text.length  && activityPassages[0].text !== '<br/>' ? 'has-text' : '';
  const maxAttemptStyle = activityMaxFeedback.length && activityMaxFeedback !== '<br/>' ? 'has-text' : '';
  const imageAttributionGuideLink = 'https://www.notion.so/quill/Activity-Images-9bc3993400da46a6af445a8a0d2d9d3f#11e9a01b071e41bc954e1182d56e93e8';
  const invalidHighlightsPresent = (invalid_highlights && invalid_highlights.length > 0)

  function renderInvalidHighlightLinks(invalidHighlights){
    const formattedRows = invalidHighlights && invalidHighlights.length && invalidHighlights.map((highlight: InvalidHighlightProps) => {
      const { rule_id, rule_type, prompt_id  } = highlight;
      const ruleTypePart = RULE_TYPE_TO_ROUTE_PART[rule_type]
      const ruleName = RULE_TYPE_TO_NAME[rule_type]
      const idPart = (rule_type == 'autoML') ? `${prompt_id}/${rule_id}` : rule_id
      const invalidHighlightLink = (<Link to={`/activities/${id}/${ruleTypePart}/${idPart}`}>{ruleName} Rule #{rule_id}</Link>);
      return {
        id: rule_id,
        link: invalidHighlightLink
      }
    });

    const dataTableFields = [
      { name: "Invalid Highlights", attribute:"link", width: "100%", noTooltip: true }
    ];

    return (
      <DataTable
        className="activities-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
    )
  }

  return(
    <div className="activity-form-container">
      <div className="button-container">
        {activity.id && <a className="quill-button fun secondary outlined" href={`/evidence/#/play?uid=${activity.id}&skipToPrompts=true`} rel="noopener noreferrer" target="_blank">Play Test Activity</a>}
        {activity.id && <a className="quill-button fun secondary outlined" href={`/evidence/#/play?uid=${activity.id}`} rel="noopener noreferrer" target="_blank">Play Student Activity</a>}
        {activity.parent_activity_id && <button className="quill-button fun secondary outlined" onClick={handleClickArchiveActivity} type="button">Archive Activity</button>}
        <button className="quill-button fun primary contained" id="activity-submit-button" onClick={handleSubmitActivity} type="submit">Save</button>
      </div>
      {showErrorsContainer && renderErrorsContainer(formErrorsPresent, requestErrors)}
      <form className="comprehension-activity-form">
        <DropdownInput
          className="flag-input"
          handleChange={handleSetActivityFlag}
          label="Activity Flag"
          options={flagOptions}
          value={flagOptions.find(opt => opt.value === activityFlag)}
        />
        <Input
          className="title-input"
          error={errors[TITLE]}
          handleChange={handleSetActivityTitle}
          label="Activity Title"
          value={activityTitle}
        />
        <Input
          className="name-input"
          error={errors[NOTES]}
          handleChange={handleSetActivityNotes}
          label="Activity Notes"
          value={activityNotes}
        />
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
        {parent_activity_id && renderIDorUID(parent_activity_id, PARENT_ACTIVITY_ID)}
        <Input
          className="image-link-input"
          error={errors[IMAGE_LINK]}
          handleChange={handleSetImageLink}
          label="Image Link"
          value={activityPassages[0].image_link}
        />
        <Input
          className="image-alt-text-input"
          error={errors[IMAGE_ALT_TEXT]}
          handleChange={handleSetImageAltText}
          label="Image Alt Text"
          value={activityPassages[0].image_alt_text}
        />
        <Input
          className="image-caption-text-input"
          error={errors[IMAGE_CAPTION]}
          handleChange={handleSetImageCaption}
          label="Image Caption"
          value={activityPassages[0].image_caption}
        />
        {errors[IMAGE_CAPTION] && <p className="error-message">{errors[IMAGE_CAPTION]}</p>}
        <p className="text-editor-label" id="image-attribution-label"> Image Attribution</p>
        <a className="data-link image-attribution-guide-link" href={imageAttributionGuideLink} rel="noopener noreferrer" target="_blank">Image Atributtion Guide</a>
        <textarea
          className="image-attribution-text-area"
          onChange={handleSetImageAttribution}
          value={activityPassages[0].image_attribution}
        />
        {errors[IMAGE_ATTRIBUTION] && <p className="error-message">{errors[IMAGE_ATTRIBUTION]}</p>}
        <p className={`text-editor-label ${passageLabelStyle}`}>
          <span>Passage</span>
          <button className="quill-button fun secondary outlined focus-on-light" onClick={toggleShowHighlights} type="button">{showHighlights ? 'Hide highlights' : 'Show highlights'}</button>
        </p>
        <div className={showHighlights ? '' : 'hide-highlights'}>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={handleSetPassageText}
            key="passage-description"
            shouldCheckSpelling={true}
            text={activityPassages[0].text}
          />
        </div>
        {errors[PASSAGE] && <p className="error-message">{errors[PASSAGE]}</p>}
        <p className={`text-editor-label ${maxAttemptStyle}`}>Max Attempts Feedback</p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetActivityMaxFeedback}
          key="max-attempt-feedback"
          shouldCheckSpelling={true}
          text={activityMaxFeedback}
        />
        <Input
          className="highlight-prompt-input"
          error={errors[HIGHLIGHT_PROMPT]}
          handleChange={handleSetHighlightPrompt}
          label={`Highlight Prompt: "${DEFAULT_HIGHLIGHT_PROMPT}..."`}
          value={activityPassages[0].highlight_prompt || DEFAULT_HIGHLIGHT_PROMPT}
        />
        {errors[MAX_ATTEMPTS_FEEDBACK] && <p className="error-message">{errors[MAX_ATTEMPTS_FEEDBACK]}</p>}
        <PromptsForm
          activityBecausePrompt={activityBecausePrompt}
          activityButPrompt={activityButPrompt}
          activitySoPrompt={activitySoPrompt}
          errors={errors}
          handleSetPrompt={handleSetPrompt}
        />
      </form>
      {invalidHighlightsPresent && renderInvalidHighlightLinks(invalid_highlights)}
    </div>
  )
}

export default ActivityForm;
