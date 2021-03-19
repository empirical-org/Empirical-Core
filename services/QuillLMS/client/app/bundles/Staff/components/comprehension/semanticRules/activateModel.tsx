import * as React from "react";
import { useQuery } from 'react-query';
import { withRouter, Link } from 'react-router-dom';

import { fetchModel, fetchModels } from '../../../utils/comprehension/modelAPIs';
import { fetchRules } from '../../../utils/comprehension/ruleAPIs';
import { DataTable, Spinner } from '../../../../Shared/index';
import { getCheckIcon } from '../../../helpers/comprehension';

const ActivateModel = ({ match }) => {
  const { params } = match;
  const { activityId, modelId, promptId } = params;

  const [existingLabels, setExisitingLabels] = React.useState(null);
  const [activeLabels, setActiveLabels] = React.useState({});

  // cache ruleSets data for handling rule suborder
  const { data: modelData } = useQuery({
    queryKey: [`model-${modelId}`, modelId],
    queryFn: fetchModel
  });

  // cache models data for updates
  const { data: modelsData } = useQuery({
    queryKey: [`models-${promptId}`, promptId, 'active'],
    queryFn: fetchModels
  });

  const { data: rulesData } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}`, activityId, promptId, 'autoML'],
    queryFn: fetchRules
  });

  if(!existingLabels && rulesData && rulesData.rules) {
    const rulesHash = {};
    rulesData.rules.forEach(rule => {
      const { label } = rule;
      const { name } =  label;
      rulesHash[name] = rule;
    });
    setExisitingLabels(rulesHash);
  }

  if(!Object.keys(activeLabels) && modelsData && modelsData.models && modelsData.models[0]) {
    const model = modelsData.models[0];
    const { labels } = model;
    const activeLabelsHash = {};
    labels.forEach(label => {
      activeLabelsHash[label] = true;
    });
    setActiveLabels(activeLabelsHash);
  }

  function handleModelActivation() {

  }

  function modelRows ({ model }) {
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

  function missingLabelsRows ({ model }) {
    if(!model) {
      return [];
    }

    const { labels } = model;
    const missingLabels = labels.filter(label => !existingLabels[label]);

    const fields = missingLabels.map((label, i) => {
      return {
        label: `Missing Label ${i + 1}`,
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

  function labelStatusRows ({ model }) {
    if(!model) {
      return [];
    }

    const { labels } = model;
    return labels.map((label, i) => {
      const labelPresent = !!existingLabels[label];
      const labelActive = !!activeLabels[label];
      const modelStatus = (
        <div className="model-status">
          <p>{labelPresent ? 'Present' : 'Missing'}</p>
          {getCheckIcon(labelPresent)}
        </div>
      );
      const activeStatus = (
        <div className="model-status">
          <p>{labelActive ? 'Active In Model' : 'Inactive In Model'}</p>
          {labelActive ? getCheckIcon(labelActive) : <p>X</p>}
        </div>
      );
      return {
        id: i,
        label_name: label,
        model_status: modelStatus,
        status: activeStatus
      }
    })
  }

  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" },
    { name: "", attribute:"value", width: "400px" }
  ];


  const labelStatusDataTableFields = [
    { name: "Prompt Label", attribute:"label_name", width: "200px" },
    { name: "Model Status", attribute:"model_status", width: "200px" },
    { name: "Active Status", attribute:"status", width: "200px" }
  ];

  if(!modelData && !modelsData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const modelNotReady = modelData && rulesData && existingLabels;
  const showModelActiveTable = modelsData && modelsData[0];
  const showLabelStatusTable = modelData && existingLabels;
  const buttonStyle = modelNotReady ? 'disabled' : '';
  const labelLink = <Link to={`/activities/${activityId}/semantic-rules/${promptId}/new`}>Add Label</Link>;

  return(
    <div className="activate-model-container">
      <Link className="return-link" to={{ pathname: `/activities/${activityId}/semantic-rules`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
      <section className="activate-model-form">
        <section className="activate-model-section">
          <h4>Model Set To Be Active</h4>
          {modelData && <DataTable
            className="model-activate-table"
            headers={dataTableFields}
            rows={modelRows(modelData)}
          />}
        </section>
        <section className="activate-model-section">
          <h4>Current Model Active</h4>
          {showModelActiveTable && <DataTable
            className="model-activate-table"
            headers={dataTableFields}
            rows={modelRows(modelsData[0])}
          />}
          {!showModelActiveTable && <p className="activation-label">There is currently no active model.</p>}
        </section>
        <section className="activate-model-section">
          <section className="missing-labels-header">
            <h4>Missing Labels from Model</h4>
            <button className="quill-button fun primary contained" id="add-rule-button" type="submit">{labelLink}</button>
          </section>
          {modelNotReady && <section>
            <DataTable
              className="missing-labels-table"
              headers={dataTableFields}
              rows={missingLabelsRows(modelData)}
            />
            <p className="activation-label">A model cannot be activated if there are any missing labels/rules. Please create those labels/rules.</p>
          </section>}
          {!modelNotReady && <p className="activation-label">All labels are present; model ready for activation.</p>}
        </section>
        <section className="activate-model-section">
          <h4>Label Changes</h4>
          {showLabelStatusTable && <DataTable
            className="label-status-table"
            headers={labelStatusDataTableFields}
            rows={labelStatusRows(modelData)}
          />}
        </section>
        <button className={`quill-button fun primary contained ${buttonStyle}`} disabled={modelNotReady} onClick={handleModelActivation} type="submit">Activate Model</button>
      </section>
    </div>
  );
}

export default withRouter(ActivateModel)
