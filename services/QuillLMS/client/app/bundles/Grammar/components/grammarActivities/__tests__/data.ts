import { GrammarActivity } from "../../../interfaces/grammarActivities"
import { Question } from "../../../interfaces/questions"
import { GrammarActivityState } from "../../../reducers/grammarActivitiesReducer"
import { SessionState } from "../../../reducers/sessionReducer"

export const currentActivity: GrammarActivity = {
  concepts: {
    "1ohLyApTz7lZ3JszrA98Xg": {
      quantity: 9,
    },
  },
  description: "Write nine sentences using parallel structure.",
  title: "Parallel Structure",
}

export const currentQuestion: Question = {
  answers: [
    {
      text: "The team stretched their legs, {practiced} their drills, and then rehearsed their set plays.",
    },
  ],
  concept_uid: "1ohLyApTz7lZ3JszrA98Xg",
  instructions:
    "Rewrite the sentence so that it has proper parallel structure.",
  prompt:
    "The team stretched their legs, practice their drills, and then rehearsed their set plays.",
  rule_description:
    "<b>Correct:</b> I laughed, I cried, and I shouted during the performance.\n<b>Incorrect:</b> I laughed, I was crying, and I shout during the performance.\nSentences flow easily when all the actions in a list have the same ending. This means that each and every action in a list stays in the past, present, or future tense.",
  uid: "-Jzw0qjO5owyFPUAwDGx",
  attempts: [],
}

const incorrectAttemptOne = {
  author: "Spelling Hint",
  concept_results: [
    {
      conceptUID: "1ohLyApTz7lZ3JszrA98Xg",
      correct: false,
    },
  ],
  count: 1,
  feedback: "Try again. There may be a spelling mistake.",
  question_uid: "-Jzw0qjO5owyFPUAwDGx",
  spelling_error: true,
  text: "The team stretch their legs, practice their drills, and then rehearse their set plays.",
}

const incorrectAttemptFive = {
  author: "Spelling Hint",
  concept_results: [
    {
      conceptUID: "1ohLyApTz7lZ3JszrA98Xg",
      correct: false,
    },
  ],
  count: 1,
  feedback: "Try again. There may be a spelling mistake.",
  question_uid: "-Jzw0qjO5owyFPUAwDGx",
  spelling_error: true,
  text: "The team scratch their legs, practice their drills, and then rehearse their set plays.",
}

const correctAttempt = {
  concept_results: [
    {
      conceptUID: "1ohLyApTz7lZ3JszrA98Xg",
      correct: true,
    },
  ],
  count: 1,
  feedback: "Great job!.",
  question_uid: "-Jzw0qjO5owyFPUAwDGx",
  optimal: true,
  text: "The team stretched their legs, practiced their drills, and then rehearsed their set plays.",
}

export const currentQuestionWithOneIncorrectAttempt: Question = {
  ...currentQuestion,
  attempts: [incorrectAttemptOne],
}

export const currentQuestionWithFiveIncorrectAttempts: Question = {
  ...currentQuestion,
  attempts: [
    incorrectAttemptOne,
    incorrectAttemptOne,
    incorrectAttemptOne,
    incorrectAttemptOne,
    incorrectAttemptFive,
  ],
}

export const currentQuestionWithOneCorrectAttempt: Question = {
  ...currentQuestion,
  attempts: [correctAttempt],
}

export const grammarActivities: GrammarActivityState = {
  hasreceiveddata: true,
  currentActivity,
}

export const session: SessionState = {
  hasreceiveddata: true,
  answeredQuestions: [],
  unansweredQuestions: [
    {
      answers: [
        {
          text: "I prefer {reading the book than watching the movie adaptation}.",
        },
      ],
      concept_uid: "1ohLyApTz7lZ3JszrA98Xg",
      instructions: "Rewrite the sentence with the correct parallel structure.",
      prompt:
        "I prefer <u>reading the book than to watch the movie adaptation</u>.",
      rule_description:
        "<b>Correct: </b> I laughed, I cried, and I shouted during the performance.\n<b>Incorrect: </b> I laughed, I was crying, and I shout during the performance.\nSentences flow easily when all the actions in a list have the same ending. This means that each and every action in a list stays in the past, present, or future tense.",
      uid: "-KAg9xwXu4o93MS_0NjR",
    },
    {
      answers: [
        {
          text: "The crossing guard {was holding out his stop sign and ushering} students across the street.",
        },
      ],
      concept_uid: "1ohLyApTz7lZ3JszrA98Xg",
      instructions: "Rewrite the sentence with the correct parallel structure.",
      prompt:
        "The crossing guard <u>was holding out his stop sign and ushered</u> students across the street.",
      rule_description:
        "<b>Correct:</b> I laughed, I cried, and I shouted during the performance.\n<b>Incorrect:</b> I laughed, I was crying, and I shout during the performance.\nSentences flow easily when all the actions in a list have the same ending. This means that each and every action in a list stays in the past, present, or future tense.",
      uid: "-KAg9y8hvHU0-OXp1Buq",
    },
    {
      answers: [
        {
          text: "On my vacation to Universal Studios, I will {ride roller coasters and play carnival games}.",
        },
      ],
      concept_uid: "1ohLyApTz7lZ3JszrA98Xg",
      instructions: "Rewrite the sentence with the correct parallel structure.",
      prompt:
        "On my vacation to Universal Studios, I will <u>ride roller coasters and playing carnival games</u>.",
      rule_description:
        "<b>Correct:</b> I laughed, I cried, and I shouted during the performance.\n<b>Incorrect:</b> I laughed, I was crying, and I shout during the performance.\nSentences flow easily when all the actions in a list have the same ending. This means that each and every action in a list stays in the past, present, or future tense.",
      uid: "-KAg9yDOc5nKBI-kEeHI",
    },
    {
      answers: [
        {
          text: "Shannon loves to play the flute, march in the band, and {watch} the football games.",
        },
        {
          text: "Shannon loves {playing the flute, marching in the band, and} watching the football games.",
        },
      ],
      concept_uid: "1ohLyApTz7lZ3JszrA98Xg",
      instructions:
        "Rewrite the sentence so that it has proper parallel structure.",
      prompt:
        "Shannon loves to play the flute, march in the band, and watching the football games.",
      rule_description:
        "<b>Correct:</b> I laughed, I cried, and I shouted during the performance.\n<b>Incorrect:</b> I laughed, I was crying, and I shout during the performance.\nSentences flow easily when all the actions in a list have the same ending. This means that each and every action in a list stays in the past, present, or future tense.",
      uid: "-KAfz8_NHXJ2hrQZRyxU",
    },
    {
      answers: [
        {
          text: "The boss wanted to hire people who arrived on time, {smiled} at customers, and didn't take too many breaks.",
        },
      ],
      concept_uid: "1ohLyApTz7lZ3JszrA98Xg",
      instructions:
        "Rewrite the sentence so that it has proper parallel structure.",
      prompt:
        "The boss wanted to hire people who arrived on time, would smile at customers, and didn't take too many breaks.",
      rule_description:
        "<b>Correct:</b> I laughed, I cried, and I shouted during the performance.\n<b>Incorrect:</b> I laughed, I was crying, and I shout during the performance.\nSentences flow easily when all the actions in a list have the same ending. This means that each and every action in a list stays in the past, present, or future tense.",
      uid: "-KAfxB8z_R1vkm8-WuWY",
    },
    {
      answers: [
        {
          text: "The Rocky Mountains are a great place {for skiing, hiking, and mountain biking}.",
        },
        {
          text: "The Rocky Mountains are a great place {to ski, hike, and to mountain bike}.",
        },
      ],
      concept_uid: "1ohLyApTz7lZ3JszrA98Xg",
      instructions: "Rewrite the sentence with the correct parallel structure.",
      prompt:
        "The Rocky Mountains are a great place <u>for skiing, hiking, and to mountain bike</u>.",
      rule_description:
        "<b>Correct:</b> I laughed, I cried, and I shouted during the performance.\n<b>Incorrect:</b> I laughed, I was crying, and I shout during the performance.\nSentences flow easily when all the actions in a list have the same ending. This means that each and every action in a list stays in the past, present, or future tense.",
      uid: "-KAg9yAQ_YyWuT9x4e17",
    },
    {
      answers: [
        {
          text: "During a conversation, talking is just as important as {listening}.",
        },
      ],
      concept_uid: "1ohLyApTz7lZ3JszrA98Xg",
      instructions:
        "Rewrite the sentence so that it has proper parallel structure.",
      prompt:
        "During a conversation, talking is just as important as to listen.",
      rule_description:
        "<b>Correct:</b> I laughed, I cried, and I shouted during the performance.\n<b>Incorrect:</b> I laughed, I was crying, and I shout during the performance.\nSentences flow easily when all the actions in a list have the same ending. This means that each and every action in a list stays in the past, present, or future tense.",
      uid: "-KAfwKGn8uN5BGLgXEDa",
    },
    {
      answers: [
        {
          text: "The teacher graded the students' work quickly, accurately, and {thoroughly.}",
        },
      ],
      concept_uid: "1ohLyApTz7lZ3JszrA98Xg",
      instructions:
        "Rewrite the sentence so that it has proper parallel structure.",
      prompt:
        "The teacher graded the students' work quickly, accurately, and thorough.",
      rule_description:
        "<b>Correct:</b> I laughed, I cried, and I shouted during the performance.\n<b>Incorrect:</b> I laughed, I was crying, and I shout during the performance.\nSentences flow easily when all the actions in a list have the same ending. This means that each and every action in a list stays in the past, present, or future tense.",
      uid: "-KAfwjD8pcldAXkHjxA8",
    },
  ],
  currentQuestion,
}

export const conceptsFeedback = {
  hasreceiveddata: false,
  submittingnew: false,
  data: {},
  states: {},
  newConceptModalOpen: false,
}

export const responses = {
  a: {},
}
