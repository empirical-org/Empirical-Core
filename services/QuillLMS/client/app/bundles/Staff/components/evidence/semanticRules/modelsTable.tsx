import * as React from "react";
import * as moment from 'moment';
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';
import { firstBy } from 'thenby';

import { titleCase } from '../../../helpers/evidence/miscHelpers';
import { fetchModels } from '../../../utils/evidence/modelAPIs';
import { DataTable, Spinner } from '../../../../Shared/index';

const renderUnsafeHtml = (html) => {
  return(
    <p className="word-wrap" dangerouslySetInnerHTML={{__html: html}} />
  )
}

const ModelsTable = ({ activityId, prompt }) => {
  // cache models data for updates
  const { data: modelsData } = useQuery({
    queryKey: [`models-${prompt.id}`, prompt.id],
    queryFn: fetchModels
  });

  function getFormattedRows() {
    if(modelsData && modelsData.models && modelsData.models.length) {
      const formattedRows = modelsData.models.map(model => {
        const { id, created_at, name, older_models, labels, state } = model;
        const viewLink = (
          <Link className="data-link" to={`/activities/${activityId}/semantic-labels/model/${id}`}>View</Link>
        );
        const activateLink = (
          <Link className="data-link" to={`/activities/${activityId}/semantic-labels/${prompt.id}/model/${id}/activate`}>Activate</Link>
        );

        return {
          id: id,
          created_at: moment(created_at).format('MM/DD/YY'),
          version: older_models + 1,
          name,
          notes: renderUnsafeHtml(model.notes),
          label_count: `${labels.length} labels`,
          status: state,
          view: viewLink,
          activate: activateLink,
          className: state === 'active' ? 'active-row' : ''
        }
      });
      return formattedRows.sort(firstBy('created_at'));
    }
    return [];
  }

  if(!prompt) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Created At", attribute:"created_at", width: "100px", noTooltip: true },
    { name: "Version", attribute:"version", width: "50px", noTooltip: true },
    { name: "Model Name", attribute:"name", width: "150px" },
    { name: "Model Notes", attribute:"notes", width: "350px" },
    { name: "Label Count", attribute:"label_count", width: "70px", noTooltip: true },
    { name: "Status", attribute:"status", width: "70px", noTooltip: true },
    { name: "", attribute:"view", width: "50px", noTooltip: true },
    { name: "", attribute:"activate", width: "70px", noTooltip: true }
  ];

  const addModelLink = <Link className="quill-button fun primary contained" to={{ pathname: `/activities/${activityId}/semantic-labels/${prompt.id}/add-model`, state: { conjunction: prompt.conjunction }}}>Add Model</Link>;

  return(
    <section className="models-container">
      <section className="header-container">
        <h2>{`${titleCase(prompt.conjunction)} Model (Prompt ID: ${prompt.id})`}</h2>
      </section>
      <DataTable
        className="models-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={getFormattedRows()}
      />
      {addModelLink}
    </section>
  );
}

export default ModelsTable
