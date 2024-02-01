import moment from 'moment';
import * as React from "react";
import { useState } from 'react'
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { firstBy } from 'thenby';

import { enableMoreThanTenLabels } from '../../../utils/evidence/modelAPIs';
import EnableMoreThanTenLabelsModal from './enableMoreThanTenLabelsModal'
import { DataTable, Spinner } from '../../../../Shared/index';
import { titleCase } from '../../../helpers/evidence/miscHelpers';
import { fetchModels } from '../../../utils/evidence/modelAPIs';

const renderUnsafeHtml = (html) => {
  return (
    <p className="word-wrap" dangerouslySetInnerHTML={{ __html: html }} />
  )
}

const ModelsTable = ({ activityId, prompt }) => {
  // cache models data for updates
  const { data: modelsData } = useQuery({
    queryKey: [`models-${prompt.id}`, prompt.id],
    queryFn: fetchModels
  });

  const [isEnableMoreThanTenLabelsModalOpen, setIsEnableMoreThanTenLabelsModalOpen] = useState(false)

  function getFormattedRows() {
    if (modelsData?.models?.length) {
      const formattedRows = modelsData.models.map(model => {
        const { id, created_at, name, older_models, labels, state } = model;
        const viewLink = (
          <Link className="data-link" to={`/activities/${activityId}/semantic-labels/model/${id}`}>View</Link>
        );
        const activateLink = (
          <Link className="data-link" to={`/activities/${activityId}/semantic-labels/${prompt.id}/model/${id}/activate`}>Activate</Link>
        );

        const enableMoreThanTenLabels = (
          <button onClick={handleClickEnableTenPlusLabels}>Enable 10+ labels</button>
        )

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
          className: state === 'active' ? 'active-row' : '',
          enable_more_than_ten_labels: state === 'active' ? enableMoreThanTenLabels : ''

        }
      });
      return formattedRows.sort(firstBy('created_at'));
    }
    return [];
  }

  function handleClickEnableTenPlusLabels() {
    setIsEnableMoreThanTenLabelsModalOpen(true)
  }

  function handleEnableMoreThanTenLabelsSave(additionalLabels) {
    setIsEnableMoreThanTenLabelsModalOpen(false)

    if (additionalLabels === null || additionalLabels === '') { return }

    enableMoreThanTenLabels(prompt.id, additionalLabels).then(() => { window.location.reload() })
  }

  function handleEnableMoreThanTenLabelsCancel() { setIsEnableMoreThanTenLabelsModalOpen(false) }

  if (!prompt) {
    return (
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Created At", attribute: "created_at", width: "100px", noTooltip: true },
    { name: "Version", attribute: "version", width: "50px", noTooltip: true },
    { name: "Model Name", attribute: "name", width: "150px" },
    { name: "Model Notes", attribute: "notes", width: "300px" },
    { name: "Label Count", attribute: "label_count", width: "70px", noTooltip: true },
    { name: "Status", attribute: "status", width: "70px", noTooltip: true },
    { name: "", attribute: "view", width: "50px", noTooltip: true },
    { name: "", attribute: "activate", width: "70px", noTooltip: true },
    { name: "", attribute: "enable_more_than_ten_labels", width: "140px", noTooltip: true },
  ];

  const addModelLink = (
    <Link
      className="quill-button fun primary contained"
      to={{
        pathname: `/activities/${activityId}/semantic-labels/${prompt.id}/add-model`,
        state: { conjunction: prompt.conjunction }
      }}
    >Add Model
    </Link>
  )

  return (
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
      <EnableMoreThanTenLabelsModal
        cancel={handleEnableMoreThanTenLabelsCancel}
        isOpen={isEnableMoreThanTenLabelsModalOpen}
        save={handleEnableMoreThanTenLabelsSave}
      />
    </section>
  );
}

export default ModelsTable
