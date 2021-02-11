import * as React from "react";
import { useQuery } from 'react-query';

import RuleGenericAttributes from './ruleGenericAttributes';
import RulePlagiarismAttributes from './rulePlagiarismAttributes';
import RuleRegexAttributes from './ruleRegexAttributes';
import RulePrompts from './rulePrompts';

import { fetchRules, fetchUniversalRules } from '../../../utils/comprehension/ruleAPIs';
import { formatPrompts, formatFeedbacks, formatRegexRules } from '../../../helpers/comprehension';
import { handleSubmitRule } from '../../../helpers/comprehension/ruleHelpers';
import { ruleTypeOptions, ruleOptimalOptions } from '../../../../../constants/comprehension';
import { ActivityInterface, RuleInterface, RuleFeedbackInterface, DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';

interface RuleFormProps {
  activityData: ActivityInterface,
  activityId: string,
  closeModal: (event: React.MouseEvent) => void,
  isUniversal: boolean,
  rule: RuleInterface,
  submitRule: (rule: {rule: RuleInterface}) => void
}

const RuleForm = ({ activityData, activityId, closeModal, isUniversal, rule, submitRule }: RuleFormProps) => {

  const { name, rule_type, id, optimal, plagiarism_text, concept_uid, description } = rule;
  const initialRuleType = rule_type ? ruleTypeOptions.filter(ruleType => ruleType.value === rule_type)[0] : ruleTypeOptions[0];
  const initialRuleOptimal = optimal ? ruleOptimalOptions[0] : ruleOptimalOptions[1];
  const initialPlagiarismText = plagiarism_text ? plagiarism_text : { text: '' }
  const initialDescription = description ? description : '';

  const [errors, setErrors] = React.useState<object>({});
  const [firstPlagiarismFeedback, setFirstPlagiarismFeedback] = React.useState<RuleFeedbackInterface >(null);
  const [plagiarismText, setPlagiarismText] = React.useState<RuleInterface["plagiarism_text"]>(initialPlagiarismText);
  const [regexFeedback, setRegexFeedback] = React.useState<RuleFeedbackInterface >(null);
  const [regexRules, setRegexRules] = React.useState<object>({});
  const [ruleConceptUID, setRuleConceptUID] = React.useState<string>(concept_uid);
  const [ruleDescription, setRuleDescription] = React.useState<string>(initialDescription);
  const [ruleOptimal, setRuleOptimal] = React.useState<any>(initialRuleOptimal);
  const [ruleName, setRuleName] = React.useState<string>(name || '');
  const [rulePrompts, setRulePrompts] = React.useState<object>({});
  const [rulesCount, setRulesCount] = React.useState<number>(null);
  const [rulesToCreate, setRulesToCreate] = React.useState<object>({});
  const [rulesToDelete, setRulesToDelete] = React.useState<object>({});
  const [rulesToUpdate, setRulesToUpdate] = React.useState<object>({});
  const [ruleType, setRuleType] = React.useState<DropdownObjectInterface>(initialRuleType);
  const [secondPlagiarismFeedback, setSecondPlagiarismFeedback] = React.useState<RuleFeedbackInterface >(null);
  const [universalRulesCount, setUniversalRulesCount] = React.useState<number>(null);

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
  }, [rulesData, universalRulesData]);

  function onHandleSubmitRule() {
    handleSubmitRule({
      plagiarismText,
      firstPlagiarismFeedback,
      regexFeedback,
      regexRules,
      rule,
      ruleName,
      ruleConceptUID,
      ruleDescription,
      ruleOptimal,
      rulePrompts,
      rulesCount,
      ruleType,
      secondPlagiarismFeedback,
      setErrors,
      submitRule
    });
  }

  const errorsPresent = !!Object.keys(errors).length;

  return(
    <div className="rule-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="submit">x</button>
      </div>
      <form className="rule-form">
        <RuleGenericAttributes
          errors={errors}
          ruleConceptUID={ruleConceptUID}
          ruleDescription={ruleDescription}
          ruleID={id}
          ruleName={ruleName}
          ruleOptimal={ruleOptimal}
          ruleType={ruleType}
          setRuleConceptUID={setRuleConceptUID}
          setRuleDescription={setRuleDescription}
          setRuleName={setRuleName}
          setRuleOptimal={setRuleOptimal}
          setRuleType={setRuleType}
        />
        {ruleType && ruleType.value === 'Plagiarism' && <RulePlagiarismAttributes
          errors={errors}
          firstPlagiarismFeedback={firstPlagiarismFeedback}
          plagiarismText={plagiarismText}
          secondPlagiarismFeedback={secondPlagiarismFeedback}
          setFirstPlagiarismFeedback={setFirstPlagiarismFeedback}
          setPlagiarismText={setPlagiarismText}
          setSecondPlagiarismFeedback={setSecondPlagiarismFeedback}
        />}
        {ruleType && ruleType.value === 'Regex' && <RuleRegexAttributes
          errors={errors}
          regexFeedback={regexFeedback}
          regexRules={regexRules}
          rulesToCreate={rulesToCreate}
          rulesToDelete={rulesToDelete}
          rulesToUpdate={rulesToUpdate}
          setRegexFeedback={setRegexFeedback}
          setRegexRules={setRegexRules}
          setRulesToCreate={setRulesToCreate}
          setRulesToDelete={setRulesToDelete}
          setRulesToUpdate={setRulesToUpdate}
        />}
        <RulePrompts
          errors={errors}
          rulePrompts={rulePrompts}
          setRulePrompts={setRulePrompts}
        />
        <div className="submit-button-container">
          {errorsPresent && <div className="error-message-container">
            <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
          </div>}
          <button className="quill-button fun primary contained" id="activity-submit-button" onClick={onHandleSubmitRule} type="button">
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
