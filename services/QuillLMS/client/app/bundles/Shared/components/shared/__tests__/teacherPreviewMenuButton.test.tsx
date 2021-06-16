import * as React from 'react';
import { shallow } from 'enzyme';

import { TeacherPreviewMenuButton } from '../../../../Shared/index';

describe('TeacherPreviewMenu component', () => {
  const mockProps = {
    containerClass: '',
    handleTogglePreview: jest.fn()
  }
  const component = shallow(<TeacherPreviewMenuButton {...mockProps} />);
  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
