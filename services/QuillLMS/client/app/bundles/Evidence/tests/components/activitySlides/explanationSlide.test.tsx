import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ExplanationSlide } from '../../../components/activitySlides/explanationSlide';

describe('ExplanationSlide Component', () => {
  const mockProps = {
    slideData: {
      buttonText: 'Next',
      header: 'Test Header',
      imageData: {
        imageAlt: 'test alt text',
        imageUrl: 'test.com',
      },
      isBeta: false,
      step: 1,
      subtext: 'test subtext',
    },
    onHandleClick: jest.fn(),
  };

  it('should match snapshot', () => {
    const { asFragment } = render(<ExplanationSlide {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
