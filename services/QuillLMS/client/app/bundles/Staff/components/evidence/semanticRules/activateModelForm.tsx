import * as React from "react";
import { useQuery } from 'react-query';
import { Link, withRouter } from 'react-router-dom';

import { DataTable, Spinner } from '../../../../Shared/index';
import { getCheckIcon } from '../../../helpers/evidence/renderHelpers';
import { activateModel, fetchModel, fetchModels } from '../../../utils/evidence/modelAPIs';
import { fetchRules } from '../../../utils/evidence/ruleAPIs';

const ActivateModelForm = ({ match }) => {
  const { params } = match;
  const { activityId, modelId, promptId } = params;

  const [activeLabels, setActiveLabels] = React.useState(null);
  const [activeModel, setActiveModel] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [labelsChecked, setLabelsChecked] = React.useState(false);
  const [existingLabels, setExistingLabels] = React.useState(null);
  const [modelReady, setModelReady] = React.useState(false);
  const [modelToActivate, setModelToActivate] = React.useState(null);

  // cache model data for updates
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
    queryKey: [`rules-${activityId}`, null, promptId, 'autoML'],
    queryFn: fetchRules
  });

  if(!modelToActivate && modelData && modelData.model) {
    setModelToActivate(modelData.model);
  }

  if(!activeModel && modelsData && modelsData.models && modelsData.models[0]) {
    setActiveModel(modelsData.models[0]);
  }


  if(!existingLabels && rulesData && rulesData.rules) {
    const rulesHash = {};
    rulesData.rules.forEach(rule => {
      const { label } = rule;
      const { name } =  label;
      rulesHash[name] = rule;
    });
    setExistingLabels(rulesHash);
  }

  if(!labelsChecked && existingLabels && modelToActivate) {
    const { model } = modelData;
    const { labels } = model;
    const labelPresent = (label) => existingLabels[label];
    const modelIsReady = labels.every(labelPresent);
    setModelReady(modelIsReady);
    setLabelsChecked(true);
  }

  if(!activeLabels && activeModel) {;
    updateActiveLabels(activeModel);
  }

  function handleModelActivation() {
    setIsLoading(true);
    activateModel(modelId).then((response) => {
      const { error } = response;
      if(error) {
        setError(error);
        setIsLoading(false);
      } else {
        setActiveModel(modelToActivate);
        updateActiveLabels(modelToActivate);
        setIsLoading(false);
      }
    })
  }

  function updateActiveLabels(model) {
    const { labels } = model;
    const activeLabelsHash = {};
    labels.forEach(label => {
      activeLabelsHash[label] = true;
    });
    setActiveLabels(activeLabelsHash);
  }

  function modelRows (model) {
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

  function missingLabelsRows (model) {
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

  function labelStatusRows (model) {
    if(!model) {
      return [];
    }

    const { labels } = model;
    return labels.map((label, i) => {
      const labelPresent = existingLabels ? !!existingLabels[label] : false;
      const labelActive = activeLabels ? !!activeLabels[label] : false;
      const modelStatus = (
        <div className="model-status">
          <p>{labelPresent ? 'Present' : 'Missing'}</p>
          {getCheckIcon(labelPresent)}
        </div>
      );
      const activeStatus = (
        <div className="model-status">
          <p>{labelActive ? 'Active In Model' : 'Inactive In Model'}</p>
          {getCheckIcon(labelActive)}
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
    { name: "AutoML Label", attribute:"label_name", width: "200px" },
    { name: "Present in internal tool?", attribute:"model_status", width: "200px" },
    { name: "Active in AutoML model?", attribute:"status", width: "200px" }
  ];

  if((!modelData && !modelsData) || isLoading) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const showLabelStatusTable = modelData && existingLabels;
  const showMissingLabelsTable = !modelReady && modelData && existingLabels;
  const activeModelisModelToActivate = activeModel && modelToActivate && activeModel.id === modelToActivate.id;
  const buttonDisabled = !modelReady || activeModelisModelToActivate
  const buttonStyle = buttonDisabled ? 'disabled' : '';
  const labelLink = <Link to={`/activities/${activityId}/semantic-labels/${promptId}/new`}>Add Label</Link>;

  return(
    <div className="activate-model-container">
      <Link className="return-link" to={{ pathname: `/activities/${activityId}/semantic-labels`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
      <section className="activate-model-form">
        <section className="activate-model-section">
          <h4>New Model</h4>
          {modelToActivate && <DataTable
            className="model-activate-table"
            headers={dataTableFields}
            rows={modelRows(modelToActivate)}
          />}
        </section>
        <section className="activate-model-section">
          <h4>Current Active Model</h4>
          {activeModel && <DataTable
            className="model-activate-table"
            headers={dataTableFields}
            rows={modelRows(activeModel)}
          />}
          {!activeModel && <p className="activation-label">There is currently no active model.</p>}
        </section>
        <section className="activate-model-section">
          <section className="missing-labels-header">
            <h4>Missing Labels</h4>
            <button className="quill-button fun primary contained" id="add-rule-button" type="submit">{labelLink}</button>
          </section>
          {showMissingLabelsTable && <section>
            <DataTable
              className="missing-labels-table"
              headers={dataTableFields}
              rows={missingLabelsRows(modelToActivate)}
            />
            <p className="activation-label">A model cannot be activated if there are any missing labels/rules. Please create those labels/rules.</p>
          </section>}
          {modelReady && !activeModelisModelToActivate && <p className="activation-label">All labels are present; model ready for activation.</p>}
          {activeModelisModelToActivate && <p className="activation-label">Model is already active.</p>}
        </section>
        <section className="activate-model-section">
          <h4>Label Status</h4>
          {showLabelStatusTable && <DataTable
            className="label-status-table"
            headers={labelStatusDataTableFields}
            rows={labelStatusRows(modelToActivate)}
          />}
        </section>
        {error && <div className="error-message-container">
          <p className="all-errors-message">{error}</p>
        </div>}
        <button className={`quill-button fun primary contained ${buttonStyle}`} disabled={!modelReady} onClick={handleModelActivation} type="submit">Activate Model</button>
      </section>
    </div>
  );
}

export default withRouter(ActivateModelForm)
