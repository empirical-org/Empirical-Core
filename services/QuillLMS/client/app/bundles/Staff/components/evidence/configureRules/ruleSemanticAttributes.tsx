import * as React from "react";

import { Input } from '../../../../Shared/index';
import { handleSetRuleLabelName } from '../../../helpers/evidence/ruleHelpers';
import { InputEvent } from '../../../interfaces/evidenceInterfaces';

interface RuleSemanticAttributesProps {
  errors: any,
  ruleLabelName: string,
  ruleLabelNameDisabled: boolean,
  ruleLabelStatus: string,
  setRuleLabelName: (ruleLabelName: string) => void
}

const RuleSemanticAttributes = ({
  errors,
  ruleLabelName,
  ruleLabelNameDisabled,
  ruleLabelStatus,
  setRuleLabelName,
}: RuleSemanticAttributesProps) => {

  function onHandleSetRuleLabelName(e: InputEvent) { handleSetRuleLabelName(e, setRuleLabelName) }

  return(
    <React.Fragment>
      <Input
        className="label-name-input"
        disabled={ruleLabelNameDisabled}
        error={errors['Label Name']}
        handleChange={onHandleSetRuleLabelName}
        label="AutoML Label"
        value={ruleLabelName}
      />
      <p className="label-explanation">Label requirements: name must be unique (prompt cannot have duplicate label names), labels cannot contain spaces; maximum of 32 characters.</p>
      <p className="label-explanation">Once the Label Name is submitted, it cannot be edited.</p>
      <section className="label-status-container">
        <p id="label-status-label">Label Status</p>
        <p id="label-status">{ruleLabelStatus}</p>
      </section>
    </React.Fragment>
  )
}

export default RuleSemanticAttributes;
