import * as React from "react";
import { useQuery, useQueryClient, } from 'react-query';
import { Link, withRouter } from 'react-router-dom';

import RuleGenericAttributes from '../configureRules/ruleGenericAttributes';
import RulePlagiarismAttributes from '../configureRules/rulePlagiarismAttributes';
import RuleSemanticAttributes from '../configureRules/ruleSemanticAttributes';
import RuleRegexAttributes from '../configureRules/ruleRegexAttributes';
import RulePrompts from '../configureRules/rulePrompts';
import RuleHintPicker from '../configureRules/ruleHintPicker';
import RuleUniversalAttributes from '../configureRules/ruleUniversalAttributes';
import { Spinner, Modal } from '../../../../Shared/index';
import { deleteRule, fetchRules, fetchUniversalRules } from '../../../utils/evidence/ruleAPIs';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchConcepts, } from '../../../utils/evidence/conceptAPIs';
import { renderErrorsContainer, renderHeader } from '../../../helpers/evidence/renderHelpers';
import { handleSubmitRule, getInitialRuleType, formatInitialFeedbacks, returnInitialFeedback } from '../../../helpers/evidence/ruleHelpers';
import { ruleOptimalOptions, regexRuleTypes, PLAGIARISM } from '../../../../../constants/evidence';
import { RuleInterface, DropdownObjectInterface } from '../../../interfaces/evidenceInterfaces';

interface SemanticLabelFormProps {
  activityData?: any,
  activityId?: string,
  isUniversal?: boolean,
  isSemantic?: boolean,
  requestErrors: string[],
  rule?: RuleInterface,
  submitRule: any,
  prompt?: any,
  history: any,
  location: any,
  match: any,
}

const SemanticLabelForm = ({ activityId, isSemantic, isUniversal, requestErrors, rule, submitRule, location, history, match }: SemanticLabelFormProps) => {
  const { params } = match;
  const { promptId } = params;

  const { name, rule_type, id, uid, optimal, plagiarism_texts, concept_uid, note, feedbacks, state, label, conditional, hint, } = rule;

  const initialRuleType = getInitialRuleType({ isUniversal, rule_type, universalRuleType: null});
  const initialRuleOptimal = optimal ? ruleOptimalOptions[0] : ruleOptimalOptions[1];
  const initialPlagiarismTexts = plagiarism_texts || [{ text: '' }]
  const initialNote = note || '';
  const initialFeedbacks = feedbacks ? formatInitialFeedbacks(feedbacks) : returnInitialFeedback(initialRuleType.value);
  const initialLabel = label && label.name;
  const ruleLabelStatus = state;
  const ruleConditional = conditional;

  const [errors, setErrors] = React.useState<object>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [plagiarismTexts, setPlagiarismTexts] = React.useState<RuleInterface["plagiarism_texts"]>(initialPlagiarismTexts);
  const [regexRules, setRegexRules] = React.useState<object>({});
  const [ruleConceptUID, setRuleConceptUID] = React.useState<string>(concept_uid || '');
  const [ruleNote, setRuleNote] = React.useState<string>(initialNote);
  const [ruleFeedbacks, setRuleFeedbacks] = React.useState<object>(initialFeedbacks);
  const [ruleHint, setRuleHint] = React.useState<object|null>(hint)
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

  const queryClient = useQueryClient()

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

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
    setIsLoading(true);
    handleSubmitRule({
      plagiarismTexts,
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
      ruleConditional,
      setErrors,
      submitRule,
      universalRulesCount,
      ruleHint,
    }).then(() => {
      setIsLoading(false);
    });
  }

  function handleDeleteRule() {
    let ruleId = id.toString();
    if(!ruleId) {
      ruleId = location.state.rule.id;
    }
    deleteRule(ruleId).then((response) => {
      toggleShowDeleteRuleModal();
      // update ruleSets cache to remove delete ruleSet
      queryClient.refetchQueries(`rules-${activityId}`);
      history.push(`/activities/${activityId}/semantic-labels/all`);
    });
  }

  const errorsPresent = !!Object.keys(errors).length;
  const cancelLink = (<Link to={`/activities/${activityId}/semantic-labels`}>Cancel</Link>);
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
  const conjunction = location && location.state && location.state.conjunction || '';
  const header = `Semantic Labels - Add Label (${conjunction})`

  return(
    <div className="rule-form-container">
      {showDeleteRuleModal && renderDeleteRuleModal()}
      {renderHeader(activityData, header)}
      <section className="semantic-rule-form-header">
        <Link className="return-link" to={`/activities/${activityId}/semantic-labels`}>← Return to Semantic Rules Index</Link>
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
          ruleTypeDisabled={true}
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
          plagiarismTexts={plagiarismTexts}
          setPlagiarismFeedbacks={setRuleFeedbacks}
          setPlagiarismTexts={setPlagiarismTexts}
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
          rulePromptsDisabled={false}
          setRulePrompts={setRulePrompts}
        />}
        {(isUniversal || isSemantic) && <RuleUniversalAttributes
          errors={errors}
          setUniversalFeedback={setRuleFeedbacks}
          universalFeedback={ruleFeedbacks}
        />}
        <RuleHintPicker
          hint={ruleHint}
          onHintChange={setRuleHint}
        />
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

export default withRouter<any, any>(SemanticLabelForm);
