import * as React from 'react'
import { mount } from 'enzyme';

import StudentReportBox from '../student_report_box'

const props = {
  "boxNumber": 6,
  "questionData": {
    "directions": "Combine the sentences. (But, So)",
    "prompt": "Tornadoes begin as light grey clouds.  The clouds eventually turn black.",
    "answer": "Tornadoes begin as light grey clouds, bu the clouds eventually turn black.",
    "score": 100,
    "key_target_skill_concept": {
      "id": 85,
      "uid": "k5C7YEgsuWEcLNTw-oRDpA",
      "name": "Coordinating Conjunctions",
      "correct": true
    },
    "concepts": [
      {
        "id": 544,
        "name": "Including Details From Prompt",
        "correct": false,
        "feedback": "",
        "lastFeedback": null,
        "attempt": 1,
        "answer": "Tornadoes begin as light grey clouds, bu the clouds eventually turn black.",
        "directions": "Combine the sentences. (But, So)"
      },
      {
        "id": 424,
        "name": "Comma Before Coordinating Conjunctions",
        "correct": true,
        "feedback": "",
        "lastFeedback": "<p>Revise your work. Use one of the joining words from the instructions.</p>",
        "attempt": 2,
        "answer": "Tornadoes begin as light grey clouds, but the clouds eventually turn black.",
        "directions": "Combine the sentences. (But, So)"
      },
      {
        "id": 88,
        "name": "But",
        "correct": true,
        "feedback": "",
        "lastFeedback": "<p>Revise your work. Use one of the joining words from the instructions.</p>",
        "attempt": 2,
        "answer": "Tornadoes begin as light grey clouds, but the clouds eventually turn black.",
        "directions": "Combine the sentences. (But, So)"
      }
    ],
    "question_number": 6,
    "questionScore": 1
  },
  "showDiff": true,
  "showScore": true
}

describe('StudentReportBox', () => {
  it('should render', () => {
    const wrapper = mount(<StudentReportBox {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
