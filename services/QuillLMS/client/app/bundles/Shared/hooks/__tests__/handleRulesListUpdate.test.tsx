import { renderHook } from "@testing-library/react-hooks";

import handleRulesListUpdate from "../comprehension/handleRulesListUpdate";

describe("handleRulesListUpdate tests", () => {
  const handleUpdateRulesList = jest.fn();
  const location = {
    state: {
      returnedToIndex: false,
      ruleDeleted: false
    }
  };
  const rulesUpdated = false;

  it("does not call handleUpdateRulesList if both returnedToIndex or ruleDeleted are false", () => {
    renderHook(() => handleRulesListUpdate({ location, rulesUpdated, handleUpdateRulesList }));
    expect(handleUpdateRulesList).not.toHaveBeenCalled();
  });

  it("calls handleUpdateRulesList if either returnedToIndex or ruleDeleted are true", () => {
    location.state.returnedToIndex = true;
    renderHook(() => handleRulesListUpdate({ location, rulesUpdated, handleUpdateRulesList }));
    expect(handleUpdateRulesList).toHaveBeenCalled();
  });
});
