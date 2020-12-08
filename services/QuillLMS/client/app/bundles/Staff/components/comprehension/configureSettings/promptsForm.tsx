import * as React from "react";

import { Input } from '../../../../Shared/index';
import { BECAUSE_STEM, BUT_STEM, SO_STEM } from '../../../../../constants/comprehension';
import { PromptInterface } from '../../../interfaces/comprehensionInterfaces';

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface PromptsFormProps {
  activityBecausePrompt: PromptInterface;
  activityButPrompt: PromptInterface;
  activitySoPrompt: PromptInterface;
  errors: any;
  handleSetActivityBecausePrompt: (e: InputEvent) => void;
  handleSetActivityButPrompt: (e: InputEvent) => void;
  handleSetActivitySoPrompt: (e: InputEvent) => void;
}

const PromptsForm = (props: PromptsFormProps) => {
  const {
    errors,
    handleSetActivityBecausePrompt,
    handleSetActivityButPrompt,
    handleSetActivitySoPrompt,
    activityBecausePrompt,
    activityButPrompt,
    activitySoPrompt
  } = props;
  return(
    <React.Fragment>
      <section className="prompt-section">
        <Input
          className="because-input"
          error={errors[BECAUSE_STEM]}
          handleChange={handleSetActivityBecausePrompt}
          label="Because Stem"
          value={activityBecausePrompt.text}
        />
      </section>
      <section className="prompt-section">
        <Input
          className="but-input"
          error={errors[BUT_STEM]}
          handleChange={handleSetActivityButPrompt}
          label="But Stem"
          value={activityButPrompt.text}
        />
      </section>
      <section className="prompt-section">
        <Input
          className="so-input"
          error={errors[SO_STEM]}
          handleChange={handleSetActivitySoPrompt}
          label="So Stem"
          value={activitySoPrompt.text}
        />
      </section>
    </React.Fragment>
  )
}

export default PromptsForm;
