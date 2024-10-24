import * as React from "react";
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';

import StemVaultSection from './stemVaultSection'

import { BECAUSE, BUT, SO } from '../../../../../constants/evidence';
import { Spinner, } from '../../../../Shared/index';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { getPromptIdString } from '../../../helpers/evidence/ruleHelpers';
import { ActivityRouteProps, StemVaultInterface, } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchStemVaultsForEvidenceActivity, } from '../../../utils/evidence/genAIAPIs';

const LLMPromptDatasets: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId, promptConjunction } = params;

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

  const conjunctionsToShow = promptConjunction ? [promptConjunction] : [BECAUSE, BUT, SO]

  const stemVaultSections = conjunctionsToShow.map((conjunction) => {
    const stemVault = stemVaults.find(sv => sv.conjunction === conjunction)
    const individualDatasetLinkBase = `/cms/evidence#/activities/${activityId}/llm-prompt-datasets/${conjunction}/dataset`
    return (<StemVaultSection individualDatasetLinkBase={individualDatasetLinkBase} stemVault={stemVault} />)
  })

  return (
    <div className="llm-prompt-datasets-container">
      {renderHeader(activityData, 'LLM Prompt Datasets')}
      {stemVaultSections}
    </div>
  )
}

export default LLMPromptDatasets
