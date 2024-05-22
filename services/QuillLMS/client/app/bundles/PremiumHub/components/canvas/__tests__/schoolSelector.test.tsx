import * as React from "react" ;
import { render, screen, }  from "@testing-library/react";

import { schools, } from './data'

import SchoolSelector from '../schoolSelector'

const sharedProps = {
  schools,
  setSelectedSchoolIds: jest.fn()
}

describe('SchoolSelector', () => {
  test('it should render when there are no selected school ids', () => {
    const { asFragment } = render(<SchoolSelector {...sharedProps} selectedSchoolIds={[]} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render when there is one selected school id', () => {
    const { asFragment } = render(<SchoolSelector {...sharedProps} selectedSchoolIds={[schools[0].id]} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render when all school ids are selected', () => {
    const { asFragment } = render(<SchoolSelector {...sharedProps} selectedSchoolIds={schools.map(s => s.id)} />);
    expect(asFragment()).toMatchSnapshot();
  })

})
