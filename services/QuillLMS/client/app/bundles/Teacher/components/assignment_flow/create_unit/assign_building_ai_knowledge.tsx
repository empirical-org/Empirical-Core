import * as React from 'react';

import BuildingAIKnowledge from '../../../containers/BuildingAIKnowledge';
import AssignmentFlowNavigation from '../assignment_flow_navigation';
import { BUILDING_AI_KNOWLEDGE_SLUG, } from '../assignmentFlowConstants'


const AssignBuildingAIKnowledge = () => {
  return (
    <div>
      <AssignmentFlowNavigation courseSlug={BUILDING_AI_KNOWLEDGE_SLUG} />
      <BuildingAIKnowledge />
    </div>
  )
}

export default AssignBuildingAIKnowledge
