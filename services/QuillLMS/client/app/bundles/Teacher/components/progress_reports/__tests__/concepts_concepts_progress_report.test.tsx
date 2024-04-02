import * as React from "react";
import { render, } from "@testing-library/react";

import ConceptsConceptsProgressReport from '../concepts_concepts_progress_report'

jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

describe('ConceptsConceptsProgressReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<ConceptsConceptsProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });
});
