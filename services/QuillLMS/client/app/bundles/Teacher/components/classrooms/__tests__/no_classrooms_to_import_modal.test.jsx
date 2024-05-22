import * as React from "react" ;
import { render, screen, }  from "@testing-library/react";

import NoClassroomsToImportModal from '../no_classrooms_to_import_modal';

const props = {
  close: jest.fn(),
  provider: 'Google',
  allProviderClassrooms: []
}

const unownedClassroom = {
  name: 'Someone Else Owns This',
  is_owner: false
}

const archivedClassroom = {
  name: 'Archived Classroom',
  is_owner: true,
  archived: true,
  alreadyImported: true
}

describe('NoClassroomsToImportModal component', () => {

  test('it should render when there are no classrooms', () => {
    const { asFragment } = render(<NoClassroomsToImportModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render when there is an unownedClassroom', () => {
    const { asFragment } = render(<NoClassroomsToImportModal {...props} allProviderClassrooms={[unownedClassroom]} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render when there is an archivedClassroom', () => {
    const { asFragment } = render(<NoClassroomsToImportModal {...props} allProviderClassrooms={[archivedClassroom]} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render when there is both an unowned and an archived classroom', () => {
    const { asFragment } = render(<NoClassroomsToImportModal {...props} allProviderClassrooms={[archivedClassroom, unownedClassroom]} />);
    expect(asFragment()).toMatchSnapshot();
  })

})
