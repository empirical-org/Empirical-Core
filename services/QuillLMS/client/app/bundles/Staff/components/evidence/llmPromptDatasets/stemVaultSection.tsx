import * as React from "react";

import NewDatasetModal from './newDatasetModal'
import DatasetTable from './datasetTable'

import { titleCase } from "../../../helpers/evidence/miscHelpers";
import { StemVaultInterface, } from '../../../interfaces/evidenceInterfaces';


const StemVaultSection = ({ stemVault, individualDatasetLinkBase, }: { stemVault: StemVaultInterface, individualDatasetLinkBase: string }) => {
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
      <DatasetTable datasets={datasets} individualDatasetLinkBase={individualDatasetLinkBase} />
    </section>
  )
}

export default StemVaultSection
