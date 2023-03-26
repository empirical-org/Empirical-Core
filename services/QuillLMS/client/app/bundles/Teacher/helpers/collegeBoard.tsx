import * as React from 'react';

import { PassageAlignedUnit } from '../../../interfaces/collegeBoard';
import { AP_SLUG, COLLEGE_BOARD_SLUG, PRE_AP_SLUG, SPRING_BOARD_SLUG } from '../components/assignment_flow/assignmentFlowConstants';

export const generateLink = ({ isPartOfAssignmentFlow, unitTemplateId, slug='' }) => {
  const slugTypes = {
    'ap': AP_SLUG,
    'pre-ap': PRE_AP_SLUG,
    'springboard': SPRING_BOARD_SLUG
  }
  if(isPartOfAssignmentFlow) {
    return `/assign/featured-activity-packs/${unitTemplateId}?${COLLEGE_BOARD_SLUG}=${slugTypes[slug]}`;
  }
  return `/activities/packs/${unitTemplateId}`;
}

export const getStartedButton = (isPartOfAssignmentFlow: boolean) => {
  if(isPartOfAssignmentFlow) {
    return null;
  }
  return <a className="quill-button large primary contained focus-on-light" href="https://www.quill.org/account/new" rel="noopener noreferrer" target="_blank">Get started</a>;
}

export const handleSetActiveSection = (section: string, setActiveSection: Function) => {
  setActiveSection(section);
}

export const getActivityCount = (units: PassageAlignedUnit[]) => {
  let count = 0;
  units.forEach(unit => {
    unit.learning_cycles.forEach(cycle => {
      cycle.activities.forEach(activity => {
        count +=1;
      });
    });
  });
  return count;
}
