import * as React from "react";
import { useQuery } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import { stripHtml } from "string-strip-html";
import moment from 'moment';

import { BECAUSE, BUT, PLAGIARISM, SO } from '../../../../../constants/evidence';
import { DataTable, Error, Spinner } from '../../../../Shared/index';
import { titleCase } from "../../../helpers/evidence/miscHelpers";
import { promptsByConjunction } from "../../../helpers/evidence/promptHelpers";
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { getPromptIdString } from '../../../helpers/evidence/ruleHelpers';
import { ActivityRouteProps, StemVaultInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchStemVaultsForEvidenceActivity } from '../../../utils/evidence/genAIAPIs';

const dataTableFields = [
  {
    name: 'Dataset',
    attribute: 'datasetVersion',
    width: '100px'
  },
  {
    name: 'Created',
    attribute: 'created',
    width: '100px'
  },
  {
    name: 'Notes',
    attribute: 'notes',
    width: '100px'
  },
  {
    name: 'Total Test Responses',
    attribute: 'totalTestResponsesCount',
    width: '100px'
  },
  {
    name: 'Optimal Test Responses',
    attribute: 'optimalTestResponsesCount',
    width: '100px'
  },
  {
    name: 'Suboptimal Test Responses',
    attribute: 'suboptimalTestResponsesCount',
    width: '100px'
  },
  {
    name: 'Trials',
    attribute: 'trialsCount',
    width: '100px'
  },
  {
    name: 'Access',
    attribute: 'viewButton',
    width: '100px'
  },
]

const DatasetTable = ({ datasets, }) => {
  function rows() {
    return datasets.map(dataset => {
      const { optimal_count, suboptimal_count, version, created_at, notes, trial_count, } = dataset

      return {
        datasetVersion: `Dataset ${version}`,
        created: moment(created_at).format("MM/DD/YY HH:MM A"),
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

  return (
    <div className="llm-prompt-trials-container">
      {renderHeader(activityData, 'LLM Prompt Datasets')}
      <h5>Because Datasets</h5>
      <DatasetTable datasets={stemVaults.find(sv => sv.conjunction === BECAUSE).datasets} />
      <h5>But Datasets</h5>
      <DatasetTable datasets={stemVaults.find(sv => sv.conjunction === BUT).datasets} />
      <h5>So Datasets</h5>
      <DatasetTable datasets={stemVaults.find(sv => sv.conjunction === SO).datasets} />
    </div>
  )
}

export default LLMPromptTrials
