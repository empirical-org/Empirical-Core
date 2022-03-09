import * as React from "react";
import { Link } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js';
import * as _ from 'lodash'

import PromptsForm from './promptsForm';
import UpperFormSection from './upperFormSection';
import MaxAttemptsEditor from "./maxAttemptsEditor";
import ImageSection from "./imageSection";

import { validateForm, buildActivity } from '../../../helpers/evidence/miscHelpers';
import { getActivityPrompt, promptsByConjunction, buildBlankPrompt, getActivityPromptSetter } from '../../../helpers/evidence/promptHelpers';
import { BECAUSE,BUT, SO, activityFormKeys, PASSAGE, HIGHLIGHT_PROMPT, ESSENTIAL_KNOWLEDGE_TEXT_FILLER, RULE_TYPE_TO_ROUTE_PART, RULE_TYPE_TO_NAME } from '../../../../../constants/evidence';
import { ActivityInterface, PromptInterface, PassagesInterface, InputEvent, ClickEvent,  TextAreaEvent } from '../../../interfaces/evidenceInterfaces';
import { DataTable, Input, TextEditor, ToggleComponentSection } from '../../../../Shared/index'
import { DEFAULT_HIGHLIGHT_PROMPT } from '../../../../Shared/utils/constants'

interface ActivityFormProps {
  activity: ActivityInterface,
  requestErrors: string[],
  submitActivity: (activity: object) => void
}

interface InvalidHighlightProps {
  rule_id: number,
  rule_type: string,
  prompt_id: number
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

  function handleSubmitActivity(){
    const activityObject = buildActivity({
      activityFlag,
      activityNotes,
      activityTitle,
      activityParentActivityId: parent_activity_id,
      activityPassages,
      activityBecausePrompt,
      activityButPrompt,
      activitySoPrompt,
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
  const passageLabelStyle = activityPassages[0].text.length  && activityPassages[0].text !== '<br/>' ? 'has-text' : '';
  const imageAttributionStyle = activityPassages[0].image_attribution  && activityPassages[0].image_attribution !== '<br/>' ? 'has-text' : '';
  const essentialKnowledgeStyle = activityPassages[0].essential_knowledge_text && activityPassages[0].essential_knowledge_text !== '<br/>' ? 'has-text' : '';
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

  function getMaxAttemptsFeedbackComponent(conjunction: string, prompt: PromptInterface) {
    return <MaxAttemptsEditor conjunction={conjunction} handleSetPrompt={handleSetPrompt} prompt={prompt}
  />
  }

  const passageComponent = (
    <React.Fragment>
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

  return(
    <div className="activity-form-container">
      <UpperFormSection
        activity={activity}
        activityTitle={activityTitle}
        activityNotes={activityNotes}
        activityFlag={activityFlag}
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
      <ToggleComponentSection label="Text" components={[passageComponent]} />
      <ToggleComponentSection
        label="Image"
        components={[
          <ImageSection
            activityPassages={activityPassages}
            errors={errors}
            handleSetImageLink={handleSetImageLink}
            handleSetImageAltText={handleSetImageAltText}
            handleSetImageCaption={handleSetImageCaption}
            imageAttributionStyle={imageAttributionStyle}
            imageAttributionGuideLink={imageAttributionGuideLink}
            handleSetImageAttribution={handleSetImageAttribution}
          />
        ]}
      />
      <ToggleComponentSection
        label="Highlighting Prompt"
        components={[
          <Input
            className="highlight-prompt-input"
            error={errors[HIGHLIGHT_PROMPT]}
            handleChange={handleSetHighlightPrompt}
            label={`Highlight Prompt: "${DEFAULT_HIGHLIGHT_PROMPT}..."`}
            value={activityPassages[0].highlight_prompt || DEFAULT_HIGHLIGHT_PROMPT}
          />
        ]}
      />
      <ToggleComponentSection label="Building Essential Knowledge" components={[buildingEssentialKnowledgeComponent]} />
      <ToggleComponentSection label="Max Attempts Feedback" components={[getMaxAttemptsFeedbackComponent(BECAUSE, activityBecausePrompt), getMaxAttemptsFeedbackComponent(BUT, activityButPrompt), getMaxAttemptsFeedbackComponent(SO, activitySoPrompt)]} />
      <ToggleComponentSection
        label="Prompts"
        components={[
          <PromptsForm
            activityBecausePrompt={activityBecausePrompt}
            activityButPrompt={activityButPrompt}
            activitySoPrompt={activitySoPrompt}
            errors={errors}
            handleSetPrompt={handleSetPrompt}
          />
        ]}
      />
      {invalidHighlightsPresent && renderInvalidHighlightLinks(invalid_highlights)}
    </div>
  )
}

export default ActivityForm;
