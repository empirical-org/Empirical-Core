import * as React from "react";
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';

import { BECAUSE, BUT, SO } from '../../../../../constants/evidence';
import { DataTable, Spinner } from '../../../../Shared/index';
import { titleCase } from "../../../helpers/evidence/miscHelpers";
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { getPromptIdString } from '../../../helpers/evidence/ruleHelpers';
import { ActivityRouteProps, StemVaultInterface, DatasetInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchStemVaultsForEvidenceActivity, uploadDataset, } from '../../../utils/evidence/genAIAPIs';

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

const NewDatasetModal = ({ stemVault, closeModal, }) => {
  // const AdminVerificationModal = ({ confirmFunction, headerText, bodyText, closeModal, }) => (
  const [file, setFile] = React.useState();
  const [notes, setNotes] = React.useState('');

  function handleOnChange(e) {
    setFile(e.target.files[0]);
  };

  function errorFunction(e) {
    debugger;
  }

  function uploadData() {
    uploadDataset(stemVault, file, notes, closeModal, errorFunction)
  }

  return (
    <div className="modal-container new-dataset-modal-container">
      <div className="modal-background" />
      <div className="new-dataset-modal quill-modal modal-body">
        <div className="top-section">
          <h3>New Dataset</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleOnChange}
        />

        </div>
        <div className="button-section">
          <button className="quill-button medium outlined focus-on-light" onClick={closeModal} type="button">Cancel</button>
          <button className="quill-button medium contained focus-on-light" onClick={uploadData} type="button">Upload</button>
        </div>
      </div>
    </div>
  )
  // export default AdminVerificationModal

}

const StemVaultSection = ({ stemVault, }: { stemVault: StemVaultInterface, }) => {
  const [showNewDatasetModal, setShowNewDatasetModal] = React.useState<boolean>(false)

  const { conjunction, datasets, } = stemVault

  function openNewDatasetModal() { setShowNewDatasetModal(true) }

  function closeNewDatasetModal() { setShowNewDatasetModal(false) }

  return (
    <section>
      {showNewDatasetModal && <NewDatasetModal closeModal={closeNewDatasetModal} confirmFunction={() => {}} stemVault={stemVault}  />}
      <h5>
        <span>{titleCase(conjunction)} Datasets</span>
        <button className="quill-button small outlined" onClick={openNewDatasetModal} type="button">New</button>
      </h5>
      <DatasetTable datasets={datasets} />
    </section>
  )
}

const LLMPromptTrials: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  const [promptIds, setPromptIds] = React.useState<string>(null);
  const [stemVaults, setStemVaults] = React.useState<StemVaultInterface[]>(null)

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const { data: stemVaultsData } = useQuery({
    queryKey: [`stem-vaults-${activityId}`, activityId],
    queryFn: fetchStemVaultsForEvidenceActivity
  });

  React.useEffect(() => {
    if(!promptIds && activityData && activityData.activity) {
      const { prompts } = activityData.activity;
      const promptIdString = getPromptIdString(prompts);
      setPromptIds(promptIdString);
    }
  }, [activityData]);

  React.useEffect(() => {
    if(!stemVaults && stemVaultsData && stemVaultsData.stemVaults) {
      setStemVaults(stemVaultsData.stemVaults);
    }
  }, [stemVaultsData]);

  if (!stemVaults) { return <Spinner /> }

  const becauseStemVault = stemVaults.find(sv => sv.conjunction === BECAUSE)
  const butStemVault = stemVaults.find(sv => sv.conjunction === BUT)
  const soStemVault = stemVaults.find(sv => sv.conjunction === SO)

  return (
    <div className="llm-prompt-trials-container">
      {renderHeader(activityData, 'LLM Prompt Datasets')}
      <StemVaultSection stemVault={becauseStemVault} />
      <StemVaultSection stemVault={butStemVault} />
      <StemVaultSection stemVault={soStemVault} />
    </div>
  )
}

export default LLMPromptTrials
