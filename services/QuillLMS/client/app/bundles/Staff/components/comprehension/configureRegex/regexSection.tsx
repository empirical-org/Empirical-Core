import * as React from "react";
import { Input } from 'quill-component-library/dist/componentLibrary';

const RegexSection = ({ errors, handleAddRegexInput, handleDeleteRegexRule, handleSetRegexRule, regexRules }) => {
  const regexRuleKeys = Object.keys(regexRules);
  return(
    <div className="regex-rules-container">
      {regexRuleKeys.length !== 0 && regexRuleKeys.map((ruleKey, i) => {
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
      })}
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

export default RegexSection
