import * as React from "react";
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';

import DatasetTable from './datasetTable'

import { Spinner, } from '../../../../Shared/index';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { getPromptIdString } from '../../../helpers/evidence/ruleHelpers';
import { ActivityRouteProps, DatasetInterface, StemVaultInterface, } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchDatasetAndAssociatedRecords, } from '../../../utils/evidence/genAIAPIs';
import { titleCase } from "../../../helpers/evidence/miscHelpers";

const Dataset: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId, datasetId, promptConjunction, } = params;

  const [loading, setLoading] = React.useState(true)
  const [promptIds, setPromptIds] = React.useState<string>(null);
  const [dataset, setDataset] = React.useState<DatasetInterface>(null)
  const [dataSubsets, setDataSubsets] = React.useState<DatasetInterface[]>(null)
  const [stemVault, setStemVault] = React.useState<StemVaultInterface>(null)
  const [trials, setTrials] = React.useState<any>(null)
  const [relevantTexts, setRelevantTexts] = React.useState<any>(null)
  const [guidelines, setGuidelines] = React.useState<any>(null)
  const [showSubsets, setShowSubsets] = React.useState<boolean>(false)

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const { data: datasetData } = useQuery({
    queryKey: [`datasets-${datasetId}`, datasetId],
    queryFn: fetchDatasetAndAssociatedRecords
  });

  React.useEffect(() => {
    if(!promptIds && activityData && activityData.activity) {
      const { prompts } = activityData.activity;
      const promptIdString = getPromptIdString(prompts);
      setPromptIds(promptIdString);
    }
  }, [activityData]);

  React.useEffect(() => {
    if(loading && datasetData && datasetData.data) {
      const { dataset, data_subsets, stem_vault, trials, relevant_texts, guidelines, } = datasetData.data
      setDataset(dataset);
      setDataSubsets(data_subsets)
      setStemVault(stem_vault)
      setTrials(trials)
      setRelevantTexts(relevant_texts)
      setGuidelines(guidelines)
      setLoading(false)
    }
  }, [datasetData]);

  function toggleShowSubsets() { setShowSubsets(!showSubsets)}

  if (loading) { return <Spinner /> }

  const { version, suboptimal_count, optimal_count, } = dataset

  return (
    <div className="llm-prompt-dataset-container">
      {renderHeader(activityData, 'LLM Prompt Trials')}
      <section>
        <div className="top-level-dataset-info">
          <span>Dataset: V{version}</span>
          <span>Optimal Test Responses: {optimal_count}</span>
          <span>Suboptimal Test Responses: {suboptimal_count}</span>
          <span>Total Test Responses: {optimal_count + suboptimal_count}</span>
        </div>
        <a className="backlink" href={`/cms/evidence#/activities/${activityId}/llm-prompt-datasets/${promptConjunction}`}>&#8592; Return to {titleCase(promptConjunction)} Datasets</a>
      </section>
      <section>
        <h5>
          <span>Data subsets</span>
          <button className="quill-button extra-small grey outlined" onClick={toggleShowSubsets} type="button">{showSubsets ? '<' : '>'}</button>
        </h5>
        {showSubsets && (
          <DatasetTable datasets={dataSubsets} individualDatasetLinkBase="" />
        )}
      </section>
    </div>
  )
}

export default Dataset
