import expect from 'expect';
import {
  prompts,
  submissions,
  questions
} from '../data/classroomLessons/data';
import {
  generate,
  generateConceptResult,
  generateConceptResultForQuestion,
  generateConceptResultsForAllQuestions,
  embedActivitySessionUIDInConceptResult,
} from '../../app/libs/conceptResults/classroomLessons';

describe('Getting concept results from a Classroom lesson session', () => {
  it('should return an empty array', () => {
    expect(generate(questions, submissions, prompts)).toEqual([]);
  });

  it('should be able to generate individual concept results', () => {
    const qdata = questions[4].data.play;
    const submission = submissions[4][23663289].data;
    const expected = {
      concept_uid: 'lessons-placeholder',
      question_type: 'lessons-slide',
      metadata: {
        correct: 1,
        directions: qdata.prompt,
        prompt: qdata.prompt,
        answer: submission.data,
        attemptNumber: 1,
      },
    };
    expect(generateConceptResult(qdata, submission)).toEqual(expected);
  });

  it('should be able to generate for question concept results for each student', () => {
    const qdata = questions[4].data.play;
    const tsubmissions = submissions[4];
    const expected = {
      23663289: {
        concept_uid: 'lessons-placeholder',
        question_type: 'lessons-slide',
        metadata: {
          correct: 1,
          directions: qdata.prompt,
          prompt: qdata.prompt,
          answer: tsubmissions[23663289].data,
          attemptNumber: 1,
        },
      },
      23663290: {
        concept_uid: 'lessons-placeholder',
        question_type: 'lessons-slide',
        metadata: {
          correct: 1,
          directions: qdata.prompt,
          prompt: qdata.prompt,
          answer: tsubmissions[23663290].data,
          attemptNumber: 1,
        },
      },
      23663291: {
        concept_uid: 'lessons-placeholder',
        question_type: 'lessons-slide',
        metadata: {
          correct: 1,
          directions: qdata.prompt,
          prompt: qdata.prompt,
          answer: tsubmissions[23663291].data,
          attemptNumber: 1,
        },
      },
    };
    expect(generateConceptResultForQuestion(qdata, tsubmissions)).toEqual(expected);
  });

  it('should be able to generate the concept results for all questions', () => {
    const qdata = Object.assign({}, questions);
    const subs = Object.assign({}, submissions);
    const result = generateConceptResultsForAllQuestions(qdata, subs);
    expect(Object.keys(result).length).toEqual(2);
    expect(Object.keys(result[4]).length).toEqual(3);
    expect(result[4][23663289]).toEqual({
      concept_uid: 'lessons-placeholder',
      question_type: 'lessons-slide',
      metadata: {
        correct: 1,
        directions: qdata[4].data.play.prompt,
        prompt: qdata[4].data.play.prompt,
        answer: subs[4][23663289].data,
        attemptNumber: 1,
      },
    });
    expect(result[4][23663289].metadata).toEqual({
        correct: 1,
        directions: qdata[4].data.play.prompt,
        prompt: qdata[4].data.play.prompt,
        answer: subs[4][23663289].data,
        attemptNumber: 1,
      },
    );
  });

  it('should be able to embed the activity session UID for a concept result.', () => {
    const qdata = Object.assign({}, questions);
    const subs = Object.assign({}, submissions);
    const conceptResults = generateConceptResultsForAllQuestions(qdata, subs);
    const results = embedActivitySessionUIDInConceptResult(conceptResults);
    expect(results[4][23663289]).toEqual({
      activity_session_uid: '23663289',
      concept_uid: 'lessons-placeholder',
      question_type: 'lessons-slide',
      metadata: {
        correct: 1,
        directions: qdata[4].data.play.prompt,
        prompt: qdata[4].data.play.prompt,
        answer: subs[4][23663289].data,
        attemptNumber: 1,
        questionNumber: 1,
      },
    });

    expect(results[5][23663289]).toEqual({
      activity_session_uid: '23663289',
      concept_uid: 'lessons-placeholder',
      question_type: 'lessons-slide',
      metadata: {
        correct: 1,
        directions: qdata[5].data.play.prompt,
        prompt: qdata[5].data.play.prompt,
        answer: subs[5][23663289].data,
        attemptNumber: 1,
        questionNumber: 2,
      },
    });
  })
});

