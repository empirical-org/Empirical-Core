import { renderHook } from "@testing-library/react-hooks";

import populateRulesState from "../comprehension/populateRulesState";

describe("populateRulesState tests", () => {
  const setRulesHashAndList = jest.fn();
  const rules = {
    universalRules: [{id:1}]
  };
  const rulesHash = {};
  let rulesList = [{id:1}];

  it("does not call setRulesHashAndList if conditional is false", () => {
    renderHook(() => populateRulesState({ rules, rulesHash, rulesList, setRulesHashAndList }));
    expect(setRulesHashAndList).not.toHaveBeenCalled();
  });

  it("calls setRulesHashAndList if conditional is true", () => {
    rulesList = [];
    renderHook(() => populateRulesState({ rules, rulesHash, rulesList, setRulesHashAndList }));
    expect(setRulesHashAndList).toHaveBeenCalled();
  });
});
