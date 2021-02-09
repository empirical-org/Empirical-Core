import * as React from "react";

import { Input } from '../../../../Shared/index';
import * as C from '../../../../../constants/comprehension';
import { PromptInterface } from '../../../interfaces/comprehensionInterfaces';

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface PromptsFormProps {
  activityBecausePrompt: PromptInterface;
  activityButPrompt: PromptInterface;
  activitySoPrompt: PromptInterface;
  errors: any;
  handleSetPrompt: (e: InputEvent, conjunction: string) => void;
}

const PromptsForm = ({ activityBecausePrompt, activityButPrompt, activitySoPrompt, errors, handleSetPrompt }: PromptsFormProps) => {

  function handleSetBecausePrompt (e: InputEvent) { handleSetPrompt(e, C.BECAUSE) }
  function handleSetButPrompt (e: InputEvent) { handleSetPrompt(e, C.BUT) }
  function handleSetSoPrompt (e: InputEvent) { handleSetPrompt(e, C.SO) }

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
      </section>
      <section className="prompt-section">
        <Input
          className="but-input"
          error={errors[C.BUT_STEM]}
          handleChange={handleSetButPrompt}
          label="But Stem"
          value={activityButPrompt.text}
        />
      </section>
      <section className="prompt-section">
        <Input
          className="so-input"
          error={errors[C.SO_STEM]}
          handleChange={handleSetSoPrompt}
          label="So Stem"
          value={activitySoPrompt.text}
        />
      </section>
    </React.Fragment>
  )
}

export default PromptsForm;
