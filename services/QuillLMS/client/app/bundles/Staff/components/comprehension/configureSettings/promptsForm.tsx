import * as React from "react";
import { EditorState, ContentState } from 'draft-js';

import { Input, TextEditor } from '../../../../Shared/index';
import * as C from '../../../../../constants/comprehension';
import { PromptInterface } from '../../../interfaces/comprehensionInterfaces';

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface PromptsFormProps {
  activityBecausePrompt: PromptInterface;
  activityButPrompt: PromptInterface;
  activitySoPrompt: PromptInterface;
  errors: any;
  handleSetPlagiarismFeedback: (e: InputEvent, order: string, conjunction: string) => void;
  handleSetPlagiarismText: (text: string, conjunction: string) => void;
  handleSetPrompt: (e: InputEvent, conjunction: string) => void;
}

const PromptsForm = (props: PromptsFormProps) => {
  const {
    activityBecausePrompt,
    activityButPrompt,
    activitySoPrompt,
    errors,
    handleSetPlagiarismFeedback,
    handleSetPlagiarismText,
    handleSetPrompt
  } = props;

  function handleSetBecausePrompt (e: InputEvent) { handleSetPrompt(e, C.BECAUSE) }

  function handleSetButPrompt (e: InputEvent) { handleSetPrompt(e, C.BUT) }

  function handleSetSoPrompt (e: InputEvent) { handleSetPrompt(e, C.SO) }

  function handleSetBecausePlagiarismText (text: string) { handleSetPlagiarismText(text, C.BECAUSE, ) }

  function handleSetButPlagiarismText (text: string) { handleSetPlagiarismText(text, C.BUT) }

  function handleSetSoPlagiarismText (text: string) { handleSetPlagiarismText(text, C.SO) }

  function handleSetFirstBecausePlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, C.FIRST, C.BECAUSE) }

  function handleSetSecondBecausePlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, C.SECOND, C.BECAUSE) }

  function handleSetFirstButPlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, C.FIRST, C.BUT) }

  function handleSetSecondButPlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, C.SECOND, C.BUT) }

  function handleSetFirstSoPlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, C.FIRST, C.SO) }

  function handleSetSecondSoPlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, C.SECOND, C.SO) }

  const plagiarismLabelsTextStyle = {
    [C.BECAUSE]: activityBecausePrompt.plagiarism_text && activityBecausePrompt.plagiarism_text !== '<br/>' ? 'has-text' : '',
    [C.BUT]: activityButPrompt.plagiarism_text && activityButPrompt.plagiarism_text !== '<br/>' ? 'has-text' : '',
    [C.SO]: activitySoPrompt.plagiarism_text && activitySoPrompt.plagiarism_text !== '<br/>' ? 'has-text' : ''
  }

  return(
    <React.Fragment>
      <section className="prompt-section">
        <Input
          className="because-input"
          error={errors[C.BECAUSE_STEM]}
          handleChange={handleSetBecausePrompt}
          label="Because Stem"
          value={activityBecausePrompt.text}
        />
        <section className="plagiarism-section">
          <p className={`text-editor-label ${plagiarismLabelsTextStyle[C.BECAUSE]}`}>Plagiarism Text</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={handleSetBecausePlagiarismText}
            key="max-attempt-feedback"
            text={activityBecausePrompt.plagiarism_text}
          />
          {errors[C.BECAUSE_PLAGIARISM_TEXT] && <p className="error-message">{errors[C.BECAUSE_PLAGIARISM_TEXT]}</p>}
          <Input
            className="primary-feedback-input"
            error={errors[C.BECAUSE_PLAGIARISM_PRIMARY_FEEDBACK]}
            handleChange={handleSetFirstBecausePlagiarismFeedback}
            label="Primary Feedback"
            value={activityBecausePrompt.plagiarism_first_feedback}
          />
          <Input
            className="secondary-feedback-input"
            error={errors[C.BECAUSE_PLAGIARISM_SECONDARY_FEEDBACK]}
            handleChange={handleSetSecondBecausePlagiarismFeedback}
            label="Secondary Feedback"
            value={activityBecausePrompt.plagiarism_second_feedback}
          />
        </section>
      </section>
      <section className="prompt-section">
        <Input
          className="but-input"
          error={errors[C.BUT_STEM]}
          handleChange={handleSetButPrompt}
          label="But Stem"
          value={activityButPrompt.text}
        />
        <section className="plagiarism-section">
          <p className={`text-editor-label ${plagiarismLabelsTextStyle[C.BUT]}`}>Plagiarism Text</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={handleSetButPlagiarismText}
            key="max-attempt-feedback"
            text={activityButPrompt.plagiarism_text}
          />
          {errors[C.BUT_PLAGIARISM_TEXT] && <p className="error-message">{errors[C.BUT_PLAGIARISM_TEXT]}</p>}
          <Input
            className="primary-feedback-input"
            error={errors[C.BUT_PLAGIARISM_PRIMARY_FEEDBACK]}
            handleChange={handleSetFirstButPlagiarismFeedback}
            label="Primary Feedback"
            value={activityButPrompt.plagiarism_first_feedback}
          />
          <Input
            className="secondary-feedback-input"
            error={errors[C.BUT_PLAGIARISM_SECONDARY_FEEDBACK]}
            handleChange={handleSetSecondButPlagiarismFeedback}
            label="Secondary Feedback"
            value={activityButPrompt.plagiarism_second_feedback}
          />
        </section>
      </section>
      <section className="prompt-section">
        <Input
          className="so-input"
          error={errors[C.SO_STEM]}
          handleChange={handleSetSoPrompt}
          label="So Stem"
          value={activitySoPrompt.text}
        />
        <section className="plagiarism-section">
          <p className={`text-editor-label ${plagiarismLabelsTextStyle[C.SO]}`}>Plagiarism Text</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={handleSetSoPlagiarismText}
            key="max-attempt-feedback"
            text={activitySoPrompt.plagiarism_text}
          />
          {errors[C.SO_PLAGIARISM_TEXT] && <p className="error-message">{errors[C.SO_PLAGIARISM_TEXT]}</p>}
          <Input
            className="primary-feedback-input"
            error={errors[C.SO_PLAGIARISM_PRIMARY_FEEDBACK]}
            handleChange={handleSetFirstSoPlagiarismFeedback}
            label="Primary Feedback"
            value={activitySoPrompt.plagiarism_first_feedback}
          />
          <Input
            className="secondary-feedback-input"
            error={errors[C.SO_PLAGIARISM_SECONDARY_FEEDBACK]}
            handleChange={handleSetSecondSoPlagiarismFeedback}
            label="Secondary Feedback"
            value={activitySoPrompt.plagiarism_second_feedback}
          />
        </section>
      </section>
    </React.Fragment>
  )
}

export default PromptsForm;
