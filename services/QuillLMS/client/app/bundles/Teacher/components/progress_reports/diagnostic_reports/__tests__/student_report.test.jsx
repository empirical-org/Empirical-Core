import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import StudentReport from '../student_report';

const props = {
  params: {
    activityId: '168',
    unitId: '2214495',
    classroomId: '1244832',
    studentId: '12723834',
  },
  history: {
    length: 36,
    action: 'POP',
    location: {
      pathname: '/u/2214495/a/168/c/1244832/student_report/12723834',
      search: '',
      hash: '',
    },
  },
  location: {
    pathname: '/u/2214495/a/168/c/1244832/student_report/12723834',
    search: '',
    hash: '',
  },
  match: {
    path: '/u/:unitId/a/:activityId/c/:classroomId/student_report/:studentId',
    url: '/u/2214495/a/168/c/1244832/student_report/12723834',
    isExact: true,
    params: {
      unitId: '2214495',
      activityId: '168',
      classroomId: '1244832',
      studentId: '12723834',
    },
  },
};

const highestScoringActivitySession = {
  activity_session_id: 1,
  completed_at: '2024-04-23T17:58:23.384Z',
  activity_classification: 'connect',
  activity_classification_name: 'Quill Connect',
  id: 12723834,
  name: 'Carson Bryant',
  time: 72,
  number_of_correct_questions: 10,
  number_of_questions: 10,
  concept_results: [
    {
      directions: 'Fill in the blank with the correct form of the action word. (Has watched, Watched)',
      prompt: 'Jason went to the basketball game last night. There, he ___ his sister score thirty points.',
      answer: 'Jason went to the basketball game last night. There, he watched his sister score thirty points.',
      cues: ['has watched', 'watched'],
      score: 100,
      key_target_skill_concept: {
        id: 572,
        uid: 'eJbBfgKBpNwuGSvrhIkWOQ',
        name: 'Perfect Tense',
        correct: true,
      },
      concepts: [
        {
          id: 290,
          name: 'Past Tense',
          correct: true,
          feedback: null,
          lastFeedback: null,
          finalAttemptFeedback: "That's a strong sentence!",
          attempt: 1,
          answer: 'Jason went to the basketball game last night. There, he watched his sister score thirty points.',
          directions: 'Fill in the blank with the correct form of the action word. (Has watched, Watched)',
        },
      ],
      question_number: 1,
      question_uid: '-LY2cegb9T1EdNd7RDlf',
      questionScore: 1,
    },
  ],
  score: 100,
  average_score_on_quill: 0,
};

const evidenceActivitySession = {
  ...highestScoringActivitySession,
  activity_classification: 'evidence',
  activity_classification_name: 'Quill Reading for Evidence',
};

const lessonsActivitySession = {
  ...highestScoringActivitySession,
  activity_classification: 'lessons',
  activity_classification_name: 'Quill Lessons',
};

const students = [highestScoringActivitySession];

describe('StudentReport', () => {
  it('should render', () => {
    const { asFragment } = render(
      <StudentReport {...props} passedActivitySessions={students} passedStudents={students} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders correctly when passed multiple sessions', () => {
    render(
      <StudentReport
        {...props}
        passedActivitySessions={[highestScoringActivitySession, evidenceActivitySession, lessonsActivitySession]}
        passedStudents={students}
      />
    );
    const dropdownButton = screen.getByRole('button', { name: /score:/i });
    expect(dropdownButton).toBeInTheDocument();
  });

  test('renders correctly when passed only one session', () => {
    render(
      <StudentReport
        {...props}
        passedActivitySessions={[highestScoringActivitySession]}
        passedStudents={students}
      />
    );
    const dropdownButton = screen.queryByRole('button', { name: /score:/i });
    expect(dropdownButton).not.toBeInTheDocument();
  });

  test('expands and renders the correct helpful tips for "Quill Connect"', () => {
    render(
      <StudentReport
        {...props}
        passedActivitySessions={[highestScoringActivitySession]}
        passedStudents={students}
      />
    );
    const tipsHeader = screen.getByText(/Helpful Tips for Teachers/i);
    expect(tipsHeader).toBeInTheDocument();

    const connectTipButton = screen.getByRole('button', { name: /The score for Quill Connect activities is based on reaching a correct response by the final attempt./i });
    fireEvent.click(connectTipButton);

    const masteryText = screen.getByText(/mastery-based grading/i);
    expect(masteryText).toBeInTheDocument();

    const proficiencyText = screen.getByText(/83%-100%/i);
    expect(proficiencyText).toBeInTheDocument();
  });

  test('expands and renders the correct helpful tips for "Quill Reading for Evidence"', () => {
    render(
      <StudentReport
        {...props}
        passedActivitySessions={[evidenceActivitySession]}
        passedStudents={[evidenceActivitySession]}
      />
    );
    const tipsHeader = screen.getByText(/Helpful Tips for Teachers/i);
    expect(tipsHeader).toBeInTheDocument();

    const evidenceTipButton = screen.getByRole('button', { name: /The score for Quill Reading for Evidence activities is based on reaching a strong response on each prompt by the final attempt/i });
    fireEvent.click(evidenceTipButton);

    const evidenceText = screen.getByText(/strong response on each prompt/i);
    expect(evidenceText).toBeInTheDocument();
  });

  test('expands and renders the correct helpful tips for "Quill Lessons"', () => {
    render(
      <StudentReport
        {...props}
        passedActivitySessions={[lessonsActivitySession]}
        passedStudents={[lessonsActivitySession]}
      />
    );
    const tipsHeader = screen.getByText(/Helpful Tips for Teachers/i);
    expect(tipsHeader).toBeInTheDocument();

    const lessonsTipButton = screen.getByRole('button', { name: /Quill Lessons does not provide a score for students/i });
    fireEvent.click(lessonsTipButton);

    const noGradingText = screen.getByText(/Quill Lessons does not provide a score for students as there is no automated grading in the tool/i);
    expect(noGradingText).toBeInTheDocument();
  });
});
