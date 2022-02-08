import * as React from "react";

import { Input } from '../../../../Shared/index';
import * as C from '../../../../../constants/evidence';
import { PromptInterface } from '../../../interfaces/evidenceInterfaces';

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface PromptsFormProps {
  activityBecausePrompt: PromptInterface;
  activityButPrompt: PromptInterface;
  activitySoPrompt: PromptInterface;
  errors: any;
  handleSetPrompt: (text: string, conjunction: string, attribute: string) => void;
}

const PromptsForm = ({ activityBecausePrompt, activityButPrompt, activitySoPrompt, errors, handleSetPrompt }: PromptsFormProps) => {

  function handleSetBecausePrompt (e: InputEvent) { handleSetPrompt(e.target.value, C.BECAUSE, 'text') }
  function handleSetButPrompt (e: InputEvent) { handleSetPrompt(e.target.value, C.BUT, 'text') }
  function handleSetSoPrompt (e: InputEvent) { handleSetPrompt(e.target.value, C.SO, 'text') }

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
