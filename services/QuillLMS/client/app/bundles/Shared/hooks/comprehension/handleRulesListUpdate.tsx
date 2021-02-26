import * as React from 'react';

function handleRulesListUpdate({ location, rulesUpdated, handleUpdateRulesList }) {
  return React.useEffect(() => {
    if(location && location.state && !rulesUpdated) {
      const { state } = location;
      const { returnedToIndex, ruleDeleted } = state
      if(returnedToIndex) {
        handleUpdateRulesList();
      } else if(ruleDeleted) {
        handleUpdateRulesList();
      }
    }
  }, [location])
}

export default handleRulesListUpdate;
