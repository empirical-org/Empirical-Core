import { ContentState, EditorState } from 'draft-js';
import * as React from "react";

import { ruleOptimalOptions, ruleTypeOptions, universalRuleTypeOptions } from '../../../../../constants/evidence';
import { DropdownInput, Input, TextEditor } from '../../../../Shared/index';
import { renderIDorUID } from '../../../helpers/evidence/renderHelpers';
import {
  handleSetRuleConceptUID, handleSetRuleName, handleSetRuleNote, handleSetRuleOptimal,
  handleSetRuleType
} from '../../../helpers/evidence/ruleHelpers';
import { DropdownObjectInterface, InputEvent } from '../../../interfaces/evidenceInterfaces';

interface RuleGenericAttributesProps {
  autoMLParams?: any,
  isAutoML?: boolean,
  isUniversal: boolean,
  errors: any,
  ruleConceptUID: string,
  ruleTypeDisabled: boolean,
  ruleNote: string,
  ruleID?: number,
  ruleUID?: string,
  ruleName: string,
  ruleOptimal: any,
  ruleType: any,
  concepts: any[],
  setRuleConceptUID: (ruleConceptUID: string) => void,
  setRuleNote: (ruleNote: string) => void,
  setRuleName: (ruleName: string) => void,
  setRuleOptimal: (ruleOptimal: DropdownObjectInterface) => void,
  setRuleType: (ruleType: DropdownObjectInterface) => void
}

const RuleGenericAttributes = ({
  autoMLParams,
  isAutoML,
  isUniversal,
  errors,
  concepts,
  ruleConceptUID,
  ruleNote,
  ruleID,
  ruleUID,
  ruleName,
  ruleOptimal,
  ruleType,
  ruleTypeDisabled,
  setRuleConceptUID,
  setRuleNote,
  setRuleName,
  setRuleOptimal,
  setRuleType
}: RuleGenericAttributesProps) => {

  function onHandleSetRuleType(ruleType: DropdownObjectInterface) { handleSetRuleType(ruleType, setRuleType) }

  function onHandleSetRuleName(e: InputEvent) { handleSetRuleName(e, setRuleName) }

  function onHandleSetRuleConceptUID(concept: DropdownObjectInterface) { handleSetRuleConceptUID(concept.value, setRuleConceptUID) }

  function onHandleSetRuleOptimal(ruleOptimal: DropdownObjectInterface) { handleSetRuleOptimal(ruleOptimal, setRuleOptimal) }

  function onHandleSetRuleNote(text: string) { handleSetRuleNote(text, setRuleNote)}

  let options = isUniversal ? universalRuleTypeOptions : ruleTypeOptions;
  if(!isAutoML) {
    options = options.filter(option => option.value !== 'autoML');
  }
  const conceptOptions = concepts.map(c => ({ value: c.uid, label: c.name, }));
  const selectedConceptOption = conceptOptions.find(co => co.value === ruleConceptUID);
  const nameInputLabel = autoMLParams && autoMLParams['label'] ? autoMLParams['label'] : 'Name';
  const noteLabel = autoMLParams && autoMLParams['notes'] ? autoMLParams['notes'] : 'Rule Note';

  return(
    <React.Fragment>
      <DropdownInput
        className={`rule-type-input ${ruleTypeDisabled ? 'disabled' : ''}`}
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
        label={nameInputLabel}
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
      <p className="form-subsection-label">{noteLabel}</p>
      <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        handleTextChange={onHandleSetRuleNote}
        key="rule-note"
        shouldCheckSpelling={true}
        text={ruleNote}
      />
    </React.Fragment>
  )
}

export default RuleGenericAttributes;
