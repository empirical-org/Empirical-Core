import * as React from "react";

import { Input, informationIcon } from '../../../../Shared/index';
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

  function handleSetBecausePromptText (e: InputEvent) { handleSetPrompt(e.target.value, C.BECAUSE, C.TEXT) }
  function handleSetBecausePromptFirstStrongExample (e: InputEvent) { handleSetPrompt(e.target.value, C.BECAUSE, C.FIRST_STRONG_EXAMPLE) }
  function handleSetBecausePromptSecondStrongExample (e: InputEvent) { handleSetPrompt(e.target.value, C.BECAUSE, C.SECOND_STRONG_EXAMPLE) }
  function handleSetButPromptText (e: InputEvent) { handleSetPrompt(e.target.value, C.BUT, C.TEXT) }
  function handleSetButPromptFirstStrongExample (e: InputEvent) { handleSetPrompt(e.target.value, C.BUT, C.FIRST_STRONG_EXAMPLE) }
  function handleSetButPromptSecondStrongExample (e: InputEvent) { handleSetPrompt(e.target.value, C.BUT, C.SECOND_STRONG_EXAMPLE) }
  function handleSetSoPromptText (e: InputEvent) { handleSetPrompt(e.target.value, C.SO, C.TEXT) }
  function handleSetSoPromptFirstStrongExample (e: InputEvent) { handleSetPrompt(e.target.value, C.SO, C.FIRST_STRONG_EXAMPLE) }
  function handleSetSoPromptSecondStrongExample (e: InputEvent) { handleSetPrompt(e.target.value, C.SO, C.SECOND_STRONG_EXAMPLE) }

  return(
    <React.Fragment>
      <div className="info-section">
        <img alt={informationIcon.alt} src={informationIcon.src} />
        <p>You do not need to retype the stem for exemplars.</p>
      </div>
      <section className="prompt-section">
        <Input
          className="because-input"
          error={errors[C.BECAUSE_STEM]}
          handleChange={handleSetBecausePromptText}
          label="Because Stem"
          value={activityBecausePrompt.text}
        />
        <Input
          className="because-example"
          handleChange={handleSetBecausePromptFirstStrongExample}
          label="Because First Exemplar"
          value={activityBecausePrompt.first_strong_example}
        />
        <Input
          className="because-example"
          handleChange={handleSetBecausePromptSecondStrongExample}
          label="Because Second Exemplar"
          value={activityBecausePrompt.second_strong_example}
        />
      </section>
      <section className="prompt-section">
        <Input
          className="but-input"
          error={errors[C.BUT_STEM]}
          handleChange={handleSetButPromptText}
          label="But Stem"
          value={activityButPrompt.text}
        />
        <Input
          className="but-example"
          handleChange={handleSetButPromptFirstStrongExample}
          label="But First Exemplar"
          value={activityButPrompt.first_strong_example}
        />
        <Input
          className="but-example"
          handleChange={handleSetButPromptSecondStrongExample}
          label="But Second Exemplar"
          value={activityButPrompt.second_strong_example}
        />
      </section>
      <section className="prompt-section">
        <Input
          className="so-input"
          error={errors[C.SO_STEM]}
          handleChange={handleSetSoPromptText}
          label="So Stem"
          value={activitySoPrompt.text}
        />
        <Input
          className="so-example"
          handleChange={handleSetSoPromptFirstStrongExample}
          label="So First Exemplar"
          value={activitySoPrompt.first_strong_example}
        />
        <Input
          className="so-example"
          handleChange={handleSetSoPromptSecondStrongExample}
          label="So Second Exemplar"
          value={activitySoPrompt.second_strong_example}
        />
      </section>
    </React.Fragment>
  )
}

export default PromptsForm;
