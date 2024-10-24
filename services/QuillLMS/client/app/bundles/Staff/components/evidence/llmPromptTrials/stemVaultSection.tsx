import * as React from "react";
import moment from 'moment';

import NewDatasetModal from './newDatasetModal'

import { DataTable, } from '../../../../Shared/index';
import { titleCase } from "../../../helpers/evidence/miscHelpers";
import { StemVaultInterface, DatasetInterface } from '../../../interfaces/evidenceInterfaces';

const dataTableFields = [
  {
    name: 'Dataset',
    attribute: 'datasetVersion',
    width: '70px',
  },
  {
    name: 'Created',
    attribute: 'created',
    width: '70px',
  },
  {
    name: 'Notes',
    attribute: 'notes',
    width: '400px',
    noTooltip: true,
    rowSectionClassName: 'allow-wrap'
  },
  {
    name: 'Total Test Responses',
    attribute: 'totalTestResponsesCount',
    width: '54px',
    headerClassName: 'center-content',
    rowSectionClassName: 'center-content'
  },
  {
    name: 'Optimal Test Responses',
    attribute: 'optimalTestResponsesCount',
    width: '71px',
    headerClassName: 'center-content',
    rowSectionClassName: 'center-content'
  },
  {
    name: 'Suboptimal Test Responses',
    attribute: 'suboptimalTestResponsesCount',
    width: '85px',
    headerClassName: 'center-content',
    rowSectionClassName: 'center-content'
  },
  {
    name: 'Trials',
    attribute: 'trialsCount',
    width: '30px',
    headerClassName: 'center-content',
    rowSectionClassName: 'center-content'
  },
  {
    name: 'Access',
    attribute: 'viewButton',
    headerClassName: 'center-content',
    width: '70px',
    noTooltip: true
  },
]

const DatasetTable = ({ datasets, }: { datasets: DatasetInterface[]}) => {
  function rows() {
    return datasets.map(dataset => {
      const { id, optimal_count, suboptimal_count, version, created_at, notes, trial_count, } = dataset

      return {
        id,
        datasetVersion: `Dataset ${version}`,
        created: moment(created_at).format("MM/DD/YY"),
        notes,
        totalTestResponsesCount: optimal_count + suboptimal_count,
        optimalTestResponsesCount: optimal_count,
        trialsCount: trial_count,
        suboptimalTestResponsesCount: suboptimal_count,
        viewButton: <a className="quill-button extra-small outlined" href="/">View</a>
      }
    })
  }

  return (
    <DataTable
      className="dataset-table"
      headers={dataTableFields}
      rows={rows()}
    />
  )
}

const StemVaultSection = ({ stemVault, }: { stemVault: StemVaultInterface, }) => {
  const [showNewDatasetModal, setShowNewDatasetModal] = React.useState<boolean>(false)

  const { conjunction, datasets, } = stemVault

  function openNewDatasetModal() { setShowNewDatasetModal(true) }

  function closeNewDatasetModal() { setShowNewDatasetModal(false) }

  return (
    <section className="stem-vault-section">
      {showNewDatasetModal && <NewDatasetModal closeModal={closeNewDatasetModal} stemVault={stemVault}  />}
      <h5>
        <span>{titleCase(conjunction)} Datasets</span>
        <button className="quill-button extra-small outlined" onClick={openNewDatasetModal} type="button">New</button>
      </h5>
      <DatasetTable datasets={datasets} />
    </section>
  )
}

export default StemVaultSection
