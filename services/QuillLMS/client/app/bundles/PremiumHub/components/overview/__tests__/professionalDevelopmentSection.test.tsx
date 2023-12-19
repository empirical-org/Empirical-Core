import * as React from "react";
import { render, } from "@testing-library/react";

import ProfessionalDevelopmentSection from '../professionalDevelopmentSection'

const props = {
  accessType: "full",
  adminId: 1
}

describe('ProfessionalDevelopmentSection', () => {
  test('it should render', () => {
    const { asFragment } = render(<ProfessionalDevelopmentSection {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
