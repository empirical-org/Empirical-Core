import * as React from 'react';

function populateRulesState({ rules, rulesHash, rulesList, setRulesHashAndList }) {
  return React.useEffect(() => {
    const shouldSetRulesHashAndList = rules && rules.universalRules && !Object.keys(rulesHash).length && !rulesList.length;
    if(!shouldSetRulesHashAndList) {
      return;
    }
    setRulesHashAndList();
  }, [rules])
}

export default populateRulesState;
