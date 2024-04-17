import * as React from 'react';
import { render } from '@testing-library/react';

import Attempt from '../attempt';

const optimalAttemptProps = {
  "attempt": {
    "id": 290,
    "name": "Past Tense",
    "correct": true,
    "feedback": null,
    "lastFeedback": "<p>Try again. How can you show that <em>get</em> is an action completed at a specific time in the past?</p>",
    "finalAttemptFeedback": "That's a strong sentence!",
    "attempt": 2,
    "answer": "Dan’s sister can drive us to the park. She got her license two weeks ago.",
    "directions": "Fill in the blank with the correct form of the action word. (Got, Has gotten)"
  },
  "groupedAttempts": {
    "1": [
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
      }
    ],
    "2": [
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
    ]
  },
  "index": 1,
  "lastAttempt": true,
  "studentReachedOptimal": true
}

const suboptimalAttemptProps = {
  "attempt": {
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
  "groupedAttempts": {
    "1": [
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
      }
    ],
    "2": [
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
    ]
  },
  "index": 0,
  "lastAttempt": false,
  "studentReachedOptimal": true
}

const finalSuboptimalAttemptProps = {
  "attempt": {
    "id": 290,
    "name": "Past Tense",
    "correct": false,
    "feedback": null,
    "lastFeedback": "<p>Try again. How can you show that <em>watch</em> is an action completed at a specific time in the past?</p>",
    "finalAttemptFeedback": "Good try! Compare your response to the strong responses, and then go to on to the next question.",
    "attempt": 5,
    "answer": "Jason went to the basketball game last night. There, he has watched his sister score thirty points.",
    "directions": "Fill in the blank with the correct form of the action word. (Has watched, Watched)"
  },
  "groupedAttempts": {
    "1": [
      {
        "id": 524,
        "name": "Capitalization",
        "correct": false,
        "feedback": null,
        "lastFeedback": null,
        "finalAttemptFeedback": "Good try! Compare your response to the strong responses, and then go to on to the next question.",
        "attempt": 1,
        "answer": "Jason went to the basketball game last night. There, he Watched his sister score thirty points.",
        "directions": "Fill in the blank with the correct form of the action word. (Has watched, Watched)"
      }
    ],
    "2": [
      {
        "id": 290,
        "name": "Past Tense",
        "correct": false,
        "feedback": null,
        "lastFeedback": "Proofread your work. Check your capitalization.",
        "finalAttemptFeedback": "Good try! Compare your response to the strong responses, and then go to on to the next question.",
        "attempt": 2,
        "answer": "Jason went to the basketball game last night. There, he has watched his sister score thirty points.",
        "directions": "Fill in the blank with the correct form of the action word. (Has watched, Watched)"
      }
    ],
    "3": [
      {
        "id": 290,
        "name": "Past Tense",
        "correct": false,
        "feedback": null,
        "lastFeedback": "<p>Try again. How can you show that <em>watch</em> is an action completed at a specific time in the past?</p>",
        "finalAttemptFeedback": "Good try! Compare your response to the strong responses, and then go to on to the next question.",
        "attempt": 3,
        "answer": "Jason went to the basketball game last night. There, he has watched his sister score thirty points.",
        "directions": "Fill in the blank with the correct form of the action word. (Has watched, Watched)"
      }
    ],
    "4": [
      {
        "id": 290,
        "name": "Past Tense",
        "correct": false,
        "feedback": null,
        "lastFeedback": "<p>Try again. How can you show that <em>watch</em> is an action completed at a specific time in the past?</p>",
        "finalAttemptFeedback": "Good try! Compare your response to the strong responses, and then go to on to the next question.",
        "attempt": 4,
        "answer": "Jason went to the basketball game last night. There, he has watched his sister score thirty points.",
        "directions": "Fill in the blank with the correct form of the action word. (Has watched, Watched)"
      }
    ],
    "5": [
      {
        "id": 290,
        "name": "Past Tense",
        "correct": false,
        "feedback": null,
        "lastFeedback": "<p>Try again. How can you show that <em>watch</em> is an action completed at a specific time in the past?</p>",
        "finalAttemptFeedback": "Good try! Compare your response to the strong responses, and then go to on to the next question.",
        "attempt": 5,
        "answer": "Jason went to the basketball game last night. There, he has watched his sister score thirty points.",
        "directions": "Fill in the blank with the correct form of the action word. (Has watched, Watched)"
      }
    ]
  },
  "index": 4,
  "lastAttempt": true,
  "studentReachedOptimal": false
}

describe('Attempt', () => {
  test('renders as expected when the student has an optimal attempt', () => {
    const { asFragment, } = render(<Attempt {...optimalAttemptProps} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders as expected when the student has a suboptimal attempt', () => {
    const { asFragment, } = render(<Attempt {...suboptimalAttemptProps} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders as expected when the student has a suboptimal final attempt', () => {
    const { asFragment, } = render(<Attempt {...finalSuboptimalAttemptProps} />)
    expect(asFragment()).toMatchSnapshot()
  })
});
