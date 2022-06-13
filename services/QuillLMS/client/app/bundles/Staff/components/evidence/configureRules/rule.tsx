import * as React from "react";
import { useQueryClient, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import stripHtml from "string-strip-html";

import RuleForm from './ruleForm';

import { renderHeader } from '../../../helpers/evidence/renderHelpers';
import { getPromptsIcons } from '../../../helpers/evidence/promptHelpers';
import { BECAUSE, BUT, SO } from '../../../../../constants/evidence';
import { updateRule, deleteRule, fetchRule } from '../../../utils/evidence/ruleAPIs';
import { RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { DataTable, Error, Modal, Spinner } from '../../../../Shared/index';

const Rule = ({ history, match }) => {
  const { params } = match;
  const { activityId, ruleId } = params;
  const [showDeleteRuleModal, setShowDeleteRuleModal] = React.useState<boolean>(false);
  const [showEditRuleModal, setShowEditRuleModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const queryClient = useQueryClient()

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

  function handleAttributesFields(feedbacks, plagiarism_texts) {
    let attributesArray = [];
    if (plagiarism_texts && plagiarism_texts[0]) {
      attributesArray = plagiarism_texts.map((plagiarism_text, i) => {
        const { text } = plagiarism_text;
        return {
          label: `Plagiarism Text - Text String ${i + 1}`,
          value: stripHtml(text)
        }
      });
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
      const { note, feedbacks, name, prompt_ids, rule_type, plagiarism_texts } = rule;
      const promptsIcons = getPromptsIcons(activityData, prompt_ids);
      const attributesFields = handleAttributesFields(feedbacks, plagiarism_texts);
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
          label: 'Rule Note',
          value: note ? <div dangerouslySetInnerHTML={{ __html: note }} /> : ''
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
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        // update rule cache to display newly updated rule
        queryClient.refetchQueries(`rule-${ruleId}`);
        toggleShowEditRuleModal();
      }
    });
  }

  const handleDeleteRule = () => {
    deleteRule(ruleId).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        // update ruleSets cache to remove delete ruleSet
        queryClient.refetchQueries(`rules-${activityId}`);
        history.push(`/activities/${activityId}/rules`);
        toggleShowDeleteRuleModal();
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
          requestErrors={errors}
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
  const validRule = ruleData && ruleData.rule;

  return(
    <div className="rule-container">
      {showDeleteRuleModal && renderDeleteRuleModal()}
      {showEditRuleModal && renderRuleForm()}
      {renderHeader(activityData, 'View All Rules - View Individual Rule')}
      <Link className="data-link" to={`/activities/${activityId}/rules-index`}>← Return to Rules Index</Link>
      {validRule &&
      <React.Fragment>
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
      </React.Fragment>}
      {!validRule && <p className="invalid-rule-text">{`Rule with id ${ruleId} does not exist.`}</p>}
    </div>
  );
}

export default Rule
