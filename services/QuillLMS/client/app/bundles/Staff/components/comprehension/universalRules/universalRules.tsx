import * as React from "react";
import { Link } from 'react-router-dom';
import { queryCache, useQuery } from 'react-query';

import SubmissionModal from '../shared/submissionModal';
import { createRule, fetchUniversalRules } from '../../../utils/comprehension/ruleAPIs';
import RuleForm from '../configureRules/ruleForm';
import { buildErrorMessage } from '../../../helpers/comprehension';
import { blankUniversalRule, universalRuleTypeOptions, ruleOrder} from '../../../../../constants/comprehension';
import { RuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { Error, Spinner, DropdownInput, DataTable, Modal } from '../../../../Shared/index';

const UniversalRulesIndex = ({ history }) => {

  const [ruleType, setRuleType] = React.useState<any>(universalRuleTypeOptions[0]);
  const [rulesHash, setRulesHash] = React.useState<object>({});
  const [rulesList, setRulesList] = React.useState<any[]>([]);
  const [ruleOrderUpdated, setRuleOrderUpdated] = React.useState<boolean>(false);
  const [showAddRuleModal, setShowAddRuleModal] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<object>({});

  // cache ruleSets data for handling universal rule suborder
  const { data: rules } = useQuery("universal-rules", fetchUniversalRules);

  if(rules && rules.universalRules && rules.universalRules.length && !Object.keys(rulesHash).length) {
    setRulesHashAndList();
  }

  React.useEffect(() => {
    handleUpdateRulesList(null);
    setRuleOrderUpdated(false);
  }, [ruleType]);

  function handleUpdateRulesList(rule) {
    const updatedRulesList = rules && rules.universalRules && rules.universalRules.filter(rule => rule.rule_type === ruleType.value);
    if(rule) {
      updatedRulesList.push(rule);
    }
    setRulesList(updatedRulesList);
  }

  function setRulesHashAndList() {
    const hash = {};
    rules.universalRules.map(rule => {
      const { uid } = rule;
      hash[uid] = rule;
    });
    setRulesHash(hash);
    handleUpdateRulesList(null);
  }

  function handleSetRuleType(ruleType: any) { setRuleType(ruleType) };

  function sortCallback(sortInfo) {
    const newRulesList = sortInfo.map(item => {
      const { key } = item;
      return rulesHash[key];
    });
    setRulesList(newRulesList);
    setRuleOrderUpdated(true);
  }

  function renderUniversalRules() {
    const list = rulesList.map(rule => {
      const { rule_type, name, suborder, uid, id } = rule;
      const universalRuleLink = (<Link to={`/universal-rules/${id}`}>View</Link>);
      return {
        id: uid,
        api_order: ruleOrder[rule_type],
        type: rule_type,
        name,
        order: suborder,
        view: universalRuleLink
      }
    });
    return list;
  }

  const submitRule = ({rule}: {rule: RuleInterface}) => {
    createRule(rule).then((response) => {
      const { error, rule } = response;
      if(error) {
        let updatedErrors = errors;
        updatedErrors['ruleSetError'] = error;
        setErrors(updatedErrors);
      }
      queryCache.refetchQueries(`universal-rules`);
      handleUpdateRulesList(rule);

      toggleAddRuleModal();
      toggleSubmissionModal();
    });
  }

  const toggleAddRuleModal = () => {
    setShowAddRuleModal(!showAddRuleModal);
  }

  const toggleSubmissionModal = () => {
    setShowSubmissionModal(!showSubmissionModal);
  }

  const renderRuleForm = () => {
    const blankRule = {...blankUniversalRule}
    return(
      <Modal>
        <RuleForm
          closeModal={toggleAddRuleModal}
          isUniversal={true}
          rule={blankRule}
          submitRule={submitRule}
          universalRuleType={ruleType.label}
        />
      </Modal>
    );
  }

  const renderSubmissionModal = () => {
    let message = 'Rule set successfully created!';
    if(Object.keys(errors).length) {
      message = buildErrorMessage(errors);
    }
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }

  if(!rules || rules && rules.universalRules && rules.universalRules.length && !Object.keys(rulesHash).length) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(rules.error) {
    return(
      <div className="error-container">
        <Error error={`${rules.error}`} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "API Order", attribute:"api_order", width: "100px" },
    { name: "Type", attribute:"type", width: "100px" },
    { name: "Name", attribute:"name", width: "400px" },
    { name: "Rule Order Note", attribute:"order", width: "100px" },
    { name: "", attribute:"view", width: "100px" },
  ];

  const disabledStatus = !ruleOrderUpdated ? 'disabled' : '';

  return(
    <div className="universal-rules-index-container">
      {showAddRuleModal && renderRuleForm()}
      {showSubmissionModal && renderSubmissionModal()}
      <h2>Universal Rules Index</h2>
      <section className="top-section">
        <DropdownInput
          className="rule-type-input"
          handleChange={handleSetRuleType}
          isSearchable={true}
          label="Select Rule Type"
          options={universalRuleTypeOptions}
          value={ruleType}
        />
        <button className={`quill-button small primary contained ${disabledStatus}`} disabled={!!disabledStatus} type="button">Update Rule Order</button>
        <button className="quill-button small primary contained" onClick={toggleAddRuleModal} type="button">{`Create New ${ruleType.label} Rule (Danger Zone!)`}</button>
      </section>
      <p className="sortable-instructions">Change the rule order note by drag and drop</p>
      <DataTable
        className="universal-rules-table"
        defaultSortAttribute="title"
        headers={dataTableFields}
        isReorderable={true}
        reorderCallback={sortCallback}
        rows={renderUniversalRules()}
      />
    </div>
  );
}

export default UniversalRulesIndex
