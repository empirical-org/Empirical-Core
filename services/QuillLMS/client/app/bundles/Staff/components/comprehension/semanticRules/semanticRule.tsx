import * as React from "react";
import { useQuery } from 'react-query';
import { Link, withRouter } from 'react-router-dom';

import RuleGenericAttributes from '../configureRules/ruleGenericAttributes';
import RulePlagiarismAttributes from '../configureRules/rulePlagiarismAttributes';
import RuleSemanticAttributes from '../configureRules/ruleSemanticAttributes';
import RuleRegexAttributes from '../configureRules/ruleRegexAttributes';
import RulePrompts from '../configureRules/rulePrompts';
import RuleUniversalAttributes from '../configureRules/ruleUniversalAttributes';
import { Spinner } from '../../../../Shared/index';
import { fetchRules, fetchUniversalRules } from '../../../utils/comprehension/ruleAPIs';
import { formatPrompts } from '../../../helpers/comprehension';
import { handleSubmitRule, getInitialRuleType, formatInitialFeedbacks, returnInitialFeedback, formatRegexRules } from '../../../helpers/comprehension/ruleHelpers';
import { ruleOptimalOptions, regexRuleTypes } from '../../../../../constants/comprehension';
import { RuleInterface, DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';

interface SemanticRuleFormProps {
  activityData?: any,
  activityId?: string,
  isUniversal?: boolean,
  isSemantic?: boolean,
  rule?: RuleInterface,
  prompt?: any,
  location: any
}

const SemanticRuleForm = ({ activityData, activityId, isSemantic, isUniversal, rule, location }: SemanticRuleFormProps) => {

  let ruleForForm;
  if(rule) {
    ruleForForm = rule;
  } else if(location.state && location.state.rule) {
    ruleForForm = location.state.rule;
  }

  const initialRuleType = getInitialRuleType({ isUniversal, rule_type: ruleForForm && ruleForForm.rule_type, universalRuleType: null});
  const initialRuleOptimal = ruleForForm && ruleForForm.optimal ? ruleOptimalOptions[0] : ruleOptimalOptions[1];
  const initialPlagiarismText = ruleForForm && ruleForForm.plagiarism_text || { text: '' }
  const initialDescription = ruleForForm && ruleForForm.description || '';
  const initialFeedbacks = ruleForForm && ruleForForm.feedbacks ? formatInitialFeedbacks(ruleForForm && ruleForForm.feedbacks) : returnInitialFeedback(initialRuleType.value);

  const [errors, setErrors] = React.useState<object>({});
  const [plagiarismText, setPlagiarismText] = React.useState<RuleInterface["plagiarism_text"]>(initialPlagiarismText);
  const [regexRules, setRegexRules] = React.useState<object>({});
  const [ruleConceptUID, setRuleConceptUID] = React.useState<string>(ruleForForm && ruleForForm.concept_uid);
  const [ruleDescription, setRuleDescription] = React.useState<string>(initialDescription);
  const [ruleFeedbacks, setRuleFeedbacks] = React.useState<object>(initialFeedbacks);
  const [ruleOptimal, setRuleOptimal] = React.useState<any>(initialRuleOptimal);
  const [ruleName, setRuleName] = React.useState<string>(ruleForForm && ruleForForm.name);
  const [ruleLabelName, setRuleLabelName] = React.useState<string>(ruleForForm && ruleForForm.label && ruleForForm.label.name);
  const [ruleLabelStatus, setRuleLabelStatus] = React.useState<string>('Active');
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
    formatRegexRules({ rule, setRegexRules });
  }, [ruleForForm]);

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
    if(ruleForForm && !ruleForForm.feedbacks) {
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
      submitRule: {},
      universalRulesCount
    });
  }

  const errorsPresent = !!Object.keys(errors).length;
  const cancelLink = (<Link to={`/activities/${activityId}/semantic-rules`}>Cancel</Link>);

  if(!ruleForForm) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <div className="rule-form-container">
      <section className="semantic-rule-form-header">
        <Link to={`/activities/${activityId}/semantic-rules`}>← Return to Semantic Rules Index</Link>
      </section>
      <form className="semantic-rule-form">
        <RuleGenericAttributes
          errors={errors}
          isUniversal={isUniversal}
          ruleConceptUID={ruleConceptUID}
          ruleDescription={ruleDescription}
          ruleID={ruleForForm && ruleForForm.id}
          ruleName={ruleName}
          ruleOptimal={ruleOptimal}
          ruleType={ruleType}
          setRuleConceptUID={setRuleConceptUID}
          setRuleDescription={setRuleDescription}
          setRuleName={setRuleName}
          setRuleOptimal={setRuleOptimal}
          setRuleType={setRuleType}
        />
        {isSemantic && <RuleSemanticAttributes
          errors={errors}
          ruleLabelName={ruleLabelName}
          ruleLabelNameDisabled={ruleForForm && ruleForForm.label && ruleForForm.label.name}
          ruleLabelStatus={ruleLabelStatus}
          setRuleLabelName={setRuleLabelName}
        />}
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
        {!isUniversal && !isSemantic && <RulePrompts
          errors={errors}
          rulePrompts={rulePrompts}
          setRulePrompts={setRulePrompts}
        />}
        {(isUniversal || isSemantic) && <RuleUniversalAttributes
          errors={errors}
          setUniversalFeedback={setRuleFeedbacks}
          universalFeedback={ruleFeedbacks}
        />}
        <div className="submit-button-container">
          {errorsPresent && <div className="error-message-container">
            <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
          </div>}
          <button className="quill-button fun primary contained" id="rule-submit-button" onClick={onHandleSubmitRule} type="button">
            Submit
          </button>
          <button className="quill-button fun primary contained" id="rule-cancel-button" type="submit">{cancelLink}</button>
        </div>
      </form>
    </div>
  )
}

export default withRouter<any, any>(SemanticRuleForm);
