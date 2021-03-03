import * as React from "react";
import { queryCache, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import stripHtml from "string-strip-html";

import RuleForm from './ruleForm';

import { buildErrorMessage, getPromptsIcons } from '../../../helpers/comprehension';
import { BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import { updateRule, deleteRule, fetchRule } from '../../../utils/comprehension/ruleAPIs';
import { RuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import SubmissionModal from '../shared/submissionModal';
import { DataTable, Error, Modal, Spinner } from '../../../../Shared/index';

const Rule = ({ history, match }) => {
  const { params } = match;
  const { activityId, ruleId } = params;
  const [showDeleteRuleModal, setShowDeleteRuleModal] = React.useState<boolean>(false);
  const [showEditRuleModal, setShowEditRuleModal] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<object>({});

  // get cached activity data to pass to ruleForm
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache rule data
  const { data: ruleData } = useQuery({
    queryKey: [`rule-${ruleId}`, ruleId],
    queryFn: fetchRule
  });

  const toggleShowEditRuleModal = () => {
    setShowEditRuleModal(!showEditRuleModal);
  }

  const toggleShowDeleteRuleModal = () => {
    setShowDeleteRuleModal(!showDeleteRuleModal);
  }

  const toggleSubmissionModal = () => {
    setShowSubmissionModal(!showSubmissionModal);
  }

  function handleAttributesFields(feedbacks, plagiarism_text) {
    let attributesArray = [];
    if(plagiarism_text && plagiarism_text.text) {
      attributesArray = [{
        label: 'Plagiarism Text',
        value: stripHtml(plagiarism_text.text)
      }];
    }
    const feedbacksArray = feedbacks.map((feedback, i) => {
      const { text } = feedback;
      return {
        label: `Feedback ${i + 1}`,
        value: stripHtml(text)
      }
    });
    return attributesArray.concat(feedbacksArray);
  }

  const ruleRows = ({ rule }) => {
    if(!rule) {
      return [];
    } else {
      // format for DataTable to display labels on left side and values on right
      const { description, feedbacks, name, prompt_ids, rule_type, plagiarism_text } = rule;
      const promptsIcons = getPromptsIcons(activityData, prompt_ids);
      const attributesFields = handleAttributesFields(feedbacks, plagiarism_text);
      const firstFields = [
        {
          label: 'Type',
          value: rule_type
        },
        {
          label: 'Name',
          value: name
        },
        {
          label: 'Description',
          value: description ? stripHtml(description) : ''
        }
      ];
      const lastFields = [
        {
          label: "Because",
          value: promptsIcons ? promptsIcons[BECAUSE] : null
        },
        {
          label: "But",
          value: promptsIcons ? promptsIcons[BUT] : null
        },
        {
          label: "So",
          value: promptsIcons ? promptsIcons[SO] : null
        },
      ];
      const fields = firstFields.concat(attributesFields).concat(lastFields);
      return fields.map((field, i) => {
        const { label, value } = field
        return {
          id: `${label}-${i}`,
          field: label,
          value
        }
      });
    }
  }

  const handleSubmitRule = ({rule}: {rule: RuleInterface}) => {
    updateRule(ruleId, rule).then((response) => {
      const { error } = response;
      if(error) {
        let updatedErrors = errors;
        updatedErrors['update error'] = error;
        setErrors(updatedErrors);
      }
      // update rule cache to display newly updated rule
      queryCache.refetchQueries(`rule-${ruleId}`);
    });

    toggleShowEditRuleModal();
    toggleSubmissionModal();
  }

  const handleDeleteRule = () => {
    deleteRule(ruleId).then((response) => {
      const { error } = response;
      if(error) {
        let updatedErrors = errors;
        updatedErrors['delete error'] = error;
        setErrors(updatedErrors);
      }
      toggleShowDeleteRuleModal();

      if(Object.keys(errors).length) {
        toggleSubmissionModal();
      } else {
        // update ruleSets cache to remove delete ruleSet
        queryCache.refetchQueries(`rules-${activityId}`);
        history.push(`/activities/${activityId}/rules`);
      }
    });
  }

  const renderRuleForm = () => {
    return(
      <Modal>
        <RuleForm
          activityData={activityData && activityData.activity}
          activityId={activityId}
          closeModal={toggleShowEditRuleModal}
          isUniversal={false}
          rule={ruleData && ruleData.rule}
          submitRule={handleSubmitRule}
        />
      </Modal>
    );
  }

  const renderDeleteRuleModal = () => {
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
    )
  }

  const renderSubmissionModal = () => {
    let message = 'Rule successfully updated!';
    if(Object.keys(errors).length) {
      message = buildErrorMessage(errors);
    }
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }

  // The header labels felt redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "180px" },
    { name: "", attribute:"value", width: "600px" }
  ];

  if(!ruleData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(ruleData.error) {
    return(
      <div className="error-container">
        <Error error={`${ruleData.error}`} />
      </div>
    );
  }

  return(
    <div className="rule-container">
      {showDeleteRuleModal && renderDeleteRuleModal()}
      {showEditRuleModal && renderRuleForm()}
      {showSubmissionModal && renderSubmissionModal()}
      <div className="header-container">
        <h2>Rule</h2>
        <Link to={`/activities/${activityId}/rules`}>← Return to Rules Index</Link>
      </div>
      <DataTable
        className="rule-table"
        headers={dataTableFields}
        rows={ruleRows(ruleData)}
      />
      <div className="button-container">
        <button className="quill-button fun primary contained" id="edit-rule-button" onClick={toggleShowEditRuleModal} type="button">
          Configure
        </button>
        <button className="quill-button fun primary contained" id="delete-rule-button" onClick={toggleShowDeleteRuleModal} type="button">
          Delete
        </button>
      </div>
    </div>
  );
}

export default Rule
