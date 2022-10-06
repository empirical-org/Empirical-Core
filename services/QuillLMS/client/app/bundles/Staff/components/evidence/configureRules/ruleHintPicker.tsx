import * as React from "react";

import RuleHintDropdown from './ruleHintDropdown';

const RuleHintPicker = ({
  hint,
  onHintChange,
}) => {

  const hintId = (hint && hint.id) || null
  const hintExplanation = (hint && hint.explanation) || null
  const hintImageLink = (hint && hint.image_link) || null
  const hintImageAltText = (hint && hint.image_alt_text) || null

  return(
    // eslint-disable-next-line
    <React.Fragment>
      <RuleHintDropdown
        emptySelectionText="(no hint)"
        onHintChange={onHintChange}
        selectedHintId={hintId}
      />
      <div dangerouslySetInnerHTML={ {__html: hintExplanation} } />
      <img alt={hintImageAltText} src={hintImageLink} />
    </React.Fragment>
  );
};

export default RuleHintPicker;
