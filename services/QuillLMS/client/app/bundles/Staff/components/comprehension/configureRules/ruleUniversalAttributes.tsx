import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import { handleSetUniversalFeedback } from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor } from '../../../../Shared/index';

const RuleAttributesSection = ({
  errors,
  setUniversalFeedback,
  universalFeedback
}) => {

  function onHandleSetUniversalFeedback(text: string) { handleSetUniversalFeedback(text, universalFeedback, setUniversalFeedback)}

  return(
    <React.Fragment>
      <p className="form-subsection-label">First Revision - Feedback</p>
      <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        handleTextChange={onHandleSetUniversalFeedback}
        key="regex-feedback"
        text={universalFeedback[0].text}
      />
      {errors['Universal Feedback'] && errors['Universal Feedback'].length && <p className="error-message">{errors['Universal Feedback'][0]}</p>}
    </React.Fragment>
  );
};

export default RuleAttributesSection;
