import * as React from "react";

import ImageSection from "./imageSection";
import MaxAttemptsEditor from "./maxAttemptsEditor";
import PromptsForm from './promptsForm';
import UpperFormSection from './upperFormSection';

import { BECAUSE, BREAK_TAG, BUILDING_ESSENTIAL_KNOWLEDGE, BUT, HIGHLIGHTING_PROMPT, HIGHLIGHT_PROMPT, IMAGE, MAX_ATTEMPTS_FEEDBACK, PASSAGE, STEMS, SO, TEXT, activityFormKeys, GEN_AI_AI_TYPE, } from '../../../../../constants/evidence';
import { DataTable, Input, TextEditor, ToggleComponentSection, titleCase } from '../../../../Shared/index';
import { DEFAULT_HIGHLIGHT_PROMPT } from '../../../../Shared/utils/constants';
import { buildActivity, validateForm, validateFormSection } from '../../../helpers/evidence/miscHelpers';
import { buildBlankPrompt, getActivityPrompt, getActivityPromptSetter, promptsByConjunction, trimmedPrompt } from '../../../helpers/evidence/promptHelpers';
import { renderInvalidHighlightLinks } from '../../../helpers/evidence/renderHelpers';
import { ActivityInterface, ClickEvent, InputEvent, PassagesInterface, PromptInterface, TextAreaEvent } from '../../../interfaces/evidenceInterfaces';

interface ActivityFormProps {
  activity: ActivityInterface,
  requestErrors: string[],
  submitActivity: (activity: object) => void
}

interface RelevantTextsInterface {
  because_text?: string,
  so_text?: string,
  but_text?: string
}

const relevantTextErrorMessage = <span className="all-errors-message">This text contains at least one sentence that is not the same as the text in the passage.</span>

const ActivityForm = ({ activity, requestErrors, submitActivity }: ActivityFormProps) => {
  const { id, parent_activity_id, invalid_related_texts, passages, prompts, title, notes, flag, ai_type, relevant_texts, invalid_relevant_texts, } = activity;
  const formattedPassage = passages && passages.length ? passages : [{ text: '', highlight_prompt: DEFAULT_HIGHLIGHT_PROMPT, essential_knowledge_text: '' }];
  const formattedPrompts = promptsByConjunction(prompts);
  const becausePrompt = formattedPrompts && formattedPrompts[BECAUSE] ? formattedPrompts[BECAUSE] : buildBlankPrompt(BECAUSE);
  const butPrompt = formattedPrompts && formattedPrompts[BUT] ? formattedPrompts[BUT] : buildBlankPrompt(BUT);
  const soPrompt = formattedPrompts && formattedPrompts[SO] ? formattedPrompts[SO] : buildBlankPrompt(SO);

  const [activityTitle, setActivityTitle] = React.useState<string>(title || '');
  const [activityNotes, setActivityNotes] = React.useState<string>(notes || '');
  const [activityFlag, setActivityFlag] = React.useState<string>(flag || 'alpha');
  const [aiType, setAIType] = React.useState<string>(ai_type || GEN_AI_AI_TYPE);
  const [activityPassages, setActivityPassages] = React.useState<PassagesInterface[]>(formattedPassage);
  const [activityBecausePrompt, setActivityBecausePrompt] = React.useState<PromptInterface>(becausePrompt);
  const [activityButPrompt, setActivityButPrompt] = React.useState<PromptInterface>(butPrompt);
  const [activitySoPrompt, setActivitySoPrompt] = React.useState<PromptInterface>(soPrompt);
  const [relevantTexts, setRelevantTexts] = React.useState<RelevantTextsInterface>(relevant_texts || {})
  const [errors, setErrors] = React.useState<{}>({});
  const [showHighlights, setShowHighlights] = React.useState(true)

  function toggleShowHighlights(e: ClickEvent) { setShowHighlights(!showHighlights)}
  function handleSetActivityFlag(option: { value: string, label: string }) { setActivityFlag(option.value) };
  function handleSetAIType(option: { value: string, label: string }) { setAIType(option.value) };
  function handleSetActivityTitle(e: InputEvent){ setActivityTitle(e.target.value) };
  function handleSetActivityNotes(e: InputEvent){ setActivityNotes(e.target.value) };
  function handleSetHighlightPrompt(e: InputEvent){ handleSetActivityPassages('highlight_prompt', e.target.value) };
  function handleSetImageLink(text: string){handleSetActivityPassages('image_link', text) };
  function handleSetImageAltText(e: InputEvent){ handleSetActivityPassages('image_alt_text', e.target.value) };
  function handleSetPassageText(text: string) { handleSetActivityPassages('text', text)}
  function handleSetPassageEssentialKnowledgeText(text: string) { handleSetActivityPassages('essential_knowledge_text', text)}
  function handleSetImageAttribution(text: string) {handleSetActivityPassages('image_attribution', text) }
  function handleSetImageCaption(e: InputEvent) { handleSetActivityPassages('image_caption', e.target.value)}
  function handleSetBecauseRelevantText(text: string){ setRelevantTexts({ ...relevantTexts, because_text: text, }) };
  function handleSetButRelevantText(text: string){ setRelevantTexts({ ...relevantTexts, but_text: text, }) };
  function handleSetSoRelevantText(text: string){ setRelevantTexts({ ...relevantTexts, so_text: text, }) };

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
      aiType,
      activityNotes,
      activityTitle,
      activityParentActivityId: parent_activity_id,
      activityPassages,
      activityBecausePrompt: trimmedBecausePrompt,
      activityButPrompt: trimmedButPrompt,
      activitySoPrompt: trimmedSoPrompt,
      highlightPrompt: activityPassages[0].highlight_prompt || DEFAULT_HIGHLIGHT_PROMPT,
      relevantTexts
    });
    const state = [
      activityFlag,
      aiType,
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
  const invalidHighlightsPresent = (invalid_related_texts && invalid_related_texts.length > 0)

  function getMaxAttemptsFeedbackComponent(conjunction: string, prompt: PromptInterface) {
    return <MaxAttemptsEditor conjunction={conjunction} handleSetPrompt={handleSetPrompt} prompt={prompt} />
  }

  const passageComponent = (
    <React.Fragment>
      <p className={`text-editor-label ${passageLabelStyle}`}>
        <span>Passage</span>
        <button className="quill-button-archived fun primary outlined focus-on-light" onClick={toggleShowHighlights} type="button">{showHighlights ? 'Hide highlights' : 'Show highlights'}</button>
      </p>
      <div className={showHighlights ? '' : 'hide-highlights'}>
        <TextEditor
          handleTextChange={handleSetPassageText}
          key="passage-description"
          text={activityPassages[0].text}
        />
      </div>
      {errors[PASSAGE] && <p className="error-message">{errors[PASSAGE]}</p>}
      {aiType === GEN_AI_AI_TYPE && (
        <React.Fragment>
          <p className="text-editor-label">Relevant Text - Because</p>
          <TextEditor
            handleTextChange={handleSetBecauseRelevantText}
            key="because-relevant-text"
            text={relevantTexts.because_text}
          />
          {invalid_relevant_texts?.includes('because_text') && relevantTextErrorMessage}
          <p className="text-editor-label">Relevant Text - But</p>
          <TextEditor
            handleTextChange={handleSetButRelevantText}
            key="but-relevant-text"
            text={relevantTexts.but_text}
          />
          {invalid_relevant_texts?.includes('but_text') && relevantTextErrorMessage}
          <p className="text-editor-label">Relevant Text - So</p>
          <TextEditor
            handleTextChange={handleSetSoRelevantText}
            key="so-relevant-text"
            text={relevantTexts.so_text}
          />
          {invalid_relevant_texts?.includes('so_text') && relevantTextErrorMessage}
        </React.Fragment>
      )}
    </React.Fragment>
  );

  const buildingEssentialKnowledgeComponent = (
    <React.Fragment>
      <p className={`text-editor-label ${essentialKnowledgeStyle}`}>Building Essential Knowledge Text</p>
      <TextEditor
        handleTextChange={handleSetPassageEssentialKnowledgeText}
        key="essential-knowledge-text"
        text={activityPassages[0].essential_knowledge_text}
      />
    </React.Fragment>
  );

  const formComponents = [
    <ToggleComponentSection components={[passageComponent]} label={titleCase(TEXT)} />,
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
      label={STEMS}
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
    <ToggleComponentSection components={[getMaxAttemptsFeedbackComponent(BECAUSE, activityBecausePrompt), getMaxAttemptsFeedbackComponent(BUT, activityButPrompt), getMaxAttemptsFeedbackComponent(SO, activitySoPrompt)]} label={MAX_ATTEMPTS_FEEDBACK} />,
    <ToggleComponentSection components={[buildingEssentialKnowledgeComponent]} label={BUILDING_ESSENTIAL_KNOWLEDGE} />,
  ];

  const formattedRows = formComponents.map((component, i) => {
    const { props } = component;
    const { label } = props;
    return {
      id: i,
      component,
      added: validateFormSection({ label, activityPassages, activityBecausePrompt, activityButPrompt, activitySoPrompt, aiType, relevantTexts, invalidRelevantTexts: invalid_relevant_texts })
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
        aiType={aiType}
        errors={errors}
        formErrorsPresent={formErrorsPresent}
        handleSetActivityFlag={handleSetActivityFlag}
        handleSetActivityNotes={handleSetActivityNotes}
        handleSetActivityTitle={handleSetActivityTitle}
        handleSetAIType={handleSetAIType}
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
      {invalidHighlightsPresent && renderInvalidHighlightLinks(invalid_related_texts, id)}
    </div>
  )
}

export default ActivityForm;
