import * as React from "react";

import RuleHintDropdown from './ruleHintDropdown';

const RuleHintPicker = ({
  hint,
  onHintChange,
}) => {

  const { id, explanation, image_link, image_alt_text, } = hint || {}

  return(
    <React.Fragment>
      <RuleHintDropdown
        emptySelectionText="(no hint)"
        onHintChange={onHintChange}
        selectedHintId={id}
      />
      <div dangerouslySetInnerHTML={{__html: explanation}} />
      <img alt={image_alt_text} src={image_link} />
    </React.Fragment>
  );
};

export default RuleHintPicker;
