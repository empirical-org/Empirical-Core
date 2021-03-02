import * as React from "react";
import { useQuery } from 'react-query';

import RuleGenericAttributes from './ruleGenericAttributes';
import RulePlagiarismAttributes from './rulePlagiarismAttributes';
import RuleRegexAttributes from './ruleRegexAttributes';
import RulePrompts from './rulePrompts';
import RuleUniversalAttributes from './ruleUniversalAttributes';

import { fetchRules, fetchUniversalRules } from '../../../utils/comprehension/ruleAPIs';
import { formatPrompts } from '../../../helpers/comprehension';
import { handleSubmitRule, getInitialRuleType, formatInitialFeedbacks, returnInitialFeedback, formatRegexRules } from '../../../helpers/comprehension/ruleHelpers';
import { ruleOptimalOptions, regexRuleTypes } from '../../../../../constants/comprehension';
import { ActivityInterface, RuleInterface, DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';

interface RuleFormProps {
  activityData?: ActivityInterface,
  activityId?: string,
  closeModal: (event: React.MouseEvent) => void,
  isUniversal: boolean,
  rule: RuleInterface,
  submitRule: (rule: {rule: RuleInterface}) => void
  universalRuleType?: string
}

const RuleForm = ({ activityData, activityId, closeModal, isUniversal, rule, submitRule, universalRuleType }: RuleFormProps) => {

  const { name, rule_type, id, optimal, plagiarism_text, concept_uid, description, feedbacks } = rule;
  const initialRuleType = getInitialRuleType({ isUniversal, rule_type, universalRuleType});
  const initialRuleOptimal = optimal ? ruleOptimalOptions[0] : ruleOptimalOptions[1];
  const initialPlagiarismText = plagiarism_text || { text: '' }
  const initialDescription = description || '';
  const initialFeedbacks = feedbacks ? formatInitialFeedbacks(feedbacks) : returnInitialFeedback(initialRuleType.value);

  const [errors, setErrors] = React.useState<object>({});
  const [plagiarismText, setPlagiarismText] = React.useState<RuleInterface["plagiarism_text"]>(initialPlagiarismText);
  const [regexRules, setRegexRules] = React.useState<object>({});
  const [ruleConceptUID, setRuleConceptUID] = React.useState<string>(concept_uid);
  const [ruleDescription, setRuleDescription] = React.useState<string>(initialDescription);
  const [ruleFeedbacks, setRuleFeedbacks] = React.useState<object>(initialFeedbacks);
  const [ruleOptimal, setRuleOptimal] = React.useState<any>(initialRuleOptimal);
  const [ruleName, setRuleName] = React.useState<string>(name || '');
  const [rulePrompts, setRulePrompts] = React.useState<object>({});
  const [rulesCount, setRulesCount] = React.useState<number>(null);
  const [rulesToCreate, setRulesToCreate] = React.useState<object>({});
  const [rulesToDelete, setRulesToDelete] = React.useState<object>({});
  const [rulesToUpdate, setRulesToUpdate] = React.useState<object>({});
  const [ruleType, setRuleType] = React.useState<DropdownObjectInterface>(initialRuleType);
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

  // needed for case where user toggles between plagiarism and rules-based rule types for new rules
  React.useEffect(() => {
    if(!feedbacks) {
      const initialFeedbacks = returnInitialFeedback(ruleType.value);
      setRuleFeedbacks(initialFeedbacks);
    }
  }, [ruleType]);

  function onHandleSubmitRule() {
    handleSubmitRule({
      plagiarismText,
      regexRules,
      rule,
      ruleName,
      ruleConceptUID,
      ruleDescription,
      ruleFeedbacks,
      ruleOptimal,
      rulePrompts,
      rulesCount,
      ruleType,
      setErrors,
      submitRule,
      universalRulesCount
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
          isUniversal={isUniversal}
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
        {ruleType && ruleType.value === 'plagiarism' && <RulePlagiarismAttributes
          errors={errors}
          plagiarismFeedbacks={ruleFeedbacks}
          plagiarismText={plagiarismText}
          setPlagiarismFeedbacks={setRuleFeedbacks}
          setPlagiarismText={setPlagiarismText}
        />}
        {ruleType && regexRuleTypes.includes(ruleType.value) && <RuleRegexAttributes
          errors={errors}
          regexFeedback={ruleFeedbacks}
          regexRules={regexRules}
          rulesToCreate={rulesToCreate}
          rulesToDelete={rulesToDelete}
          rulesToUpdate={rulesToUpdate}
          setRegexFeedback={setRuleFeedbacks}
          setRegexRules={setRegexRules}
          setRulesToCreate={setRulesToCreate}
          setRulesToDelete={setRulesToDelete}
          setRulesToUpdate={setRulesToUpdate}
        />}
        {!isUniversal && <RulePrompts
          errors={errors}
          rulePrompts={rulePrompts}
          setRulePrompts={setRulePrompts}
        />}
        {isUniversal && <RuleUniversalAttributes
          errors={errors}
          setUniversalFeedback={setRuleFeedbacks}
          universalFeedback={ruleFeedbacks}
        />}
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
