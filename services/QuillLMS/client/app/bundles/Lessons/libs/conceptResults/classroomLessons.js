import _ from 'underscore';

const LESSONS_CONCEPT_UID = 'X37oyfiNxSphA34npOb-Ig' // lessons-specific concept that we use for all questions

export function generate(lessonQuestionData, studentSessionData, modifications) {
  const nestedConceptResults = generateConceptResultsForAllQuestions(lessonQuestionData, studentSessionData);
  const completeConceptResults = embedActivitySessionUIDInConceptResult(nestedConceptResults);
  const flatConceptResults = Object.values(completeConceptResults).map((questionSubs) => Object.values(questionSubs))
  return [].concat.apply([], flatConceptResults); // Flatten array
}

export function generateConceptResult(questionData, studentSubmission) {
  const answer = studentSubmission.data instanceof Object ? Object.values(studentSubmission.data).join('; ') : studentSubmission.data

  return {
    concept_id: LESSONS_CONCEPT_UID,
    question_type: 'lessons-slide',
    metadata: {
      correct: 1,
      directions: questionData.instructions,
      prompt: questionData.prompt,
      answer: studentSubmission.data,
      attemptNumber: 1,
      question_concept_uid: LESSONS_CONCEPT_UID
    },
  };
}

export function generateConceptResultForQuestion(questionData, studentSubmissions) {
  return _.mapObject(studentSubmissions, (submission, studentID) => generateConceptResult(questionData, submission));
}

export function generateConceptResultsForAllQuestions(questionsData, studentSubmissionsData) {
  return _.mapObject(studentSubmissionsData, (questionSubmissions, questionID) => {
    return generateConceptResultForQuestion(questionsData[questionID].data.play, questionSubmissions);
  })
}

export function embedActivitySessionUIDInConceptResult(nestedConceptResults) {
  const questionNumbers = Object.keys(nestedConceptResults).sort();
  return _.mapObject(nestedConceptResults, (submissions, questionUID) => {
    return _.mapObject(submissions, (submission, activitySessionUID) => {
      submission.activity_session_uid = activitySessionUID;
      submission.metadata.questionNumber = questionNumbers.indexOf(questionUID) + 1;
      return submission
    })
  })
}
