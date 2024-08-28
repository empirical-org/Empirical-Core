import * as React from 'react';

import WorldHistory1200ToPresent from '../../../containers/WorldHistory1200ToPresent';
import AssignmentFlowNavigation from '../assignment_flow_navigation';
import { WORLD_HISTORY_1200_TO_PRESENT_SLUG, } from '../assignmentFlowConstants'


const AssignWorldHistory1200ToPresent = () => {
  return (
    <div>
      <AssignmentFlowNavigation courseSlug={WORLD_HISTORY_1200_TO_PRESENT_SLUG} />
      <WorldHistory1200ToPresent />
    </div>
  )
}

export default AssignWorldHistory1200ToPresent
