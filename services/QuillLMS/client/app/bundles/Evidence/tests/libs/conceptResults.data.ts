export const submittedResponses = {
  "1":[
    {
      "concept_uid": "placeholder",
      "entry":"Type an answer because some response may be provided.",
      "feedback":"Thank you for your response.",
      "feedback_type":"autoML",
      "optimal":true,
      "highlight":null
    }
  ],
  "2":[
    {
      "concept_uid": "placeholder",
      "entry":"Type an answer, but some response must be provided.",
      "feedback":"Remember, for this activity, avoid giving your opinion—your thoughts, feelings, or suggestions. Rewrite your response without the word must, and make sure that your response expresses an idea from the text.",
      "feedback_type":"opinion",
      "optimal":false,
      "highlight":[
        {
          "type":"response",
          "text":"must",
          "category":"",
          "character":34
        }
      ]
    },
    {
      "concept_uid": "placeholder",
      "entry":"Type an answer, but some response may be provided.",
      "feedback":"Thank you for your response.",
      "feedback_type":"autoML",
      "optimal":true,
      "highlight":null
    }
  ],
  "3":[
    {
      "concept_uid": "placeholder",
      "entry":"Type an answer, so some response should be provided.",
      "feedback":"Remember, for this activity, avoid giving your opinion—your thoughts, feelings, or suggestions. Rewrite your response without the word should, and make sure that your response expresses an idea from the text.",
      "feedback_type":"opinion",
      "optimal":false,
      "highlight":[
        {
          "type":"response",
          "text":"should",
          "category":"",
          "character":33
        }
      ]
    },
    {
      "concept_uid": "placeholder",
      "entry":"Type an answer, so some response shud be provided.",
      "feedback":"Thank you for your response.",
      "feedback_type":"autoML",
      "optimal":true,
      "highlight":null
    }
  ]
}

export const currentActivity = {
  "id":339,
  "title":"Test Activity",
  "parent_activity_id":1269,
  "target_level":12,
  "scored_level":"12",
  "name":"Test Activity",
  "passages":[
    {
      "id":1,
      "text":"<p>There is a passage.  It has words.  How many must it have?  We are not sure.  But we will continue typing untl there are enough.  And beginning our sentences with conjunctions.  Because that&#x27;s how we roll.</p>",
      "image_link":null,
      "image_alt_text":""
    }
  ],
  "prompts":[
    {
      "id":1,
      "max_attempts":5,
      "conjunction":"because",
      "text":"Type an answer because",
      "max_attempts_feedback":""
    },
    {
      "id":2,
      "max_attempts":5,
      "conjunction":"but",
      "text":"Type an answer, but",
      "max_attempts_feedback":""
    },
    {
      "id":3,
      "max_attempts":5,
      "conjunction":"so",
      "text":"Type an answer, so",
      "max_attempts_feedback":""
    }
  ]
}

export const expectedPayload = {
  "state":"finished",
  "percentage":null,
  "concept_results":[
    {
      "concept_uid": "placeholder",
      "question_type":"comprehension",
      "metadata":{
        "answer":"Type an answer because some response may be provided.",
        "attemptNumber":1,
        "correct":1,
        "directions":"Use information from the text to finish the sentence:",
        "prompt":"Type an answer because",
        "questionNumber":1,
        "questionScore":1
      }
    },
    {
      "concept_uid": "placeholder",
      "question_type":"comprehension",
      "metadata":{
        "answer":"Type an answer, but some response must be provided.",
        "attemptNumber":1,
        "correct":0,
        "directions":"Use information from the text to finish the sentence:",
        "prompt":"Type an answer, but",
        "questionNumber":2,
        "questionScore":0.75
      }
    },
    {
      "concept_uid": "placeholder",
      "question_type":"comprehension",
      "metadata":{
        "answer":"Type an answer, but some response may be provided.",
        "attemptNumber":2,
        "correct":1,
        "directions":"Remember, for this activity, avoid giving your opinion—your thoughts, feelings, or suggestions. Rewrite your response without the word must, and make sure that your response expresses an idea from the text.",
        "prompt":"Type an answer, but",
        "questionNumber":2,
        "questionScore":0.75
      }
    },
    {
      "concept_uid": "placeholder",
      "question_type":"comprehension",
      "metadata":{
        "answer":"Type an answer, so some response should be provided.",
        "attemptNumber":1,
        "correct":0,
        "directions":"Use information from the text to finish the sentence:",
        "prompt":"Type an answer, so",
        "questionNumber":3,
        "questionScore":0.75
      }
    },
    {
      "concept_uid": "placeholder",
      "question_type":"comprehension",
      "metadata":{
        "answer":"Type an answer, so some response shud be provided.",
        "attemptNumber":2,
        "correct":1,
        "directions":"Remember, for this activity, avoid giving your opinion—your thoughts, feelings, or suggestions. Rewrite your response without the word should, and make sure that your response expresses an idea from the text.",
        "prompt":"Type an answer, so",
        "questionNumber":3,
        "questionScore":0.75
      }
    }
  ]
}
