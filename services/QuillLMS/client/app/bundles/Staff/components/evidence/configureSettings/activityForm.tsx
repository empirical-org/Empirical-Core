import * as React from "react";
import { EditorState, ContentState } from 'draft-js';
import * as _ from 'lodash'

import PromptsForm from './promptsForm';
import UpperFormSection from './upperFormSection';
import MaxAttemptsEditor from "./maxAttemptsEditor";
import ImageSection from "./imageSection";

import { validateForm, buildActivity, validateFormSection } from '../../../helpers/evidence/miscHelpers';
import { renderInvalidHighlightLinks} from '../../../helpers/evidence/renderHelpers';
import { getActivityPrompt, promptsByConjunction, buildBlankPrompt, getActivityPromptSetter, trimmedPrompt  } from '../../../helpers/evidence/promptHelpers';
import {
  BECAUSE, BUT, SO, activityFormKeys, PASSAGE, HIGHLIGHT_PROMPT, ESSENTIAL_KNOWLEDGE_TEXT_FILLER,
  BUILDING_ESSENTIAL_KNOWLEDGE, HIGHLIGHTING_PROMPT, IMAGE, MAX_ATTEMPTS_FEEDBACK, BREAK_TAG, TEXT, PROMPTS
} from '../../../../../constants/evidence';
import { ActivityInterface, PromptInterface, PassagesInterface, InputEvent, ClickEvent,  TextAreaEvent } from '../../../interfaces/evidenceInterfaces';
import { Input, TextEditor, ToggleComponentSection, DataTable, titleCase } from '../../../../Shared/index'
import { DEFAULT_HIGHLIGHT_PROMPT } from '../../../../Shared/utils/constants'

interface ActivityFormProps {
  activity: ActivityInterface,
  requestErrors: string[],
  submitActivity: (activity: object) => void
}

const ActivityForm = ({ activity, requestErrors, submitActivity }: ActivityFormProps) => {
  const { id, parent_activity_id, invalid_highlights, passages, prompts, title, notes, flag, } = activity;
  const formattedPassage = passages && passages.length ? passages : [{ text: '', highlight_prompt: DEFAULT_HIGHLIGHT_PROMPT, essential_knowledge_text: ESSENTIAL_KNOWLEDGE_TEXT_FILLER }];
  const formattedPrompts = promptsByConjunction(prompts);
  const becausePrompt = formattedPrompts && formattedPrompts[BECAUSE] ? formattedPrompts[BECAUSE] : buildBlankPrompt(BECAUSE);
  const butPrompt = formattedPrompts && formattedPrompts[BUT] ? formattedPrompts[BUT] : buildBlankPrompt(BUT);
  const soPrompt = formattedPrompts && formattedPrompts[SO] ? formattedPrompts[SO] : buildBlankPrompt(SO);

  const [activityTitle, setActivityTitle] = React.useState<string>(title || '');
  const [activityNotes, setActivityNotes] = React.useState<string>(notes || '');
  const [activityFlag, setActivityFlag] = React.useState<string>(flag || 'alpha');
  const [activityPassages, setActivityPassages] = React.useState<PassagesInterface[]>(formattedPassage);
  const [activityBecausePrompt, setActivityBecausePrompt] = React.useState<PromptInterface>(becausePrompt);
  const [activityButPrompt, setActivityButPrompt] = React.useState<PromptInterface>(butPrompt);
  const [activitySoPrompt, setActivitySoPrompt] = React.useState<PromptInterface>(soPrompt);
  const [errors, setErrors] = React.useState<{}>({});
  const [showHighlights, setShowHighlights] = React.useState(true)

  function toggleShowHighlights(e: ClickEvent) { setShowHighlights(!showHighlights)}
  function handleSetActivityFlag(option: { value: string, label: string }) { setActivityFlag(option.value) };
  function handleSetActivityTitle(e: InputEvent){ setActivityTitle(e.target.value) };
  function handleSetActivityNotes(e: InputEvent){ setActivityNotes(e.target.value) };
  function handleSetHighlightPrompt(e: InputEvent){ handleSetActivityPassages('highlight_prompt', e.target.value) };
  function handleSetImageLink(e: InputEvent){ handleSetActivityPassages('image_link', e.target.value) };
  function handleSetImageAltText(e: InputEvent){ handleSetActivityPassages('image_alt_text', e.target.value) };
  function handleSetPassageText(text: string) { handleSetActivityPassages('text', text)}
  function handleSetPassageEssentialKnowledgeText(text: string) { handleSetActivityPassages('essential_knowledge_text', text)}
  function handleSetImageAttribution(e: TextAreaEvent) { handleSetActivityPassages('image_attribution', e.target.value)}
  function handleSetImageCaption(e: InputEvent) { handleSetActivityPassages('image_caption', e.target.value)}

  function handleSetActivityPassages(key, value){
    const updatedPassages = [...activityPassages];
    updatedPassages[0][key] = value;
    setActivityPassages(updatedPassages)
  };

  function handleSetPrompt (text: string, conjunction: string, attribute: string) {
    const prompt = getActivityPrompt({ activityBecausePrompt, activityButPrompt, activitySoPrompt, conjunction });
    const updatePrompt = getActivityPromptSetter({ setActivityBecausePrompt, setActivityButPrompt, setActivitySoPrompt, conjunction});
    if(prompt && updatePrompt) {
      prompt[attribute] = text;
      updatePrompt(prompt);
    }
  }

  function handleSubmitActivity() {
    // safeguard against prompt stems being saved with trailing whitespaces (they cause issues when typing responses during student play)
    const trimmedBecausePrompt = trimmedPrompt(activityBecausePrompt)
    const trimmedButPrompt = trimmedPrompt(activityButPrompt)
    const trimmedSoPrompt = trimmedPrompt(activitySoPrompt)
    setActivityBecausePrompt(trimmedBecausePrompt);
    setActivityButPrompt(trimmedPrompt(activityButPrompt));
    setActivitySoPrompt(trimmedPrompt(activitySoPrompt));

    const activityObject = buildActivity({
      activityFlag,
      activityNotes,
      activityTitle,
      activityParentActivityId: parent_activity_id,
      activityPassages,
      activityBecausePrompt: trimmedBecausePrompt,
      activityButPrompt: trimmedButPrompt,
      activitySoPrompt: trimmedSoPrompt,
      highlightPrompt: activityPassages[0].highlight_prompt || DEFAULT_HIGHLIGHT_PROMPT
    });
    const state = [
      activityFlag,
      activityTitle,
      activityNotes,
      activityPassages[0].text,
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
  const passageLabelStyle = activityPassages[0].text.length  && activityPassages[0].text !== BREAK_TAG ? 'has-text' : '';
  const imageAttributionStyle = activityPassages[0].image_attribution  && activityPassages[0].image_attribution !== BREAK_TAG ? 'has-text' : '';
  const essentialKnowledgeStyle = activityPassages[0].essential_knowledge_text && activityPassages[0].essential_knowledge_text !== BREAK_TAG ? 'has-text' : '';
  const imageAttributionGuideLink = 'https://www.notion.so/quill/Activity-Images-9bc3993400da46a6af445a8a0d2d9d3f#11e9a01b071e41bc954e1182d56e93e8';
  const invalidHighlightsPresent = (invalid_highlights && invalid_highlights.length > 0)

  function getMaxAttemptsFeedbackComponent(conjunction: string, prompt: PromptInterface) {
    return <MaxAttemptsEditor conjunction={conjunction} handleSetPrompt={handleSetPrompt} prompt={prompt} />
  }

  const passageComponent = (
    <React.Fragment>
      <p className={`text-editor-label ${passageLabelStyle}`}>
        <span>Passage</span>
        <button className="quill-button fun primary outlined focus-on-light" onClick={toggleShowHighlights} type="button">{showHighlights ? 'Hide highlights' : 'Show highlights'}</button>
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
    </React.Fragment>
  );

  const buildingEssentialKnowledgeComponent = (
    <React.Fragment>
      <p className={`text-editor-label ${essentialKnowledgeStyle}`}>Building Essential Knowledge Text</p>
      <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        handleTextChange={handleSetPassageEssentialKnowledgeText}
        key="essential-knowledge-text"
        shouldCheckSpelling={true}
        text={activityPassages[0].essential_knowledge_text}
      />
    </React.Fragment>
  );

  const formComponents = [
    <ToggleComponentSection components={[passageComponent]} label={titleCase(TEXT)} />,
    <ToggleComponentSection
      components={[
        <ImageSection
          activityPassages={activityPassages}
          errors={errors}
          handleSetImageAltText={handleSetImageAltText}
          handleSetImageAttribution={handleSetImageAttribution}
          handleSetImageCaption={handleSetImageCaption}
          handleSetImageLink={handleSetImageLink}
          imageAttributionGuideLink={imageAttributionGuideLink}
          imageAttributionStyle={imageAttributionStyle}
        />
      ]}
      label={IMAGE}
    />,
    <ToggleComponentSection
      components={[
        <Input
          className="highlight-prompt-input"
          error={errors[HIGHLIGHT_PROMPT]}
          handleChange={handleSetHighlightPrompt}
          label={`Highlight Prompt: "${DEFAULT_HIGHLIGHT_PROMPT}..."`}
          value={activityPassages[0].highlight_prompt || DEFAULT_HIGHLIGHT_PROMPT}
        />
      ]}
      label={HIGHLIGHTING_PROMPT}
    />,
    <ToggleComponentSection components={[buildingEssentialKnowledgeComponent]} label={BUILDING_ESSENTIAL_KNOWLEDGE} />,
    <ToggleComponentSection components={[getMaxAttemptsFeedbackComponent(BECAUSE, activityBecausePrompt), getMaxAttemptsFeedbackComponent(BUT, activityButPrompt), getMaxAttemptsFeedbackComponent(SO, activitySoPrompt)]} label={MAX_ATTEMPTS_FEEDBACK} />,
    <ToggleComponentSection
      components={[
        <PromptsForm
          activityBecausePrompt={activityBecausePrompt}
          activityButPrompt={activityButPrompt}
          activitySoPrompt={activitySoPrompt}
          errors={errors}
          handleSetPrompt={handleSetPrompt}
        />
      ]}
      label={PROMPTS}
    />
  ];

  const formattedRows = formComponents.map((component, i) => {
    const { props } = component;
    const { label } = props;
    return {
      id: i,
      component,
      added: validateFormSection({ label, activityPassages, activityBecausePrompt, activityButPrompt, activitySoPrompt })
    }
  });

  const dataTableFields = [
    { name: "", attribute:"component", width: "800px" },
    { name: "Added?", attribute:"added", width: "50px" }
  ];

  return(
    <div className="activity-form-container">
      <UpperFormSection
        activity={activity}
        activityFlag={activityFlag}
        activityNotes={activityNotes}
        activityTitle={activityTitle}
        errors={errors}
        formErrorsPresent={formErrorsPresent}
        handleSetActivityFlag={handleSetActivityFlag}
        handleSetActivityNotes={handleSetActivityNotes}
        handleSetActivityTitle={handleSetActivityTitle}
        handleSubmitActivity={handleSubmitActivity}
        parentActivityId={parent_activity_id}
        requestErrors={requestErrors}
        showErrorsContainer={showErrorsContainer}
      />
      <DataTable
        className="activity-fields-table"
        defaultSortAttribute=""
        headers={dataTableFields}
        rows={formattedRows}
      />
      {invalidHighlightsPresent && renderInvalidHighlightLinks(invalid_highlights, id)}
    </div>
  )
}

export default ActivityForm;
