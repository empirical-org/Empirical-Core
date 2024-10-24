import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { StudentProfile } from '../../containers/StudentProfile';
import {TO_DO_ACTIVITIES } from '../../../../constants/student_profile';

// Mock the required modules
jest.mock('pusher-js');
jest.mock('../../components/student_profile/key_metrics')
jest.mock('../../components/student_profile/student_profile_units')
// jest.mock('../../../../actions/student_profile', () => ({
//   fetchStudentProfile: jest.fn(),
//   fetchStudentsClassrooms: jest.fn(),
//   fetchExactScoresData: jest.fn(),
//   handleClassroomClick: jest.fn(),
//   updateActiveClassworkTab: jest.fn(),
// }));
const mockStore = configureStore([]);

describe('StudentProfile', () => {
  let store;
  let history;
  let mockProps;

  beforeEach(() => {
    store = mockStore({
      student: {
        name: 'John Doe',
        classroom: {
          id: '123',
          name: 'Math Class',
          teacher: { name: 'Mrs. Smith' }
        }
      },
      classrooms: [],
      classroomsLoaded: true,
      selectedClassroomId: '123',
      nextActivitySession: null,
      loading: false,
      scores: [],
      activeClassworkTab: TO_DO_ACTIVITIES,
      isBeingPreviewed: false,
      metrics: {},
      exactScoresDataPending: false,
      exactScoresData: [],
      showExactScores: false,
      completedEvidenceActivityPriorToScoring: false
    });

    history = createMemoryHistory();
    history.location = { search: ''}

    mockProps = {
      history,
      student: {
        classroom: {
          teacher: {},
          name: 'name'
        },
        name: "John Smith"
      }
    }
  });



  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <Router history={history}>
          <StudentProfile {...mockProps} />
        </Router>
      </Provider>
    );
  };

  test('renders StudentProfile component', () => {
    renderComponent();
    expect(screen.getByText('Your progress')).toBeInTheDocument();
    expect(screen.getByText('Classwork')).toBeInTheDocument();
  });

  // test('fetches student profile and classrooms on mount', () => {
  //   const { fetchStudentProfile, fetchStudentsClassrooms } = require('../../../actions/student_profile');
  //   renderComponent();
  //   expect(fetchStudentProfile).toHaveBeenCalledWith('123');
  //   expect(fetchStudentsClassrooms).toHaveBeenCalled();
  // });

  // test('handles classroom tab click', async () => {
  //   const { handleClassroomClick, updateActiveClassworkTab, fetchStudentProfile } = require('../../../actions/student_profile');
  //   renderComponent();

  //   // Simulate a classroom tab click
  //   fireEvent.click(screen.getByText('Math Class'));

  //   await waitFor(() => {
  //     expect(handleClassroomClick).toHaveBeenCalledWith('123');
  //     expect(updateActiveClassworkTab).toHaveBeenCalledWith(TO_DO_ACTIVITIES);
  //     expect(fetchStudentProfile).toHaveBeenCalledWith('123');
  //     expect(history.location.pathname).toBe('/classrooms/123');
  //   });
  // });

  // test('handles "All Classes" click', () => {
  //   const { fetchStudentProfile } = require('../../../actions/student_profile');
  //   renderComponent();

  //   fireEvent.click(screen.getByText('All Classes'));

  //   expect(history.location.pathname).toBe('/classes');
  //   expect(fetchStudentProfile).toHaveBeenCalled();
  // });

  // test('handles classwork tab click', () => {
  //   const { updateActiveClassworkTab, fetchExactScoresData } = require('../../../actions/student_profile');
  //   renderComponent();

  //   fireEvent.click(screen.getByText('Completed'));

  //   expect(updateActiveClassworkTab).toHaveBeenCalledWith(COMPLETED_ACTIVITIES);
  //   expect(fetchExactScoresData).not.toHaveBeenCalled(); // Since exactScoresDataPending is false
  // });

  // test('fetches exact scores data when clicking completed tab and data is pending', () => {
  //   store = mockStore({
  //     ...store.getState(),
  //     exactScoresDataPending: true,
  //     scores: [{ id: 1 }],
  //     selectedClassroomId: '123'
  //   });

  //   const { updateActiveClassworkTab, fetchExactScoresData } = require('../../../actions/student_profile');
  //   renderComponent();

  //   fireEvent.click(screen.getByText('Completed'));

  //   expect(updateActiveClassworkTab).toHaveBeenCalledWith(COMPLETED_ACTIVITIES);
  //   expect(fetchExactScoresData).toHaveBeenCalledWith([{ id: 1 }], '123');
  // });

  // test('displays SelectAClassroom when no classroom is selected', () => {
  //   store = mockStore({
  //     ...store.getState(),
  //     selectedClassroomId: null,
  //     classroomsLoaded: true
  //   });

  //   history.push('/classes');
  //   renderComponent();

  //   expect(screen.getByText('Select a classroom')).toBeInTheDocument();
  // });

  // test('displays loading indicator when loading', () => {
  //   store = mockStore({
  //     ...store.getState(),
  //     loading: true
  //   });

  //   renderComponent();

  //   expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  // });
});