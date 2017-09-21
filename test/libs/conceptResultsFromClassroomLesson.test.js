import expect from 'expect';
import {
  prompts,
  submissions,
  questions
} from '../data/classroomLessons/data';
import {
  generate,
  generateConceptResult,
  generateConceptResultForQuestion
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
        },
      }
    };
    expect(generateConceptResultForQuestion(qdata, tsubmissions)).toEqual(expected);
  });
});

