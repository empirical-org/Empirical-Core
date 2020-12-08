import * as React from "react";
import { EditorState, ContentState } from 'draft-js';

import { Input, TextEditor } from '../../../../Shared/index';
import { BECAUSE, BUT, SO, BECAUSE_STEM, BUT_STEM, SO_STEM } from '../../../../../constants/comprehension';
import { PromptInterface } from '../../../interfaces/comprehensionInterfaces';

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface PromptsFormProps {
  activityBecausePrompt: PromptInterface;
  activityButPrompt: PromptInterface;
  activitySoPrompt: PromptInterface;
  errors: any;
  handleSetPlagiarismText: (conjunction: string, text: string) => void;
  handleSetPrompt: (e: InputEvent, conjunction: string) => void;
  plagiarismLabelsTextStyle: any;
}

const PromptsForm = (props: PromptsFormProps) => {
  const {
    activityBecausePrompt,
    activityButPrompt,
    activitySoPrompt,
    errors,
    handleSetPlagiarismText,
    handleSetPrompt,
    plagiarismLabelsTextStyle
  } = props;

  function handleSetBecausePrompt (e: InputEvent) { handleSetPrompt(e, BECAUSE) }

  function handleSetButPrompt (e: InputEvent) { handleSetPrompt(e, BUT) }

  function handleSetSoPrompt (e: InputEvent) { handleSetPrompt(e, SO) }

  function handleSetBecausePlagiarismText (text: string) { handleSetPlagiarismText(BECAUSE, text) }

  function handleSetButPlagiarismText (text: string) { handleSetPlagiarismText(BUT, text) }

  function handleSetSoPlagiarismText (text: string) { handleSetPlagiarismText(SO, text) }

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
        </section>
      </section>
    </React.Fragment>
  )
}

export default PromptsForm;
