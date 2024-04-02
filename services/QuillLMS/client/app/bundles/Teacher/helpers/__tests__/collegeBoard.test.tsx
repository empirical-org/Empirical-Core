import * as React from 'react';

import { AP_SLUG, PRE_AP_SLUG, SPRING_BOARD_SLUG } from '../../components/assignment_flow/assignmentFlowConstants';
import { generateLink, getStartedButton } from '../collegeBoard';

describe('College Board helper functions', () => {

  describe('#generateLink', () => {
    it('should return correct link if isPartOfAssignmentFlow is false', () => {
      expect(generateLink({isPartOfAssignmentFlow: false, unitTemplateId: 17 })).toEqual('/activities/packs/17');
    });
    it('should return correct link if isPartOfAssignmentFlow is true', () => {
      expect(generateLink({isPartOfAssignmentFlow: true, unitTemplateId: 3, slug: AP_SLUG })).toEqual(`/assign/featured-activity-packs/3?college-board=${AP_SLUG}`);
      expect(generateLink({isPartOfAssignmentFlow: true, unitTemplateId: 6, slug: PRE_AP_SLUG })).toEqual(`/assign/featured-activity-packs/6?college-board=${PRE_AP_SLUG}`);
      expect(generateLink({isPartOfAssignmentFlow: true, unitTemplateId: 9, slug: SPRING_BOARD_SLUG })).toEqual(`/assign/featured-activity-packs/9?college-board=${SPRING_BOARD_SLUG}`);
    });
  });

  describe('#getStartedButton', () => {
    it('should return null if isPartOfAssignmentFlow is true', () => {
      expect(getStartedButton(true)).toEqual(null);
    });
    it('should return null if isPartOfAssignmentFlow is false', () => {
      const button = <a className="quill-button large primary contained focus-on-light" href="https://www.quill.org/account/new" rel="noopener noreferrer" target="_blank">Get started</a>;
      expect(getStartedButton(false)).toEqual(button);
    });
  });
});
