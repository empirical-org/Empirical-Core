import * as React from "react";
import { Link } from 'react-router-dom'

import { DataTable, Spinner } from '../../../../Shared/index';

const LabelsTable = ({ prompt }) => {
  const formattedRows = [];

  if(!prompt) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Rule ID", attribute:"type", width: "70px" },
    { name: "Rule Name", attribute:"name", width: "200px" },
    { name: "Label Name", attribute:"because_prompt", width: "150px" },
    { name: "Rule/Label Active?", attribute:"but_prompt", width: "150px" },
    { name: "Optimal?", attribute:"so_prompt", width: "70px" },
    { name: "Edit", attribute:"universal", width: "70px" }
  ];

  return(
    <section className="semantic-rules-container">
      <section className="header-container">
        <h5>Semantic Rules/Label: <p>{prompt.conjunction}</p></h5>
        <h5>Prompt ID: <p>{prompt.id}</p></h5>
        <section className="lower-header-container">
          <h5>Prompt Labelset</h5>
          <button className="quill-button fun primary contained" id="add-rule-button" type="submit">
            Add Rule/Label
          </button>
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

export default LabelsTable
