import * as React from "react";
import { withRouter, Link } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js';

import { DataTable, Spinner, TextEditor } from '../../../../Shared/index';

const Model = ({ location, match }) => {

  if(!location.state) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }
  const { state } = location;
  const { params } = match;
  const { activityId } = params;

  const [modelNotes, setModelNotes] = React.useState<string>(state && state.model ? state.model.notes : '');
  const [errors, setErrors] = React.useState<object>({});

  function handleSetModelNotes(text: string){ setModelNotes(text) };

  function onHandleUpdateModel() {

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

  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" },
    { name: "", attribute:"value", width: "400px" }
  ];
  const modelNotesStyle = modelNotes && modelNotes.length && modelNotes !== '<br/>' ? 'has-text' : '';
  const errorsPresent = !!Object.keys(errors).length;

  return(
    <div className="model-container">
      <Link className="return-link" to={{ pathname: `/activities/${activityId}/semantic-rules`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
      <section className="model-form">
        <DataTable
          className="model-table"
          headers={dataTableFields}
          rows={upperSectionRows(state)}
        />
        <p className={`text-editor-label ${modelNotesStyle}`}>Model Notes</p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetModelNotes}
          key="model-notes"
          text={modelNotes}
        />
        <DataTable
          className="model-table"
          headers={dataTableFields}
          rows={lowerSectionRows(state)}
        />
      </section>
      <div className="submit-button-container">
        {errorsPresent && <div className="error-message-container">
          <p className="all-errors-message">Failed to updated model notes.</p>
        </div>}
        <button className="quill-button fun primary contained" id="rule-submit-button" onClick={onHandleUpdateModel} type="button">
          Submit
        </button>
      </div>
    </div>
  );
}

export default withRouter(Model)
