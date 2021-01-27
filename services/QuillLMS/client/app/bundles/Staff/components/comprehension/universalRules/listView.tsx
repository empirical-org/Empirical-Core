import * as React from "react";

import { Error, Spinner, DropdownInput } from '../../../../Shared/index';

// const data = { error: 'merp!'};
const data = { universal_rules: '', error: null };
const ruleTypes = [{"value":"Opinion","label":"Opinon"},{"value":"Grammar","label":"Grammar"},{"value":"Spelling","label":"Spelling"}];

const UniversalRulesIndex = () => {

  const [ruleType, setRuleType] = React.useState<any>(ruleTypes[0]);

  function handleSetRuleType(ruleType: any) { setRuleType(ruleType) };

  if(!data) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(data.error) {
    return(
      <div className="error-container">
        <Error error={`${data.error}`} />
      </div>
    );
  }

  return(
    <div className="universal-rules-index-container">
      <h2>Universal Rules Index</h2>
      <section className="top-section">
        <DropdownInput
          className="rule-type-input"
          handleChange={handleSetRuleType}
          isSearchable={true}
          label="Select Rule Type"
          options={ruleTypes}
          value={ruleType}
        />
        <button className="quill-button small primary contained" type="button">Create New Grammar Rule (Danger Zone!)</button>
      </section>
      <p className="sortable-instructions">Change the rule order note by drag and drop</p>
    </div>
  );
}

export default UniversalRulesIndex
