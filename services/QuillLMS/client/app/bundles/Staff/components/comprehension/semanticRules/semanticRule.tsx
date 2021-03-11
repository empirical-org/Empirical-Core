import * as React from "react";
import { useQuery, queryCache } from 'react-query';
import { Link, withRouter } from 'react-router-dom';

import RuleGenericAttributes from '../configureRules/ruleGenericAttributes';
import RulePlagiarismAttributes from '../configureRules/rulePlagiarismAttributes';
import RuleSemanticAttributes from '../configureRules/ruleSemanticAttributes';
import RuleRegexAttributes from '../configureRules/ruleRegexAttributes';
import RulePrompts from '../configureRules/rulePrompts';
import RuleUniversalAttributes from '../configureRules/ruleUniversalAttributes';
import { Spinner, Modal } from '../../../../Shared/index';
import { deleteRule, fetchRules, fetchUniversalRules } from '../../../utils/comprehension/ruleAPIs';
import { formatPrompts } from '../../../helpers/comprehension';
import { handleSubmitRule, getInitialRuleType, formatInitialFeedbacks, returnInitialFeedback, formatRegexRules } from '../../../helpers/comprehension/ruleHelpers';
import { ruleOptimalOptions, regexRuleTypes } from '../../../../../constants/comprehension';
import { RuleInterface, DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';

interface SemanticRuleFormProps {
  activityData?: any,
  activityId?: string,
  errors: any,
  handleSetErrors: any,
  isUniversal?: boolean,
  isSemantic?: boolean,
  rule?: RuleInterface,
  submitRule: any,
  prompt?: any,
  history: any,
  location: any
}

const SemanticRuleForm = ({ activityData, activityId, errors, handleSetErrors, isSemantic, isUniversal, rule, submitRule, location, history }: SemanticRuleFormProps) => {

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
  const [showDeleteRuleModal, setShowDeleteRuleModal] = React.useState<boolean>(false);
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
    if(Object.keys(errors).length) {
      handleSetErrors({});
    }
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

  function toggleShowDeleteRuleModal() {
    setShowDeleteRuleModal(!showDeleteRuleModal);
  }

  function renderDeleteRuleModal() {
    return(
      <Modal>
        <div className="delete-rule-container">
          <p className="delete-rule-text">Are you sure that you want to delete this rule?</p>
          <div className="delete-rule-button-container">
            <button className="quill-button fun primary contained" id="delete-rule-button" onClick={handleDeleteRule} type="button">
              Delete
            </button>
            <button className="quill-button fun primary contained" id="close-rule-modal-button" onClick={toggleShowDeleteRuleModal} type="button">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  function onHandleSubmitRule() {
    handleSubmitRule({
      plagiarismText,
      regexRules,
      rule: ruleForForm,
      ruleId: location.state && location.state.rule ? location.state.rule.id : null,
      ruleName,
      ruleLabelName,
      ruleConceptUID,
      ruleDescription,
      ruleFeedbacks,
      ruleOptimal,
      rulePrompts,
      rulePromptIds: location.state && location.state.promptId ? location.state.promptId : null,
      rulesCount,
      ruleType,
      setErrors: handleSetErrors,
      submitRule,
      universalRulesCount
    });
  }

  function handleDeleteRule() {
    let ruleId = ruleForForm.id;
    if(!ruleId) {
      ruleId = location.state.rule.id;
    }
    deleteRule(ruleId).then((response) => {
      // const { error } = response;
      // if(error) {
      //   let updatedErrors = errors;
      //   updatedErrors['delete error'] = error;
      //   setErrors(updatedErrors);
      // }
      toggleShowDeleteRuleModal();
      // update ruleSets cache to remove delete ruleSet
      queryCache.refetchQueries(`rules-${activityId}`);
      history.push(`/activities/${activityId}/semantic-rules/all`);

      // if(Object.keys(errors).length) {
      //   toggleSubmissionModal();
      // } else {
      //   // update ruleSets cache to remove delete ruleSet
      //   queryCache.refetchQueries(`rules-${activityId}`);
      //   history.push(`/activities/${activityId}/rules`);
      // }
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
      {showDeleteRuleModal && renderDeleteRuleModal()}
      <section className="semantic-rule-form-header">
        <Link to={`/activities/${activityId}/semantic-rules`}>← Return to Semantic Rules Index</Link>
        <button className="quill-button fun primary contained" id="rule-delete-button" onClick={toggleShowDeleteRuleModal} type="button">
          Delete
        </button>
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
          ruleUID={ruleForForm && ruleForForm.uid}
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
