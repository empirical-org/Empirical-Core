import * as React from "react";

import { BECAUSE, BUT, SO } from '../../../../../constants/evidence';
import { handleRulePromptChange } from '../../../helpers/evidence/ruleHelpers';
import { InputEvent } from '../../../interfaces/evidenceInterfaces';

interface RulePromptsProps {
  errors: any,
  rulePrompts: any,
  rulePromptsDisabled: boolean,
  setRulePrompts: (rulePrompt: any) => void;
}

const RulePrompts = ({ errors, rulePrompts, rulePromptsDisabled, setRulePrompts }: RulePromptsProps) => {

  function onHandleRulePromptChange(e: InputEvent) { handleRulePromptChange(e, rulePrompts, setRulePrompts) }

  const becausePrompt = rulePrompts[BECAUSE];
  const butPrompt = rulePrompts[BUT];
  const soPrompt = rulePrompts[SO];

  return(
    <React.Fragment>
      <p className="form-subsection-label">Apply To Stems</p>
      <div className="checkboxes-container">
        <div className="checkbox-container">
          <label htmlFor={becausePrompt && becausePrompt.id} id="stem-label-1">Because</label>
          <input
            aria-labelledby="stem-label-1"
            checked={becausePrompt && becausePrompt.checked}
            disabled={rulePromptsDisabled}
            id={becausePrompt && becausePrompt.id}
            name="Because"
            onChange={onHandleRulePromptChange}
            type="checkbox"
            value="because"
          />
        </div>
        <div className="checkbox-container">
          <label htmlFor={butPrompt && butPrompt.id} id="stem-label-2">But</label>
          <input
            aria-labelledby="stem-label-2"
            checked={butPrompt && butPrompt.checked}
            disabled={rulePromptsDisabled}
            id={butPrompt && butPrompt.id}
            name="But"
            onChange={onHandleRulePromptChange}
            type="checkbox"
            value="but"
          />
        </div>
        <div className="checkbox-container">
          <label htmlFor={soPrompt && soPrompt.id} id="stem-label-3">So</label>
          <input
            aria-labelledby="stem-label-3"
            checked={soPrompt && soPrompt.checked}
            disabled={rulePromptsDisabled}
            id={soPrompt && soPrompt.id}
            name="So"
            onChange={onHandleRulePromptChange}
            type="checkbox"
            value="so"
          />
        </div>
      </div>
      {errors['Stem Applied'] && <p className="error-message">{errors['Stem Applied']}</p>}
    </React.Fragment>
  );
}

export default RulePrompts;
