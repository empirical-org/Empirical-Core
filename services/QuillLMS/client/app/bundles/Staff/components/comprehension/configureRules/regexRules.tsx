import * as React from "react";

import { Input } from '../../../../Shared/index';

interface RegexRulesProps {
  errors: {},
  handleAddRegexInput: (event: React.MouseEvent) => void,
  handleDeleteRegexRule: (event: React.SyntheticEvent) => void,
  handleSetRegexRule: (event: React.ChangeEvent) => void,
  regexRules: {}
}
const RegexRules = ({ errors, handleAddRegexInput, handleDeleteRegexRule, handleSetRegexRule, regexRules }: RegexRulesProps) => {
  const renderRegexRules = () => {
    const regexRuleKeys = Object.keys(regexRules);
    return !!regexRuleKeys.length && regexRuleKeys.map((ruleKey, i) => {
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
            <div className="checkbox-container">
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
        Add Regex Rule +
      </button>
    </div>
  )
}

export default RegexRules
