import * as React from "react";

import { regexRuleSequenceOptions } from '../../../../../constants/evidence';
import { DropdownInput, Input } from '../../../../Shared/index';
import { getSequenceType } from "../../../helpers/evidence/ruleHelpers";
import { DropdownObjectInterface } from '../../../interfaces/evidenceInterfaces';

const MAX_REGEX_LENGTH = 200

interface RegexRulesProps {
  errors: {},
  handleAddRegexInput: (event: React.MouseEvent) => void,
  handleDeleteRegexRule: (event: React.SyntheticEvent) => void,
  handleSetRegexRule: (event: React.ChangeEvent, ruleKey?: string) => void,
  handleSetRegexRuleSequence: (option: DropdownObjectInterface, ruleKey: string) => void,
  regexRules: {}
}
const RegexRules = ({ errors, handleAddRegexInput, handleDeleteRegexRule, handleSetRegexRule, handleSetRegexRuleSequence, regexRules }: RegexRulesProps) => {

  function getInitialSequenceType (regexRule) {
    if(typeof regexRule.sequence_type === 'string') {
      return getSequenceType(regexRule.sequence_type);
    } else if(regexRule.sequence_type) {
      return regexRule.sequence_type;
    }
    return regexRuleSequenceOptions[0];
  }

  function renderRegexRules() {
    const regexRuleKeys = Object.keys(regexRules);
    return !!regexRuleKeys.length && regexRuleKeys.map((ruleKey, i) => {
      const sequenceType = getInitialSequenceType(regexRules[ruleKey]);
      const charactersRemaining = MAX_REGEX_LENGTH - regexRules[ruleKey].regex_text.length
      return(
        <div className="regex-rule-container" key={`regex-rule-container-${i}`}>
          <div className="regex-input-container">
            <Input
              className="regex-input"
              error={errors[`Regex rule ${i + 1}`]}
              handleChange={handleSetRegexRule}
              id={ruleKey}
              value={regexRules[ruleKey].regex_text}
            />
            <p className="characters-remaining">{charactersRemaining} characters remaining</p>
            <div className="checkbox-container">
              <DropdownInput
                className='rule-type-input'
                // eslint-disable-next-line
                handleChange={(option) => handleSetRegexRuleSequence(option, ruleKey)}
                id={ruleKey}
                isSearchable={true}
                label="Sequence Type"
                options={regexRuleSequenceOptions}
                value={sequenceType}
              />
              <label className="case-sensitive-label" htmlFor={`regex-case-sensitive-${i}`}>
                Case Sensitive?
              </label>
              <input
                aria-labelledby={ruleKey}
                checked={regexRules[ruleKey].case_sensitive}
                id={`regex-case-sensitive-${i}`}
                onChange={handleSetRegexRule}
                type="checkbox"
                value={ruleKey}
              />
            </div>
          </div>
          <button
            className="quill-button fun primary outlined delete-regex-button"
            id="remove-regex-button"
            onClick={handleDeleteRegexRule}
            type="button"
            value={ruleKey}
          >
            remove
          </button>
        </div>
      );
    });
  }
  return(
    <div className="regex-rules-container">
      {renderRegexRules()}
      <button
        className="quill-button fun primary outlined add-regex-button"
        id="add-regex-button"
        onClick={handleAddRegexInput}
        type="button"
      >
        Add Sequence +
      </button>
    </div>
  )
}

export default RegexRules
