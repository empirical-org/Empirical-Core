import * as React from "react";
import { useQuery } from 'react-query';
import { withRouter, Link } from 'react-router-dom';

import { fetchModel, fetchModels } from '../../../utils/comprehension/modelAPIs';
import { DataTable, Spinner } from '../../../../Shared/index';

const ActivateModel = ({ match }) => {
  const { params } = match;
  const { activityId, modelId, promptId } = params;

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

  function modelRows ({ model }) {
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

  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" },
    { name: "", attribute:"value", width: "400px" }
  ];

  if(!modelData && !modelsData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const showTable = !!(modelsData && modelsData.models && modelsData.models.length);

  return(
    <div className="activate-model-container">
      <Link className="return-link" to={{ pathname: `/activities/${activityId}/semantic-rules`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
      <section className="activate-model-form">
        <h4>Model Set To Be Active</h4>
        <DataTable
          className="model-activate-table"
          headers={dataTableFields}
          rows={modelRows(modelData)}
        />
        <h4>Current Model Active</h4>
        {showTable && <DataTable
          className="model-activate-table"
          headers={dataTableFields}
          rows={modelRows(modelsData[0])}
        />}
        {!showTable && <p>There is currently no active model.</p>}
      </section>
    </div>
  );
}

export default withRouter(ActivateModel)
