import React from 'react';
import { shallow } from 'enzyme';

import EllDiagnosticAnnouncementMini from '../ell_diagnostic_announcement_mini';

describe('EllDiagnosticAnnouncementMini component', () => {

  it('should render', () => {
    expect(shallow(<EllDiagnosticAnnouncementMini />)).toMatchSnapshot();
  });

});
