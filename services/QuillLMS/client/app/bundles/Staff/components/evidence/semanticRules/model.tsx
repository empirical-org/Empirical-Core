import { ContentState, EditorState } from 'draft-js';
import * as React from "react";
import { useQuery, useQueryClient } from 'react-query';
import { Link, useHistory, withRouter } from 'react-router-dom';

import { DataTable, Spinner, TextEditor } from '../../../../Shared/index';
import { fetchModel, updateModel } from '../../../utils/evidence/modelAPIs';

const Model = ({ match }) => {
  const { params } = match;
  const { activityId, modelId } = params;

  const [errors, setErrors] = React.useState<object>({});
  let history = useHistory();

  const queryClient = useQueryClient()

  // cache ruleSets data for handling rule suborder
  const { data: modelData } = useQuery({
    queryKey: [`model-${modelId}`, modelId],
    queryFn: fetchModel
  });

  const initialNoteValue = modelData ? modelData.model.notes : '';
  const [modelNotes, setModelNotes] = React.useState<string>(initialNoteValue);

  function handleSetModelNotes(text: string){ setModelNotes(text) };

  function onHandleUpdateModel() {
    updateModel(modelId, modelNotes).then((response) => {
      const { error } = response;

      if(error) {
        const updatedErrors = {};
        updatedErrors['Model Submission Error'] = error;
        setErrors(updatedErrors);
      } else {
        queryClient.clear();
        history.push(`/activities/${activityId}/semantic-labels/all`);
      }
    });
  }

  function upperSectionRows ({ model }) {
    if(!model) {
      return [];
    }
    // format for DataTable to display labels on left side and values on right
    const { automl_model_id, name, older_models } = model;

    const fields = [
      {
        label: 'Model Name',
        value: name
      },
      {
        label: 'Model ID',
        value: automl_model_id
      },
      {
        label: 'Model Version',
        value: older_models + 1
      }
    ];
    return fields.map((field, i) => {
      const { label, value } = field
      return {
        id: `${field}-${i}`,
        field: label,
        value
      }
    });
  }

  function lowerSectionRows({ model }) {
    if(!model) {
      return [];
    }
    const { labels } = model;
    const fields = labels.map((label: string, i: number) => {
      return {
        label: `Label ${i + 1}`,
        value: label
      }
    });
    return fields.map((field, i) => {
      const { label, value } = field
      return {
        id: `${field}-${i}`,
        field: label,
        value
      }
    });
  }

  const upperDataTableFields = [
    { name: "", attribute:"field", width: "200px" },
    { name: "", attribute:"value", width: "400px" }
  ];
  const lowerDataTableFields = [
    { name: "Descriptive Label", attribute:"field", width: "200px" },
    { name: "AutoML Label", attribute:"value", width: "400px" }
  ];
  const modelNotesStyle = modelNotes && modelNotes.length && modelNotes !== '<br/>' ? 'has-text' : '';
  const errorsPresent = !!Object.keys(errors).length;

  if(!modelData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <div className="model-container">
      <Link className="return-link" to={{ pathname: `/activities/${activityId}/semantic-labels`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
      <section className="model-form">
        <DataTable
          className="model-table"
          headers={upperDataTableFields}
          rows={upperSectionRows(modelData)}
        />
        <p className={`text-editor-label ${modelNotesStyle}`}>Model Notes</p>
        <TextEditor
          ContentState={ContentState}
          disabled={true}
          EditorState={EditorState}
          handleTextChange={handleSetModelNotes}
          key="model-notes"
          shouldCheckSpelling={true}
          text={initialNoteValue}
        />
        <DataTable
          className="model-table"
          headers={lowerDataTableFields}
          rows={lowerSectionRows(modelData)}
        />
      </section>
      <div className="submit-button-container">
        {errorsPresent && <div className="error-message-container">
          <p className="all-errors-message">Failed to update model notes.</p>
        </div>}
        <button className="quill-button fun primary contained" id="rule-submit-button" onClick={onHandleUpdateModel} type="button">
          Submit
        </button>
      </div>
    </div>
  );
}

export default withRouter(Model)
