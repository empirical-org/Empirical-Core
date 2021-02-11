import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import {
  handleSetRuleConceptUID,
  handleSetRuleDescription,
  handleSetRuleName,
  handleSetRuleOptimal,
  handleSetRuleType,
} from '../../../helpers/comprehension/ruleHelpers';
import { ruleTypeOptions, ruleOptimalOptions } from '../../../../../constants/comprehension';
import { InputEvent, DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';
import { Input, DropdownInput, TextEditor } from '../../../../Shared/index'

interface RuleFormProps {
  errors: any,
  ruleConceptUID: string,
  ruleDescription: string,
  ruleID: number,
  ruleName: string,
  ruleOptimal: any,
  ruleType: any,
  setRuleConceptUID: (ruleConceptUID: string) => void,
  setRuleDescription: (ruleDescription: string) => void,
  setRuleName: (ruleName: string) => void,
  setRuleOptimal: (ruleOptimal: DropdownObjectInterface) => void,
  setRuleType: (ruleType: DropdownObjectInterface) => void
}

const RuleGenericAttributesSection = ({
  errors,
  ruleConceptUID,
  ruleDescription,
  ruleID,
  ruleName,
  ruleOptimal,
  ruleType,
  setRuleConceptUID,
  setRuleDescription,
  setRuleName,
  setRuleOptimal,
  setRuleType
 }: RuleFormProps) => {

  function onHandleSetRuleType(ruleType: DropdownObjectInterface) { handleSetRuleType(ruleType, setRuleType) }

  function onHandleSetRuleName(e: InputEvent) { handleSetRuleName(e, setRuleName) }

  function onHandleSetRuleConceptUID(e: InputEvent) { handleSetRuleConceptUID(e, setRuleConceptUID) }

  function onHandleSetRuleOptimal(ruleOptimal: DropdownObjectInterface) { handleSetRuleOptimal(ruleOptimal, setRuleOptimal) }

  function onHandleSetRuleDescription(text: string) { handleSetRuleDescription(text, setRuleDescription)}

  const ruleTypeDisabled = ruleID ? 'disabled' : '';

  return(
    <React.Fragment>
      <DropdownInput
        className={`rule-type-input ${ruleTypeDisabled}`}
        disabled={!!ruleTypeDisabled}
        handleChange={onHandleSetRuleType}
        isSearchable={true}
        label="Rule Type"
        options={ruleTypeOptions}
        value={ruleType}
      />
      <Input
        className="name-input"
        error={errors['Name']}
        handleChange={onHandleSetRuleName}
        label="Name"
        value={ruleName}
      />
      <Input
        className="concept-uid-input"
        error={errors['Concept UID']}
        handleChange={onHandleSetRuleConceptUID}
        label="Concept UID"
        value={ruleConceptUID}
      />
      <DropdownInput
        className='rule-type-input'
        handleChange={onHandleSetRuleOptimal}
        isSearchable={true}
        label="Optimal?"
        options={ruleOptimalOptions}
        value={ruleOptimal}
      />
      <p className="form-subsection-label">Rule Description</p>
      <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        handleTextChange={onHandleSetRuleDescription}
        key="rule-description"
        text={ruleDescription}
      />
    </React.Fragment>
  )
}

export default RuleGenericAttributesSection;
