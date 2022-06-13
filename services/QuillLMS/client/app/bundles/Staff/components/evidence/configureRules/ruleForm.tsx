import * as React from "react";
import { useQuery } from 'react-query';

import RuleGenericAttributes from './ruleGenericAttributes';
import RulePlagiarismAttributes from './rulePlagiarismAttributes';
import RuleRegexAttributes from './ruleRegexAttributes';
import RulePrompts from './rulePrompts';
import RuleUniversalAttributes from './ruleUniversalAttributes';
import RuleHint from './ruleHint'

import { fetchRules, fetchUniversalRules } from '../../../utils/evidence/ruleAPIs';
import { fetchConcepts, } from '../../../utils/evidence/conceptAPIs';
import { renderErrorsContainer } from '../../../helpers/evidence/renderHelpers';
import { formatPrompts } from '../../../helpers/evidence/promptHelpers';
import { handleSubmitRule, getInitialRuleType, formatInitialFeedbacks, returnInitialFeedback, formatRegexRules } from '../../../helpers/evidence/ruleHelpers';
import { ruleOptimalOptions, regexRuleTypes, PLAGIARISM } from '../../../../../constants/evidence';
import { ActivityInterface, RuleInterface, DropdownObjectInterface } from '../../../interfaces/evidenceInterfaces';

interface RuleFormProps {
  activityData?: ActivityInterface,
  activityId?: string,
  closeModal: (event: React.MouseEvent) => void,
  isUniversal: boolean,
  requestErrors: string[],
  rule: RuleInterface,
  submitRule: (rule: {rule: RuleInterface}) => void
  universalRuleType?: string
}

const RuleForm = ({ activityData, activityId, closeModal, isUniversal, requestErrors,  rule, submitRule, universalRuleType }: RuleFormProps) => {

  const { name, rule_type, id, uid, optimal, plagiarism_texts, concept_uid, note, feedbacks, conditional, hint, } = rule;
  const initialRuleType = getInitialRuleType({ isUniversal, rule_type, universalRuleType});
  const initialRuleOptimal = optimal ? ruleOptimalOptions[0] : ruleOptimalOptions[1];
  const initialPlagiarismTexts = plagiarism_texts || [{ text: '' }]
  const initialNote = note || '';
  const initialFeedbacks = feedbacks ? formatInitialFeedbacks(feedbacks) : returnInitialFeedback(initialRuleType.value);

  const [errors, setErrors] = React.useState<object>({});
  const [plagiarismTexts, setPlagiarismTexts] = React.useState<RuleInterface["plagiarism_texts"]>(initialPlagiarismTexts);
  const [regexRules, setRegexRules] = React.useState<object>({});
  const [ruleConceptUID, setRuleConceptUID] = React.useState<string>(concept_uid);
  const [ruleNote, setRuleNote] = React.useState<string>(initialNote);
  const [ruleFeedbacks, setRuleFeedbacks] = React.useState<object>(initialFeedbacks);
  const [ruleHint, setRuleHint] = React.useState<object|null>(hint)
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

  const { data: conceptsData } = useQuery({
    queryKey: ['concepts', activityId],
    queryFn: fetchConcepts
  });

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
      plagiarismTexts,
      regexRules,
      rule,
      ruleName,
      ruleId: null,
      ruleLabelName: null,
      ruleConceptUID,
      ruleNote,
      ruleFeedbacks,
      ruleOptimal,
      rulePrompts,
      rulePromptIds: null,
      rulesCount,
      ruleType,
      setErrors,
      submitRule,
      universalRulesCount,
      ruleHint,
    });
  }

  const formErrorsPresent = !!Object.keys(errors).length;
  const requestErrorsPresent = !!(requestErrors && requestErrors.length);
  const showErrorsContainer = formErrorsPresent || requestErrorsPresent

  return(
    <div className="rule-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="submit">x</button>
      </div>
      <form className="rule-form">
        <RuleGenericAttributes
          concepts={conceptsData ? conceptsData.concepts : []}
          errors={errors}
          isUniversal={isUniversal}
          ruleConceptUID={ruleConceptUID}
          ruleID={id}
          ruleName={ruleName}
          ruleNote={ruleNote}
          ruleOptimal={ruleOptimal}
          ruleType={ruleType}
          ruleTypeDisabled={false}
          ruleUID={uid}
          setRuleConceptUID={setRuleConceptUID}
          setRuleName={setRuleName}
          setRuleNote={setRuleNote}
          setRuleOptimal={setRuleOptimal}
          setRuleType={setRuleType}
        />
        {ruleType && ruleType.value === PLAGIARISM && <RulePlagiarismAttributes
          errors={errors}
          plagiarismFeedbacks={ruleFeedbacks}
          plagiarismTexts={plagiarismTexts}
          setPlagiarismFeedbacks={setRuleFeedbacks}
          setPlagiarismTexts={setPlagiarismTexts}
        />}
        {ruleType && regexRuleTypes.includes(ruleType.value) && <RuleRegexAttributes
          errors={errors}
          regexConditional={conditional}
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
          rulePromptsDisabled={false}
          setRulePrompts={setRulePrompts}
        />}
        {isUniversal && <RuleUniversalAttributes
          errors={errors}
          setUniversalFeedback={setRuleFeedbacks}
          universalFeedback={ruleFeedbacks}
        />}
        <RuleHint
          errors={errors}
          hint={ruleHint}
          setHint={setRuleHint}
        />
        <div className="submit-button-container">
          {showErrorsContainer && renderErrorsContainer(formErrorsPresent, requestErrors)}
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
