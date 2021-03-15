import * as React from "react";
import { Link } from 'react-router-dom'

import { DataTable, Spinner } from '../../../../Shared/index';

const ModelsTable = ({ activityId, prompt }) => {
  const formattedRows = [];

  if(!prompt) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Created At", attribute:"", width: "100px" },
    { name: "Version", attribute:"", width: "70px" },
    { name: "Model Name", attribute:"", width: "100px" },
    { name: "Model Notes", attribute:"", width: "200px" },
    { name: "Labels", attribute:"", width: "70px" },
    { name: "Status", attribute:"", width: "70px" },
    { name: "View", attribute:"", width: "100px" },
    { name: "Activate", attribute:"", width: "100px" }
  ];

  const addModelLink = <Link to={`/activities/${activityId}/semantic-rules/add-model`}>Add Model</Link>

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
