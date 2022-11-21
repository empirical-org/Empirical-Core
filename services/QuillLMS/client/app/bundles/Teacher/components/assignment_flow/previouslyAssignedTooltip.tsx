import * as React from 'react';

import { Tooltip, assignedBadgeIconGray } from '../../../Shared';
import { renderPreviouslyAssignedActivitiesTooltipElement } from '../../helpers/unitTemplates';

export const PreviouslyAssignedTooltip = ({ previouslyAssignedActivityData }) => {
  if(!previouslyAssignedActivityData) { return <span /> }
  return(
    <Tooltip
      tooltipText={renderPreviouslyAssignedActivitiesTooltipElement(previouslyAssignedActivityData)}
      tooltipTriggerText={<img alt={assignedBadgeIconGray.alt} src={assignedBadgeIconGray.src} />}
    />
  );
}

export default PreviouslyAssignedTooltip;
