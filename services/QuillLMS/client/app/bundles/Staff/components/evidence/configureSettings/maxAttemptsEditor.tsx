import { ContentState, EditorState } from 'draft-js';
import * as _ from 'lodash';
import * as React from 'react';

import { TextEditor } from '../../../../Shared';
import { PromptInterface } from '../../../interfaces/evidenceInterfaces';

interface MaxAttemptsEditorProps {
  conjunction: string,
  prompt: PromptInterface,
  handleSetPrompt: (text: string, conjunction: string, key: string) => void
}
export const MaxAttemptsEditor = ({ conjunction, prompt, handleSetPrompt }: MaxAttemptsEditorProps) => {

  function handleSetActivityMaxFeedback(text: string) {
    handleSetPrompt(text, conjunction, 'max_attempts_feedback')
  }

  const maxAttemptStyle = prompt.max_attempts_feedback.length && prompt.max_attempts_feedback !== '<br/>' ? 'has-text' : '';

  return (
    <div>
      <p className={`text-editor-label ${maxAttemptStyle}`}>{_.capitalize(conjunction)} - Max Attempts Feedback - Student Did Not Reach Optimal AutoML Label</p>
      <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        handleTextChange={handleSetActivityMaxFeedback}
        key="but-max-attempt-feedback"
        shouldCheckSpelling={true}
        text={prompt.max_attempts_feedback || ''}
      />
    </div>
  )
}

export default MaxAttemptsEditor;
