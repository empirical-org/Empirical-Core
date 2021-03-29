import * as React from "react";
import { EditorState, ContentState } from 'draft-js';

import {
  handleSetRuleConceptUID,
  handleSetRuleDescription,
  handleSetRuleName,
  handleSetRuleOptimal,
  handleSetRuleType,
} from '../../../helpers/comprehension/ruleHelpers';
import { ruleTypeOptions, universalRuleTypeOptions, ruleOptimalOptions } from '../../../../../constants/comprehension';
import { InputEvent, DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';
import { Input, DropdownInput, TextEditor } from '../../../../Shared/index'

interface RuleGenericAttributesProps {
  isUniversal: boolean,
  errors: any,
  ruleConceptUID: string,
  ruleDescription: string,
  ruleID?: number,
  ruleUID?: string,
  ruleName: string,
  ruleOptimal: any,
  ruleType: any,
  concepts: any[],
  setRuleConceptUID: (ruleConceptUID: string) => void,
  setRuleDescription: (ruleDescription: string) => void,
  setRuleName: (ruleName: string) => void,
  setRuleOptimal: (ruleOptimal: DropdownObjectInterface) => void,
  setRuleType: (ruleType: DropdownObjectInterface) => void
}

const RuleGenericAttributes = ({
  isUniversal,
  errors,
  concepts,
  ruleConceptUID,
  ruleDescription,
  ruleID,
  ruleUID,
  ruleName,
  ruleOptimal,
  ruleType,
  setRuleConceptUID,
  setRuleDescription,
  setRuleName,
  setRuleOptimal,
  setRuleType
}: RuleGenericAttributesProps) => {

  function onHandleSetRuleType(ruleType: DropdownObjectInterface) { handleSetRuleType(ruleType, setRuleType) }

  function onHandleSetRuleName(e: InputEvent) { handleSetRuleName(e, setRuleName) }

  function onHandleSetRuleConceptUID(concept: DropdownObjectInterface) { handleSetRuleConceptUID(concept.value, setRuleConceptUID) }

  function onHandleSetRuleOptimal(ruleOptimal: DropdownObjectInterface) { handleSetRuleOptimal(ruleOptimal, setRuleOptimal) }

  function onHandleSetRuleDescription(text: string) { handleSetRuleDescription(text, setRuleDescription)}

  function renderIDorUID(idOrRuleId, type) {
    return(
      <section className="label-status-container">
        <p id="label-status-label">{type}</p>
        <p id="label-status">{idOrRuleId}</p>
      </section>
    );
  }

  const ruleTypeDisabled = (ruleID || ruleType.value === 'autoML') ? 'disabled' : '';
  const options = isUniversal ? universalRuleTypeOptions : ruleTypeOptions;
  const conceptOptions = concepts.map(c => ({ value: c.uid, label: c.name, }));
  const selectedConceptOption = conceptOptions.find(co => co.value === ruleConceptUID);

  return(
    <React.Fragment>
      <DropdownInput
        className={`rule-type-input ${ruleTypeDisabled}`}
        disabled={!!ruleTypeDisabled}
        handleChange={onHandleSetRuleType}
        isSearchable={true}
        label="Rule Type"
        options={options}
        value={ruleType}
      />
      <Input
        className="name-input"
        error={errors['Name']}
        handleChange={onHandleSetRuleName}
        label="Name"
        value={ruleName}
      />
      <DropdownInput
        className="concept-uid-input"
        error={errors['Concept UID']}
        handleChange={onHandleSetRuleConceptUID}
        isSearchable={true}
        label="Concept"
        options={conceptOptions}
        value={selectedConceptOption}
      />
      <DropdownInput
        className='rule-type-input'
        handleChange={onHandleSetRuleOptimal}
        isSearchable={true}
        label="Optimal?"
        options={ruleOptimalOptions}
        value={ruleOptimal}
      />
      {ruleID && renderIDorUID(ruleID, 'Rule ID')}
      {ruleUID && renderIDorUID(ruleUID, 'Rule UID')}
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

export default RuleGenericAttributes;
