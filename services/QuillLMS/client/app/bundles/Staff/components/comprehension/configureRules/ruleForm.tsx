import * as React from "react";
import { useQuery } from 'react-query';

import RuleAttributesSection from './ruleAttributesSection';
import RulePromptsSection from './rulePromptsSection';

import { fetchRules, fetchUniversalRules } from '../../../utils/comprehension/ruleAPIs';
import { validateForm, buildRule, formatPrompts, formatFeedbacks, formatRegexRules } from '../../../helpers/comprehension';
import {
  handleSetRuleName,
  handleSetRuleConceptUID,
  handleSetRuleType,
  handleSetRuleOptimal
} from '../../../helpers/comprehension/ruleHelpers';
import { ruleTypeOptions, ruleOptimalOptions } from '../../../../../constants/comprehension';
import { ActivityInterface, RuleInterface, RuleFeedbackInterface, InputEvent } from '../../../interfaces/comprehensionInterfaces';
import { Input, DropdownInput } from '../../../../Shared/index'

interface RuleFormProps {
  activityData: ActivityInterface,
  activityId: string,
  closeModal: (event: React.MouseEvent) => void,
  isUniversal: boolean,
  rule: RuleInterface,
  submitRule: (rule: {rule: RuleInterface}) => void
}

const RuleForm = ({ activityData, activityId, closeModal, isUniversal, rule, submitRule }: RuleFormProps) => {

  const { name, rule_type, id, optimal, plagiarism_text, concept_uid } = rule;
  const initialRuleType = rule_type ? ruleTypeOptions.filter(ruleType => ruleType.value === rule_type)[0] : ruleTypeOptions[0];
  const initialRuleOptimal = optimal ? ruleOptimalOptions[0] : ruleOptimalOptions[1];
  const initialPlagiarismText = plagiarism_text ? plagiarism_text : { text: '' }

  const [ruleType, setRuleType] = React.useState<any>(initialRuleType);
  const [ruleName, setRuleName] = React.useState<string>(name || '');
  const [ruleOptimal, setRuleOptimal] = React.useState<any>(initialRuleOptimal);
  const [ruleConceptUID, setRuleConceptUID] = React.useState<string>(concept_uid);
  const [plagiarismText, setPlagiarismText] = React.useState<RuleInterface["plagiarism_text"]>(initialPlagiarismText);
  const [firstPlagiarismFeedback, setFirstPlagiarismFeedback] = React.useState<RuleFeedbackInterface >(null);
  const [secondPlagiarismFeedback, setSecondPlagiarismFeedback] = React.useState<RuleFeedbackInterface >(null);
  const [regexFeedback, setRegexFeedback] = React.useState<RuleFeedbackInterface >(null);
  const [rulePrompts, setRulePrompts] = React.useState<object>({});
  const [regexRules, setRegexRules] = React.useState<object>({});
  const [rulesToCreate, setRulesToCreate] = React.useState<object>({});
  const [rulesToDelete, setRulesToDelete] = React.useState<object>({});
  const [rulesToUpdate, setRulesToUpdate] = React.useState<object>({});
  const [rulesCount, setRulesCount] = React.useState<number>(null);
  const [universalRulesCount, setUniversalRulesCount] = React.useState<number>(null);
  const [errors, setErrors] = React.useState<object>({});

  // cache ruleSets data for handling rule suborder
  const { data: rulesData } = useQuery({
    queryKey: [`rules-${activityId}`, activityId],
    queryFn: fetchRules
  });

    // cache ruleSets data for handling universal rule suborder
    const { data: universalRulesData } = useQuery("universal-rules", fetchUniversalRules);

  React.useEffect(() => {
    formatPrompts({ activityData, rule, setRulePrompts });
  }, [activityData]);

  React.useEffect(() => {
    formatRegexRules({ rule, setRegexRules });
    formatFeedbacks({ rule, ruleType, setFirstPlagiarismFeedback, setSecondPlagiarismFeedback, setRegexFeedback });
  }, [rule]);

  React.useEffect(() => {
    if(!rulesCount && rulesData && rulesData.rules) {
      const { rules } = rulesData;
      setRulesCount(rules.length);
    }
    else if(!universalRulesCount && universalRulesData && universalRulesData.universalRules) {
      const { universalRules } = universalRulesData;
      setUniversalRulesCount(universalRules.length);
    }
  }, [rulesData, universalRulesData])

  function onHandleSetRuleType(ruleType) { handleSetRuleType(ruleType, setRuleType) }

  function onHandleSetRuleName(e: InputEvent) { handleSetRuleName(e, setRuleName) }

  function onHandleSetRuleConceptUID(e: InputEvent) { handleSetRuleConceptUID(e, setRuleConceptUID) }

  function onHandleSetRuleOptimal(ruleOptimal) { handleSetRuleOptimal(ruleOptimal, setRuleOptimal) }

  function handleSubmitRule() {
    const newOrUpdatedRule = buildRule({
      plagiarismText,
      firstPlagiarismFeedback,
      regexFeedback,
      regexRules,
      rule,
      ruleName,
      ruleConceptUID,
      ruleOptimal,
      rulePrompts,
      rulesCount,
      ruleType,
      secondPlagiarismFeedback,
    });
    let keys: string[] = ['Name', 'Concept UID'];
    let state: any[] = [ruleName, ruleConceptUID];
    if(ruleType.value === "Regex") {
      keys.push("Regex Feedback");
      state.push(regexFeedback.text)
    } else if(ruleType.value === "Plagiarism") {
      keys = keys.concat(["Plagiarism Text", "First Plagiarism Feedback", "Second Plagiarism Feedback"]);
      state = state.concat([plagiarismText.text, firstPlagiarismFeedback.text, secondPlagiarismFeedback.text]);
    }
    Object.keys(regexRules).map((key, i) => {
      keys.push(`Regex rule ${i + 1}`);
      state.push(regexRules[key].regex_text);
    });
    keys.push('Stem Applied');
    state.push(rulePrompts);
    const validationErrors = validateForm(keys, state);
    if(validationErrors && Object.keys(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      submitRule(newOrUpdatedRule);
    }
  }

  const errorsPresent = !!Object.keys(errors).length;
  const ruleTypeDisabled = id ? 'disabled' : '';

  return(
    <div className="rule-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="submit">x</button>
      </div>
      <form className="rule-form">
        <DropdownInput
          className={`rule-type-input ${ruleTypeDisabled}`}
          disabled={!!ruleTypeDisabled}
          handleChange={onHandleSetRuleType}
          isSearchable={true}
          label="Rule Type"
          options={ruleTypeOptions}
          value={ruleType}
        />
        <Input
          className="name-input"
          error={errors['Name']}
          handleChange={onHandleSetRuleName}
          label="Name"
          value={ruleName}
        />
        <Input
          className="concept-uid-input"
          error={errors['Concept UID']}
          handleChange={onHandleSetRuleConceptUID}
          label="Concept UID"
          value={ruleConceptUID}
        />
        <DropdownInput
          className='rule-type-input'
          handleChange={onHandleSetRuleOptimal}
          isSearchable={true}
          label="Optimal?"
          options={ruleOptimalOptions}
          value={ruleOptimal}
        />
        <RuleAttributesSection
          errors={errors}
          firstPlagiarismFeedback={firstPlagiarismFeedback}
          plagiarismText={plagiarismText}
          regexFeedback={regexFeedback}
          regexRules={regexRules}
          rulesToCreate={rulesToCreate}
          rulesToDelete={rulesToDelete}
          rulesToUpdate={rulesToUpdate}
          ruleType={ruleType && ruleType.value}
          secondPlagiarismFeedback={secondPlagiarismFeedback}
          setFirstPlagiarismFeedback={setFirstPlagiarismFeedback}
          setPlagiarismText={setPlagiarismText}
          setRegexFeedback={setRegexFeedback}
          setRegexRules={setRegexRules}
          setRulesToCreate={setRulesToCreate}
          setRulesToDelete={setRulesToDelete}
          setRulesToUpdate={setRulesToUpdate}
          setSecondPlagiarismFeedback={setSecondPlagiarismFeedback}
        />
        <RulePromptsSection
          errors={errors}
          rulePrompts={rulePrompts}
          setRulePrompts={setRulePrompts}
        />
        <div className="submit-button-container">
          {errorsPresent && <div className="error-message-container">
            <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
          </div>}
          <button className="quill-button fun primary contained" id="activity-submit-button" onClick={handleSubmitRule} type="button">
            Submit
          </button>
          <button className="quill-button fun primary contained" id="activity-cancel-button" onClick={closeModal} type="submit">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default RuleForm;
