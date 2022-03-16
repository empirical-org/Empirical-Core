import * as React from 'react';
import { shallow } from 'enzyme';

import ImageSection from '../configureSettings/imageSection';

const mockProps = {
  activityPassages: [{ image_link: ''}],
  errors: [],
  handleSetImageLink: jest.fn(),
  handleSetImageAltText: jest.fn(),
  handleSetImageCaption: jest.fn(),
  imageAttributionStyle: '',
  imageAttributionGuideLink: '',
  handleSetImageAttribution: jest.fn()
}

describe('ImageSection component', () => {
  const container = shallow(<ImageSection {...mockProps} />);

  it('should render ImageSection', () => {
    expect(container).toMatchSnapshot();
  });
});
