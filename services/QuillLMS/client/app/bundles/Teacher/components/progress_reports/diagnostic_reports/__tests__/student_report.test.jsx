import * as React from 'react'
import { screen, render } from '@testing-library/react';

import StudentReport from '../student_report'

const props = {
  "params": {
    "activityId": "168",
    "unitId": "2214495",
    "classroomId": "1244832",
    "studentId": "12723834"
  },
  "history": {
    "length": 36,
    "action": "POP",
    "location": {
      "pathname": "/u/2214495/a/168/c/1244832/student_report/12723834",
      "search": "",
      "hash": ""
    }
  },
  "location": {
    "pathname": "/u/2214495/a/168/c/1244832/student_report/12723834",
    "search": "",
    "hash": ""
  },
  "match": {
    "path": "/u/:unitId/a/:activityId/c/:classroomId/student_report/:studentId",
    "url": "/u/2214495/a/168/c/1244832/student_report/12723834",
    "isExact": true,
    "params": {
      "unitId": "2214495",
      "activityId": "168",
      "classroomId": "1244832",
      "studentId": "12723834"
    }
  }
}

const highestScoringActivitySession = {
  "activity_session_id": 1,
  "completed_at": "2024-04-23T17:58:23.384Z",
  "activity_classification": "connect",
  "activity_classification_name": "Quill Connect",
  "id": 12723834,
  "name": "Carson Bryant",
  "time": 72,
  "number_of_correct_questions": 10,
  "number_of_questions": 10,
  "concept_results": [
    {
      "directions": "Fill in the blank with the correct form of the action word. (Has watched, Watched)",
      "prompt": "Jason went to the basketball game last night. There, he ___ his sister score thirty points.",
      "answer": "Jason went to the basketball game last night. There, he watched his sister score thirty points.",
      "cues": [
        "has watched",
        "watched"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 290,
          "name": "Past Tense",
          "correct": true,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "Jason went to the basketball game last night. There, he watched his sister score thirty points.",
          "directions": "Fill in the blank with the correct form of the action word. (Has watched, Watched)"
        }
      ],
      "question_number": 1,
      "question_uid": "-LY2cegb9T1EdNd7RDlf",
      "questionScore": 1
    },
    {
      "directions": "Fill in the blank with the correct form of the action word. (Took, Has taken)",
      "prompt": "Kara is very skilled with pottery. That is because she ___ many pottery classes over the last five years.",
      "answer": "Kara is very skilled with pottery. That is because she has taken many pottery classes over the last five years.",
      "cues": [
        "took",
        "has taken"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 634,
          "name": "Present Perfect",
          "correct": true,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "Kara is very skilled with pottery. That is because she has taken many pottery classes over the last five years.",
          "directions": "Fill in the blank with the correct form of the action word. (Took, Has taken)"
        }
      ],
      "question_number": 2,
      "question_uid": "-LY2d1wf9jBDUlsulHtV",
      "questionScore": 1
    },
    {
      "directions": "Fill in the blank with the correct form of the action word. (Have gone, Went)",
      "prompt": "When did you go to Florida? I ___ to Florida last month.",
      "answer": "When did you go to Florida? I went to Florida last month.",
      "cues": [
        "have gone",
        "went"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 290,
          "name": "Past Tense",
          "correct": true,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "When did you go to Florida? I went to Florida last month.",
          "directions": "Fill in the blank with the correct form of the action word. (Have gone, Went)"
        }
      ],
      "question_number": 3,
      "question_uid": "-LY2dDPyI2GwF6UcBDDH",
      "questionScore": 1
    },
    {
      "directions": "Fill in the blank with the correct form of the action word. (Have traveled, Traveled)",
      "prompt": "Have you ever traveled to Canada? Yes, I ___ to Canada.",
      "answer": "Have you ever traveled to Canada? Yes, I have traveled to Canada.",
      "cues": [
        "have traveled",
        "traveled"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 634,
          "name": "Present Perfect",
          "correct": true,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "Have you ever traveled to Canada? Yes, I have traveled to Canada.",
          "directions": "Fill in the blank with the correct form of the action word. (Have traveled, Traveled)"
        }
      ],
      "question_number": 4,
      "question_uid": "-LY2dRZ2ynPbvGxKO8ep",
      "questionScore": 1
    },
    {
      "directions": "Fill in the blank with the correct form of the action word. (Got, Has gotten)",
      "prompt": "Dan’s sister can drive us to the park. She ___ her license two weeks ago.",
      "answer": "Dan’s sister can drive us to the park. She has gotten her license two weeks ago.",
      "cues": [
        "got",
        "has gotten"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 290,
          "name": "Past Tense",
          "correct": false,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "Dan’s sister can drive us to the park. She has gotten her license two weeks ago.",
          "directions": "Fill in the blank with the correct form of the action word. (Got, Has gotten)"
        },
        {
          "id": 290,
          "name": "Past Tense",
          "correct": true,
          "feedback": null,
          "lastFeedback": "<p>Try again. How can you show that <em>get</em> is an action completed at a specific time in the past?</p>",
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 2,
          "answer": "Dan’s sister can drive us to the park. She got her license two weeks ago.",
          "directions": "Fill in the blank with the correct form of the action word. (Got, Has gotten)"
        }
      ],
      "question_number": 5,
      "question_uid": "-LY2de236A3bk93gQTiZ",
      "questionScore": 1
    },
    {
      "directions": "Fill in the blank with the correct form of the action word. (Saw, Has seen)",
      "prompt": "Marina loves that band. She ___ them in concert seven times.",
      "answer": "Marina loves that band. She has seen them in concert seven times.",
      "cues": [
        "saw",
        "has seen"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 634,
          "name": "Present Perfect",
          "correct": true,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "Marina loves that band. She has seen them in concert seven times.",
          "directions": "Fill in the blank with the correct form of the action word. (Saw, Has seen)"
        }
      ],
      "question_number": 6,
      "question_uid": "-LY2dr-JZtx_C_nBrvui",
      "questionScore": 1
    },
    {
      "directions": "Fill in the blank with the correct form of the action word. (Sent, Have sent)",
      "prompt": "I don’t know if I have the correct email address for Mr. Walker. I ___ him at least five emails this week, and I still haven’t heard back.",
      "answer": "I don’t know if I have the correct email address for Mr. Walker. I have sent him at least five emails this week, and I still haven’t heard back.",
      "cues": [
        "sent",
        "have sent"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 634,
          "name": "Present Perfect",
          "correct": true,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "I don’t know if I have the correct email address for Mr. Walker. I have sent him at least five emails this week, and I still haven’t heard back.",
          "directions": "Fill in the blank with the correct form of the action word. (Sent, Have sent)"
        }
      ],
      "question_number": 7,
      "question_uid": "-LY2e4HjSWK46pyFP6yN",
      "questionScore": 1
    },
    {
      "directions": "Fill in the blank with the correct form of the action word. (Ran, Have run)",
      "prompt": "My legs hurt. I ___ five miles yesterday.",
      "answer": "My legs hurt. I ran five miles yesterday.",
      "cues": [
        "ran",
        "have run"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 290,
          "name": "Past Tense",
          "correct": true,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "My legs hurt. I ran five miles yesterday.",
          "directions": "Fill in the blank with the correct form of the action word. (Ran, Have run)"
        }
      ],
      "question_number": 8,
      "question_uid": "-LY2eMn0xhzIfO663AC4",
      "questionScore": 1
    },
    {
      "directions": "Fill in the blank with the correct form of the action word. (Won, Has won)",
      "prompt": "Shana competed in the robotics competition last year. She ___ first place.",
      "answer": "Shana competed in the robotics competition last year. She won first place.",
      "cues": [
        "won",
        "has won"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 290,
          "name": "Past Tense",
          "correct": true,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "Shana competed in the robotics competition last year. She won first place.",
          "directions": "Fill in the blank with the correct form of the action word. (Won, Has won)"
        }
      ],
      "question_number": 9,
      "question_uid": "-LY2e_SQOF-n5dA7pe9-",
      "questionScore": 1
    },
    {
      "directions": "Fill in the blank with the correct form of the action word. (Folded, Has folded)",
      "prompt": "Zak clearly enjoys origami. He ___ over 1,000 paper cranes over the past year.",
      "answer": "Zak clearly enjoys origami. He has folded over 1,000 paper cranes over the past year.",
      "cues": [
        "folded",
        "has folded"
      ],
      "score": 100,
      "key_target_skill_concept": {
        "id": 572,
        "uid": "eJbBfgKBpNwuGSvrhIkWOQ",
        "name": "Perfect Tense",
        "correct": true
      },
      "concepts": [
        {
          "id": 634,
          "name": "Present Perfect",
          "correct": true,
          "feedback": null,
          "lastFeedback": null,
          "finalAttemptFeedback": "That's a strong sentence!",
          "attempt": 1,
          "answer": "Zak clearly enjoys origami. He has folded over 1,000 paper cranes over the past year.",
          "directions": "Fill in the blank with the correct form of the action word. (Folded, Has folded)"
        }
      ],
      "question_number": 10,
      "question_uid": "-LY2ekdRm8kDXUTHjfyU",
      "questionScore": 1
    }
  ],
  "score": 100,
  "average_score_on_quill": 0
}

const lowestScoringActivitySession = {
  ...highestScoringActivitySession,
  "completed_at": "2024-04-22T04:58:23.384Z",
  "activity_session_id": 2,
  "score": 30
}

const middleScoringActivitySession = {
  ...highestScoringActivitySession,
  "completed_at": "2024-04-22T20:58:23.384Z",
  "activity_session_id": 3,
  "score": 70
}


const students = [highestScoringActivitySession]

describe('StudentReport', () => {
  it('should render', () => {
    const { asFragment, } = render(<StudentReport {...props} passedActivitySessions={students} passedStudents={students} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders correctly when passed multiple sessions', () => {
    render(<StudentReport {...props} passedActivitySessions={[lowestScoringActivitySession, middleScoringActivitySession, highestScoringActivitySession]} passedStudents={students} />);
    const dropdownButton = screen.getByRole('button', { name: /score:/i });
    expect(dropdownButton).toBeInTheDocument();
  });

  test('renders correctly when passed only one session', () => {
    render(<StudentReport {...props} passedActivitySessions={[highestScoringActivitySession]} passedStudents={students} />);
    const dropdownButton = screen.queryByRole('button', { name: /score:/i });
    expect(dropdownButton).not.toBeInTheDocument();
  });
})
