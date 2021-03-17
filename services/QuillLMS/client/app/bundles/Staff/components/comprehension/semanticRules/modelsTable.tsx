import * as React from "react";
import * as moment from 'moment';
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';

import { fetchModels } from '../../../utils/comprehension/modelAPIs';
import { DataTable, Spinner } from '../../../../Shared/index';

const ModelsTable = ({ activityId, prompt }) => {
  // cache models data for updates
  const { data: modelsData } = useQuery({
    queryKey: [`models-${prompt.id}`, prompt.id],
    queryFn: fetchModels
  });

  const formattedRows = modelsData && modelsData.models && modelsData.models.length && modelsData.models.map(model => {
    const { id, created_at, name, older_models, labels, state } = model;
    const viewLink = (
      <Link to={{ pathname: `/activities/${activityId}/semantic-rules/model/${id}`, state: { model: model }}}>View Model</Link>
    );
    const activateLink = (
      <Link to={{ pathname: `/activities/${activityId}/semantic-rules/model/${id}/activate`, state: { model: model } }}>Activate Settings</Link>
    );
    return {
      id: id,
      created_at: moment(created_at).format('MM/DD/YY'),
      version: older_models + 1,
      name: name,
      labels: `${labels.length} labels`,
      status: state,
      view: viewLink,
      activate: activateLink
    }
  });

  if(!prompt) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Created At", attribute:"created_at", width: "100px" },
    { name: "Version", attribute:"version", width: "70px" },
    { name: "Model Name", attribute:"name", width: "300px" },
    // { name: "Model Notes", attribute:"", width: "200px" },
    { name: "Labels", attribute:"labels", width: "70px" },
    { name: "Status", attribute:"status", width: "70px" },
    { name: "", attribute:"view", width: "100px" },
    { name: "", attribute:"activate", width: "150px" }
  ];

  const addModelLink = (
    <Link to={{ pathname: `/activities/${activityId}/semantic-rules/add-model`, state: { promptId: prompt.id }}}>Add Model</Link>
  );

  return(
    <section className="semantic-rules-container">
      <section className="header-container">
        <section className="lower-header-container">
          <h5>Prompt Models</h5>
          <button className="quill-button fun primary contained" id="add-model-button" type="submit">{addModelLink}</button>
        </section>
      </section>
      <DataTable
        className="rules-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
    </section>
  );
}

export default ModelsTable
