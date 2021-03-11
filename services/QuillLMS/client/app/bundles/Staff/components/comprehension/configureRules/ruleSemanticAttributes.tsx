import * as React from "react";

import { handleSetRuleLabelName } from '../../../helpers/comprehension/ruleHelpers';
import { InputEvent } from '../../../interfaces/comprehensionInterfaces';
import { Input } from '../../../../Shared/index'

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
        label="Label Name"
        value={ruleLabelName}
      />
      <section className="label-status-container">
        <p id="label-status-label">Label/Rule Status</p>
        <p id="label-status">{ruleLabelStatus}</p>
      </section>
    </React.Fragment>
  )
}

export default RuleSemanticAttributes;
