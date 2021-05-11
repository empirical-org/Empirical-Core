import * as React from "react";
import { useQuery, queryCache } from 'react-query';
import { Link, withRouter } from 'react-router-dom';

import RuleGenericAttributes from '../configureRules/ruleGenericAttributes';
import RulePlagiarismAttributes from '../configureRules/rulePlagiarismAttributes';
import RuleSemanticAttributes from '../configureRules/ruleSemanticAttributes';
import RuleRegexAttributes from '../configureRules/ruleRegexAttributes';
import RulePrompts from '../configureRules/rulePrompts';
import RuleUniversalAttributes from '../configureRules/ruleUniversalAttributes';
import { Spinner } from '../../../../Shared/index';
import { deleteRule, fetchRules, fetchUniversalRules } from '../../../utils/comprehension/ruleAPIs';
import { fetchConcepts, } from '../../../utils/comprehension/conceptAPIs';
import { formatPrompts } from '../../../helpers/comprehension';
import { handleSubmitRule, getInitialRuleType, formatInitialFeedbacks, returnInitialFeedback, renderErrorsContainer, formatRegexRules, getReturnLinkRuleType, getReturnLinkLabel, renderDeleteRuleModal } from '../../../helpers/comprehension/ruleHelpers';
import { ruleOptimalOptions, regexRuleTypes, PLAGIARISM } from '../../../../../constants/comprehension';
import { RuleInterface, DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';

interface RuleViewFormProps {
  activityData?: any,
  activityId?: string,
  isUniversal?: boolean,
  isSemantic?: boolean,
  requestErrors: string[],
  rule?: RuleInterface,
  rulePromptsDisabled: boolean,
  ruleTypeDisabled: boolean,
  submitRule: any,
  prompt?: any,
  history: any,
  location: any,
  match: any,
}

const RuleViewForm = ({
  activityData,
  activityId,
  isSemantic,
  isUniversal,
  requestErrors,
  rule,
  rulePromptsDisabled,
  ruleTypeDisabled,
  submitRule,
  location,
  history,
  match
}: RuleViewFormProps) => {
  const { params } = match;
  const { promptId } = params;

  const { name, rule_type, id, uid, optimal, plagiarism_text, concept_uid, note, feedbacks, state, label } = rule;

  const initialRuleType = getInitialRuleType({ isUniversal, rule_type, universalRuleType: null});
  const initialRuleOptimal = optimal ? ruleOptimalOptions[0] : ruleOptimalOptions[1];
  const initialPlagiarismText = plagiarism_text || { text: '' }
  const initalNote = note || '';
  const initialFeedbacks = feedbacks ? formatInitialFeedbacks(feedbacks) : returnInitialFeedback(initialRuleType.value);
  const initialLabel = label && label.name;
  const ruleLabelStatus = state;

  const [errors, setErrors] = React.useState<object>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [plagiarismText, setPlagiarismText] = React.useState<RuleInterface["plagiarism_text"]>(initialPlagiarismText);
  const [regexRules, setRegexRules] = React.useState<object>({});
  const [ruleConceptUID, setRuleConceptUID] = React.useState<string>(concept_uid || '');
  const [ruleNote, setRuleNote] = React.useState<string>(initalNote);
  const [ruleFeedbacks, setRuleFeedbacks] = React.useState<object>(initialFeedbacks);
  const [ruleOptimal, setRuleOptimal] = React.useState<any>(initialRuleOptimal);
  const [ruleName, setRuleName] = React.useState<string>(name || '');
  const [ruleLabelName, setRuleLabelName] = React.useState<string>(initialLabel);
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

  function toggleShowDeleteRuleModal() {
    setShowDeleteRuleModal(!showDeleteRuleModal);
  }

  function onHandleSubmitRule() {
    setIsLoading(true);
    handleSubmitRule({
      plagiarismText,
      regexRules,
      rule,
      ruleId: id,
      ruleName,
      ruleLabelName,
      ruleConceptUID,
      ruleNote,
      ruleFeedbacks,
      ruleOptimal,
      rulePrompts,
      rulePromptIds: [promptId],
      rulesCount,
      ruleType,
      setErrors,
      submitRule,
      universalRulesCount
    }).then(() => {
      setIsLoading(false);
    });
  }

  const returnLinkRuleType = getReturnLinkRuleType(ruleType);
  const returnLinkLabel = getReturnLinkLabel(ruleType);

  function handleDeleteRule() {
    let ruleId = id.toString();
    if(!ruleId) {
      ruleId = location.state.rule.id;
    }
    deleteRule(ruleId).then((response) => {
      toggleShowDeleteRuleModal();
      // update ruleSets cache to remove delete ruleSet
      queryCache.refetchQueries(`rules-${activityId}`);
      history.push(`/activities/${activityId}/${returnLinkRuleType}`);
    });
  }

  const cancelLink = (<Link to={`/activities/${activityId}/${returnLinkRuleType}`}>Cancel</Link>);
  const autoMLParams = {
    label: 'Descriptive Label',
    notes: 'Label Notes',
    layerFeedback: 'First Layer Feedback'
  }

  if(isLoading) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const formErrorsPresent = !!Object.keys(errors).length;
  const requestErrorsPresent = !!(requestErrors && requestErrors.length);
  const showErrorsContainer = formErrorsPresent || requestErrorsPresent;

  return(
    <div className="rule-form-container">
      {showDeleteRuleModal && renderDeleteRuleModal(handleDeleteRule, toggleShowDeleteRuleModal)}
      <section className="semantic-rule-form-header">
        <Link className="return-link" to={`/activities/${activityId}/${returnLinkRuleType}`}>{returnLinkLabel}</Link>
        <button className="quill-button fun primary contained" id="rule-delete-button" onClick={toggleShowDeleteRuleModal} type="button">
          Delete
        </button>
      </section>
      <form className="semantic-rule-form">
        <RuleGenericAttributes
          autoMLParams={autoMLParams}
          concepts={conceptsData ? conceptsData.concepts : []}
          errors={errors}
          isAutoML={true}
          isUniversal={isUniversal}
          ruleConceptUID={ruleConceptUID}
          ruleID={id}
          ruleName={ruleName}
          ruleNote={ruleNote}
          ruleOptimal={ruleOptimal}
          ruleType={ruleType}
          ruleTypeDisabled={ruleTypeDisabled}
          ruleUID={uid}
          setRuleConceptUID={setRuleConceptUID}
          setRuleName={setRuleName}
          setRuleNote={setRuleNote}
          setRuleOptimal={setRuleOptimal}
          setRuleType={setRuleType}
        />
        {isSemantic && <RuleSemanticAttributes
          errors={errors}
          ruleLabelName={ruleLabelName}
          ruleLabelNameDisabled={!!(label && label.name)}
          ruleLabelStatus={ruleLabelStatus}
          setRuleLabelName={setRuleLabelName}
        />}
        {ruleType && ruleType.value === PLAGIARISM && <RulePlagiarismAttributes
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
          rulePromptsDisabled={rulePromptsDisabled}
          setRulePrompts={setRulePrompts}
        />}
        {(isUniversal || isSemantic) && <RuleUniversalAttributes
          errors={errors}
          setUniversalFeedback={setRuleFeedbacks}
          universalFeedback={ruleFeedbacks}
        />}
        <div className="submit-button-container">
          {showErrorsContainer && renderErrorsContainer(formErrorsPresent, requestErrors)}
          <button className="quill-button fun primary contained" id="rule-submit-button" onClick={onHandleSubmitRule} type="button">
            Submit
          </button>
          <button className="quill-button fun primary contained" id="rule-cancel-button" type="submit">{cancelLink}</button>
        </div>
      </form>
    </div>
  )
}

export default withRouter<any, any>(RuleViewForm);
