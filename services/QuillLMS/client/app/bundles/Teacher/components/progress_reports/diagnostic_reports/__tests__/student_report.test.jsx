import * as React from 'react'
import { mount } from 'enzyme';

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

const students = [
  {
    "activity_classification": "sentence",
    "activity_classification_name": "Quill Grammar",
    "id": 12723834,
    "name": "First Student",
    "time": 119,
    "number_of_correct_questions": 7,
    "number_of_questions": 9,
    "concept_results": [
      {
        "directions": "Rewrite the sentence, and put a comma in the appropriate place.",
        "prompt": "I do not like sweets very much. Still I like sugar in my coffee.",
        "answer": "I do not like sweets very much. Still, I like sugar in my coffee.",
        "score": 100,
        "key_target_skill_concept": {
          "id": 490,
          "uid": "s1tlX0BPdyJ6uCtB4ykXCA",
          "name": "Conjunctive Adverbs",
          "correct": true
        },
        "concepts": [
          {
            "id": 135,
            "name": "Still",
            "correct": true,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "I do not like sweets very much. Still, I like sugar in my coffee.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          },
          {
            "id": 135,
            "name": "Still",
            "correct": true,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "I do not like sweets very much. Still, I like sugar in my coffee.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          }
        ],
        "question_number": 9,
        "questionScore": 1
      },
      {
        "directions": "Rewrite the sentences, and place a comma in the appropriate place.",
        "prompt": "Strawberries are my favorite. However I don&#x27;t eat them all the time.",
        "answer": "Strawberries",
        "score": 100,
        "key_target_skill_concept": {
          "id": 490,
          "uid": "s1tlX0BPdyJ6uCtB4ykXCA",
          "name": "Conjunctive Adverbs",
          "correct": true
        },
        "concepts": [
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "Strawberries",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "Strawberries",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 2,
            "answer": "Strawberries are",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 2,
            "answer": "Strawberries are",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 3,
            "answer": "Strawberries are my",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 3,
            "answer": "Strawberries are my",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": true,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 4,
            "answer": "Strawberries are my favorite. However, I don't eat them all the time.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": true,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 4,
            "answer": "Strawberries are my favorite. However, I don't eat them all the time.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          }
        ],
        "question_number": 8,
        "questionScore": 1
      },
      {
        "directions": "Rewrite the sentence, and put a comma in the appropriate place.",
        "prompt": "He can&#x27;t sing well. Still he practices every day.",
        "answer": "He can't sing well. Still, he practices every day.",
        "score": 100,
        "key_target_skill_concept": {
          "id": 490,
          "uid": "s1tlX0BPdyJ6uCtB4ykXCA",
          "name": "Conjunctive Adverbs",
          "correct": true
        },
        "concepts": [
          {
            "id": 135,
            "name": "Still",
            "correct": true,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "He can't sing well. Still, he practices every day.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          },
          {
            "id": 135,
            "name": "Still",
            "correct": true,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "He can't sing well. Still, he practices every day.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          }
        ],
        "question_number": 7,
        "questionScore": 1
      },
      {
        "directions": "Rewrite the sentences, and place a comma in the appropriate place.",
        "prompt": "I think you are correct. However I am going to look it up just to be sure.",
        "answer": "I think you are correct. However.",
        "score": 100,
        "key_target_skill_concept": {
          "id": 490,
          "uid": "s1tlX0BPdyJ6uCtB4ykXCA",
          "name": "Conjunctive Adverbs",
          "correct": true
        },
        "concepts": [
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "I think you are correct. However.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "I think you are correct. However.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 540,
            "name": "Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 2,
            "answer": "I think you are correct. However, .",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 540,
            "name": "Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 2,
            "answer": "I think you are correct. However, .",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": "<p>Revise your sentence. You don't need to have a space before a period.</p>",
            "attempt": 3,
            "answer": "I think you are correct. However, I.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": "<p>Revise your sentence. You don't need to have a space before a period.</p>",
            "attempt": 3,
            "answer": "I think you are correct. However, I.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 540,
            "name": "Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 4,
            "answer": "I think you are correct. However, I am going to look it up just to be sure..",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 540,
            "name": "Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 4,
            "answer": "I think you are correct. However, I am going to look it up just to be sure..",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": true,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your punctuation.",
            "attempt": 5,
            "answer": "I think you are correct. However, I am going to look it up just to be sure.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": true,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your punctuation.",
            "attempt": 5,
            "answer": "I think you are correct. However, I am going to look it up just to be sure.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          }
        ],
        "question_number": 6,
        "questionScore": 1
      },
      {
        "directions": "Rewrite the sentences, and place a comma in the appropriate place.",
        "prompt": "We arrived early. However there were no more tickets.",
        "answer": "We arrived early.",
        "score": 100,
        "key_target_skill_concept": {
          "id": 490,
          "uid": "s1tlX0BPdyJ6uCtB4ykXCA",
          "name": "Conjunctive Adverbs",
          "correct": true
        },
        "concepts": [
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "We arrived early.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "We arrived early.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 2,
            "answer": "We arrived early. However.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 2,
            "answer": "We arrived early. However.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": true,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 3,
            "answer": "We arrived early. However, there were no more tickets.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": true,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 3,
            "answer": "We arrived early. However, there were no more tickets.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          }
        ],
        "question_number": 5,
        "questionScore": 1
      },
      {
        "directions": "Rewrite the sentence, and put a comma in the appropriate place.",
        "prompt": "The weather was bad today. Still we had a great time.",
        "answer": "The weather was bad today.",
        "score": 100,
        "key_target_skill_concept": {
          "id": 490,
          "uid": "s1tlX0BPdyJ6uCtB4ykXCA",
          "name": "Conjunctive Adverbs",
          "correct": true
        },
        "concepts": [
          {
            "id": 135,
            "name": "Still",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "The weather was bad today.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          },
          {
            "id": 135,
            "name": "Still",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "The weather was bad today.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          },
          {
            "id": 135,
            "name": "Still",
            "correct": true,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 2,
            "answer": "The weather was bad today. Still, we had a great time.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          },
          {
            "id": 135,
            "name": "Still",
            "correct": true,
            "feedback": "",
            "lastFeedback": "Try again! Unfortunately, that answer is not correct.",
            "attempt": 2,
            "answer": "The weather was bad today. Still, we had a great time.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          }
        ],
        "question_number": 4,
        "questionScore": 1
      },
      {
        "directions": "Rewrite the sentence, and put a comma in the appropriate place.",
        "prompt": "I am very tired. Still I can study for a little while.",
        "answer": "I am very tired. Still, I can study for a little while.",
        "score": 100,
        "key_target_skill_concept": {
          "id": 490,
          "uid": "s1tlX0BPdyJ6uCtB4ykXCA",
          "name": "Conjunctive Adverbs",
          "correct": true
        },
        "concepts": [
          {
            "id": 135,
            "name": "Still",
            "correct": true,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "I am very tired. Still, I can study for a little while.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          },
          {
            "id": 135,
            "name": "Still",
            "correct": true,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "I am very tired. Still, I can study for a little while.",
            "directions": "Rewrite the sentence, and put a comma in the appropriate place."
          }
        ],
        "question_number": 3,
        "questionScore": 1
      },
      {
        "directions": "Rewrite the sentences, and place a comma in the appropriate place.",
        "prompt": "We go apple picking in the fall. However this year it was too cold.",
        "answer": "We",
        "score": 0,
        "key_target_skill_concept": {
          "id": 490,
          "uid": "s1tlX0BPdyJ6uCtB4ykXCA",
          "name": "Conjunctive Adverbs",
          "correct": false
        },
        "concepts": [
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "We",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "We",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 2,
            "answer": "We go",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 2,
            "answer": "We go",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 3,
            "answer": "We go apple-picking",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 3,
            "answer": "We go apple-picking",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 4,
            "answer": "We go apple-picking in",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 4,
            "answer": "We go apple-picking in",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 5,
            "answer": "We go apple-picking in the fall; however, this year it was too cold.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 134,
            "name": "However",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 5,
            "answer": "We go apple-picking in the fall; however, this year it was too cold.",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          }
        ],
        "question_number": 2,
        "questionScore": 0
      },
      {
        "directions": "Rewrite the sentences, and place a comma in the appropriate place.",
        "prompt": "I wish I could have three dogs. However they would be very expensive.",
        "answer": "I wish",
        "score": 0,
        "key_target_skill_concept": {
          "id": 490,
          "uid": "s1tlX0BPdyJ6uCtB4ykXCA",
          "name": "Conjunctive Adverbs",
          "correct": false
        },
        "concepts": [
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "I wish",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": null,
            "attempt": 1,
            "answer": "I wish",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 2,
            "answer": "I wish I",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 2,
            "answer": "I wish I",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 3,
            "answer": "I wish I could",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 3,
            "answer": "I wish I could",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 4,
            "answer": "I wish I could have",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 4,
            "answer": "I wish I could have",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 5,
            "answer": "I wish I could have three",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          },
          {
            "id": 915,
            "name": "End Punctuation",
            "correct": false,
            "feedback": "",
            "lastFeedback": "Proofread your work. Check your ending punctuation.",
            "attempt": 5,
            "answer": "I wish I could have three",
            "directions": "Rewrite the sentences, and place a comma in the appropriate place."
          }
        ],
        "question_number": 1,
        "questionScore": 0
      }
    ],
    "score": 78,
    "average_score_on_quill": 75
  }
]

describe('StudentReport', () => {
  it('should render', () => {
    const wrapper = mount(<StudentReport {...props} passedStudents={students} />)
    expect(wrapper).toMatchSnapshot()
  })
})
