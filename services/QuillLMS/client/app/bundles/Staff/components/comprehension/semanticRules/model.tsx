import * as React from "react";
import { useQuery } from 'react-query';
import { withRouter, Link } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js';

import { fetchModel } from '../../../utils/comprehension/modelAPIs';
import { DataTable, Spinner, TextEditor } from '../../../../Shared/index';

const Model = ({ location, match }) => {
  const { params } = match;
  const { activityId, modelId } = params;

  // const [modelNotes, setModelNotes] = React.useState<string>('');
  const [errors, setErrors] = React.useState<object>({});

  // cache ruleSets data for handling rule suborder
  const { data: modelData } = useQuery({
    queryKey: [`model-${modelId}`, modelId],
    queryFn: fetchModel
  });

  // function handleSetModelNotes(text: string){ setModelNotes(text) };

  // function onHandleUpdateModel() {

  // }

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
  // const modelNotesStyle = modelNotes && modelNotes.length && modelNotes !== '<br/>' ? 'has-text' : '';
  // const errorsPresent = !!Object.keys(errors).length;

  if(!modelData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <div className="model-container">
      <Link className="return-link" to={{ pathname: `/activities/${activityId}/semantic-rules`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
      <section className="model-form">
        <DataTable
          className="model-table"
          headers={dataTableFields}
          rows={upperSectionRows(modelData)}
        />
        {/* <p className={`text-editor-label ${modelNotesStyle}`}>Model Notes</p>
        <TextEditor
          disabled={true}
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetModelNotes}
          key="model-notes"
          text={modelNotes}
        /> */}
        <DataTable
          className="model-table"
          headers={dataTableFields}
          rows={lowerSectionRows(modelData)}
        />
      </section>
      {/* <div className="submit-button-container">
        {errorsPresent && <div className="error-message-container">
          <p className="all-errors-message">Failed to updated model notes.</p>
        </div>}
        <button className="quill-button fun primary contained" id="rule-submit-button" onClick={onHandleUpdateModel} type="button">
          Submit
        </button>
      </div> */}
    </div>
  );
}

export default withRouter(Model)
