import * as React from "react";
import { Link } from 'react-router-dom';
import { useQueryClient, useQuery } from 'react-query';

import Navigation from '../navigation'
import { createRule, fetchUniversalRules } from '../../../utils/evidence/ruleAPIs';
import RuleForm from '../configureRules/ruleForm';
import { blankUniversalRule, universalRuleTypeOptions, ruleOrder} from '../../../../../constants/evidence';
import { RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { Error, Spinner, DropdownInput, DataTable, Modal } from '../../../../Shared/index';
import populateRulesState from '../../../../Shared/hooks/evidence/populateRulesState'
import handleRulesListUpdate from '../../../../Shared/hooks/evidence/handleRulesListUpdate'

const UniversalRulesIndex = ({ location, match }) => {

  const [ruleType, setRuleType] = React.useState<any>(universalRuleTypeOptions[0]);
  const [rulesHash, setRulesHash] = React.useState<object>({});
  const [rulesList, setRulesList] = React.useState<any[]>([]);
  const [ruleOrderUpdated, setRuleOrderUpdated] = React.useState<boolean>(false);
  const [rulesUpdated, setRulesUpdated] = React.useState<boolean>(false);
  const [showAddRuleModal, setShowAddRuleModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const queryClient = useQueryClient()

  // cache ruleSets data for handling universal rule suborder
  const { data: rules } = useQuery("universal-rules", fetchUniversalRules);

  populateRulesState({ rules, rulesHash, rulesList, setRulesHashAndList });

  handleRulesListUpdate({ location, rulesUpdated, handleUpdateRulesList });

  React.useEffect(() => {
    handleUpdateRulesList();
    setRuleOrderUpdated(false);
  }, [ruleType]);

  function handleUpdateRulesList(rule=null) {
    if(rules && rules.universalRules && rules.universalRules.length) {
      const updatedRulesList = rules.universalRules.filter(rule => rule.rule_type === ruleType.value);
      if(rule) {
        updatedRulesList.push(rule);
      }
      setRulesUpdated(true);
      setRulesList(updatedRulesList);
    }
  }

  function setRulesHashAndList() {
    const hash = {};
    rules.universalRules.map(rule => {
      const { uid } = rule;
      hash[uid] = rule;
    });
    setRulesHash(hash);
    handleUpdateRulesList();
  }

  function handleSetRuleType(ruleType: any) { setRuleType(ruleType) };

  function sortCallback(sortInfo) {
    console.log("🚀 ~ file: universalRules.tsx ~ line 62 ~ sortCallback ~ sortInfo", sortInfo)
    const newRulesList = sortInfo.map(item => {
      const { key } = item;
      return rulesHash[key];
    });
    console.log("🚀 ~ file: universalRules.tsx ~ line 67 ~ sortCallback ~ newRulesList", newRulesList)
    setRulesList(newRulesList);
    setRuleOrderUpdated(true);
  }

  function renderUniversalRules() {
    const list = rulesList && rulesList.length && rulesList.map(rule => {
      const { rule_type, name, suborder, uid, id } = rule;
      const universalRuleLink = (<Link to={`/universal-rules/${id}`}>View</Link>);
      return {
        id: uid,
        type: rule_type,
        name,
        order: suborder,
        view: universalRuleLink
      }
    });
    return list || [];
  }

  const submitRule = ({rule}: {rule: RuleInterface}) => {
    createRule(rule).then((response) => {
      const { errors, rule } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        toggleAddRuleModal();
        queryClient.refetchQueries(`universal-rules`).then(() => {
          handleUpdateRulesList(rule);
        });
      }
    });
  }

  const toggleAddRuleModal = () => {
    setShowAddRuleModal(!showAddRuleModal);
  }

  const renderRuleForm = () => {
    const blankRule = {...blankUniversalRule}
    return(
      <Modal>
        <RuleForm
          closeModal={toggleAddRuleModal}
          isUniversal={true}
          requestErrors={errors}
          rule={blankRule}
          submitRule={submitRule}
          universalRuleType={ruleType.value}
        />
      </Modal>
    );
  }

  const rulesNotReadyForRender = rules && rules.universalRules && rules.universalRules.length && !Object.keys(rulesHash).length && rulesList && !rulesList.length;

  if(!rules || rulesNotReadyForRender) {
    return(
      <React.Fragment>
        <Navigation location={location} match={match} />
        <div className="loading-spinner-container">
          <Spinner />
        </div>
      </React.Fragment>
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
    { name: "Type", attribute:"type", width: "100px" },
    { name: "Name", attribute:"name", width: "400px" },
    { name: "Rule Order Note", attribute:"order", width: "100px" },
    { name: "", attribute:"view", width: "100px" },
  ];

  const disabledStatus = !ruleOrderUpdated ? 'disabled' : '';

  return(
    <React.Fragment>
      <Navigation location={location} match={match} />
      <div className="universal-rules-index-container">
        {showAddRuleModal && renderRuleForm()}
        <section className="header-section">
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
    </React.Fragment>
  );
}

export default UniversalRulesIndex
