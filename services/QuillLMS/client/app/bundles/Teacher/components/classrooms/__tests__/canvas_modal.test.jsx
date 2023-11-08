import React from 'react';
import { render } from '@testing-library/react';

import CanvasModal from '../canvas_modal'; // Adjust the import path as necessary

const TEACHER = 'teacher'
const ADMIN = 'admin'
const TEACHER_PREMIUM = 'Teacher Premium'
const SCHOOL_PREMIUM = 'School Premium'

describe('CanvasModal', () => {
  const mockClose = jest.fn();

  const renderWithProps = (userProps) => {
    return render(<CanvasModal close={mockClose} user={userProps} />);
  };

  it('renders correctly for TEACHER_LACKS_RELEVANT_PREMIUM', () => {
    const userProps = {
      role: TEACHER,
      subscription: { account_type: TEACHER_PREMIUM },
      school_linked_to_canvas: false
    };

    const { asFragment } = renderWithProps(userProps);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly for TEACHER_LACKS_SCHOOL_CANVAS', () => {
    const userProps = {
      role: TEACHER,
      subscription: { account_type: SCHOOL_PREMIUM },
      school_linked_to_canvas: false
    };

    const { asFragment } = renderWithProps(userProps);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly for TEACHER_LACKS_INDIVIDUAL_CANVAS', () => {
    const userProps = {
      role: TEACHER,
      subscription: { account_type: SCHOOL_PREMIUM },
      school_linked_to_canvas: true
    };

    const { asFragment } = renderWithProps(userProps);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly for ADMIN_LACKS_RELEVANT_PREMIUM', () => {
    const userProps = {
      role: ADMIN,
      subscription: { account_type: TEACHER_PREMIUM },
      school_linked_to_canvas: false
    };

    const { asFragment } = renderWithProps(userProps);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly for ADMIN_LACKS_SCHOOL_CANVAS', () => {
    const userProps = {
      role: ADMIN,
      subscription: { account_type: SCHOOL_PREMIUM },
      school_linked_to_canvas: false
    };

    const { asFragment } = renderWithProps(userProps);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly for ADMIN_LACKS_INDIVIDUAL_CANVAS', () => {
    const userProps = {
      role: ADMIN,
      subscription: { account_type: SCHOOL_PREMIUM },
      school_linked_to_canvas: true
    };

    const { asFragment } = renderWithProps(userProps);
    expect(asFragment()).toMatchSnapshot();
  });

});
