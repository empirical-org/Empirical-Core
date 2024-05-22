import * as React from "react";
import { render, screen, } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import LogInAsATeacherModal from '../logInAsAsTeacherModal'

const props = {
  handleCloseModal: jest.fn(),
  schoolOptions: [
    { label: "Douglass High School", value: 1, id: 1} ,
    { label: "MLK Middle School", value: 2, id: 2 },
  ],
  teacherOptions: [
    { label: "Terry Pratchett", value: 1, id: 1, schoolId: 1,} ,
    { label: "Toni Morrison", value: 2, id: 2, schoolId: 1, },
    { label: "bell hooks", value: 3, id: 3, schoolId: 2,} ,
    { label: "Celeste Ng", value: 4, id: 4, schoolId: 2, },
  ]
}

describe('LogInAsATeacherModal', () => {
  test('it should render', () => {
    const { asFragment } = render(<LogInAsATeacherModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('the teacher dropdown should only show options associated with the selected school', async () => {
    render(<LogInAsATeacherModal {...props} />)
    await userEvent.click(screen.getByRole('button', { name: /teacher/i }))
    // using strings instead of regex here because the selected option name appears in aria-contexts but we don't want to grab those elements
    expect(screen.getByText("Terry Pratchett")).toBeInTheDocument()
    expect(screen.getByText("Toni Morrison")).toBeInTheDocument()
    expect(screen.queryByText("bell hooks")).not.toBeInTheDocument()
    expect(screen.queryByText("Celeste Ng")).not.toBeInTheDocument()
  })

  test('the log in button should be disabled if no teacher is selected, then enabled once a teacher is selected', async () => {
    render(<LogInAsATeacherModal {...props} />)
    const logInButton = screen.getByRole('button', { name: /log in/i });
    expect(logInButton).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: /teacher/i }))
    await userEvent.click(screen.getByText(/Toni Morrison/i))
    expect(logInButton).not.toBeDisabled()
  });
});
