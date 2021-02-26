import * as React from 'react';

function populateRulesState({ rules, rulesHash, rulesList, setRulesHashAndList }) {
  return React.useEffect(() => {
    if (rules && rules.universalRules && !Object.keys(rulesHash).length && !rulesList.length) {
      setRulesHashAndList();
    }
  }, [rules])
}

export default populateRulesState;
