import * as React from 'react';

function handleRulesListUpdate({ location, rulesUpdated, handleUpdateRulesList }) {
  return React.useEffect(() => {
    const shouldUpdateRulesList = location && location.state && !rulesUpdated;
    if(!shouldUpdateRulesList) {
      return;
    }
    const { state } = location;
    const { returnedToIndex, ruleDeleted } = state
    if(returnedToIndex || ruleDeleted) {
      handleUpdateRulesList();
    }
  }, [location])
}

export default handleRulesListUpdate;
