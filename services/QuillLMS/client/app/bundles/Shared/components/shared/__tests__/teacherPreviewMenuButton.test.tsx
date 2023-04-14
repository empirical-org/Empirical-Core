import { shallow } from 'enzyme';
import * as React from 'react';

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
