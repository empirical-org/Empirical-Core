import * as React from "react";
import { EditorState, ContentState } from 'draft-js';

import { Input, TextEditor } from '../../../../Shared/index';
import { BECAUSE, BUT, SO, BECAUSE_STEM, BUT_STEM, SO_STEM, FIRST, SECOND } from '../../../../../constants/comprehension';
import { PromptInterface } from '../../../interfaces/comprehensionInterfaces';

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface PromptsFormProps {
  activityBecausePrompt: PromptInterface;
  activityButPrompt: PromptInterface;
  activitySoPrompt: PromptInterface;
  errors: any;
  handleSetPlagiarismFeedback: (e: InputEvent, order: string, conjunction: string) => void;
  handleSetPlagiarismText: (conjunction: string, text: string) => void;
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

  function handleSetBecausePrompt (e: InputEvent) { handleSetPrompt(e, BECAUSE) }

  function handleSetButPrompt (e: InputEvent) { handleSetPrompt(e, BUT) }

  function handleSetSoPrompt (e: InputEvent) { handleSetPrompt(e, SO) }

  function handleSetBecausePlagiarismText (text: string) { handleSetPlagiarismText(BECAUSE, text) }

  function handleSetButPlagiarismText (text: string) { handleSetPlagiarismText(BUT, text) }

  function handleSetSoPlagiarismText (text: string) { handleSetPlagiarismText(SO, text) }

  function handleSetFirstBecausePlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, FIRST, BECAUSE) }

  function handleSetSecondBecausePlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, SECOND, BECAUSE) }

  function handleSetFirstButPlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, FIRST, BUT) }

  function handleSetSecondButPlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, SECOND, BUT) }

  function handleSetFirstSoPlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, FIRST, SO) }

  function handleSetSecondSoPlagiarismFeedback (e: InputEvent) { handleSetPlagiarismFeedback(e, SECOND, SO) }

  const plagiarismLabelsTextStyle = {
    [BECAUSE]: activityBecausePrompt.plagiarism_text && activityBecausePrompt.plagiarism_text.length && activityBecausePrompt.plagiarism_text !== '<br/>' ? 'has-text' : '',
    [BUT]: activityButPrompt.plagiarism_text && activityButPrompt.plagiarism_text.length && activityButPrompt.plagiarism_text !== '<br/>' ? 'has-text' : '',
    [SO]: activitySoPrompt.plagiarism_text && activitySoPrompt.plagiarism_text.length && activitySoPrompt.plagiarism_text !== '<br/>' ? 'has-text' : ''
  }

  return(
    <React.Fragment>
      <section className="prompt-section">
        <Input
          className="because-input"
          error={errors[BECAUSE_STEM]}
          handleChange={handleSetBecausePrompt}
          label="Because Stem"
          value={activityBecausePrompt.text}
        />
        <section className="plagiarism-section">
          <p className={`text-editor-label ${plagiarismLabelsTextStyle[BECAUSE]}`}>Plagiarism Text</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={handleSetBecausePlagiarismText}
            key="max-attempt-feedback"
            text={activityBecausePrompt.plagiarism_text}
          />
          <Input
            className="primary-feedback-input"
            handleChange={handleSetFirstBecausePlagiarismFeedback}
            label="Primary Feedback"
            value={activityBecausePrompt.plagiarism_first_feedback}
          />
          <Input
            className="secondary-feedback-input"
            error={errors[BECAUSE_STEM]}
            handleChange={handleSetSecondBecausePlagiarismFeedback}
            label="Secondary Feedback"
            value={activityBecausePrompt.plagiarism_second_feedback}
          />
        </section>
      </section>
      <section className="prompt-section">
        <Input
          className="but-input"
          error={errors[BUT_STEM]}
          handleChange={handleSetButPrompt}
          label="But Stem"
          value={activityButPrompt.text}
        />
        <section className="plagiarism-section">
          <p className={`text-editor-label ${plagiarismLabelsTextStyle[BUT]}`}>Plagiarism Text</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={handleSetButPlagiarismText}
            key="max-attempt-feedback"
            text={activityButPrompt.plagiarism_text}
          />
          <Input
            className="primary-feedback-input"
            handleChange={handleSetFirstButPlagiarismFeedback}
            label="Primary Feedback"
            value={activityButPrompt.plagiarism_first_feedback}
          />
          <Input
            className="secondary-feedback-input"
            handleChange={handleSetSecondButPlagiarismFeedback}
            label="Secondary Feedback"
            value={activityButPrompt.plagiarism_second_feedback}
          />
        </section>
      </section>
      <section className="prompt-section">
        <Input
          className="so-input"
          error={errors[SO_STEM]}
          handleChange={handleSetSoPrompt}
          label="So Stem"
          value={activitySoPrompt.text}
        />
        <section className="plagiarism-section">
          <p className={`text-editor-label ${plagiarismLabelsTextStyle[SO]}`}>Plagiarism Text</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={handleSetSoPlagiarismText}
            key="max-attempt-feedback"
            text={activitySoPrompt.plagiarism_text}
          />
          <Input
            className="primary-feedback-input"
            handleChange={handleSetFirstSoPlagiarismFeedback}
            label="Primary Feedback"
            value={activitySoPrompt.plagiarism_first_feedback}
          />
          <Input
            className="secondary-feedback-input"
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
