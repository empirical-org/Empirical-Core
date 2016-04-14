import expect from 'expect';
import Question from '../../app/libs/question';
import data from '../../app/libs/femaleTeacher.test.data'

describe("The female teacher example", () => {
  const question = new Question(data);

  it("should be able to check a response and provide info on whats wrong 1", () => {
    var response = question.checkMatch("The woman in the next room is the teacher.");
    expect(response.found).toBe(true);
    expect(response.caseError).toBe(undefined);
    expect(response.punctuationError).toBe(undefined);
    expect(response.typingError).toBe(undefined);
    expect(response.response.status).toBe("optimal");
  });

  it("should be able to check a response and provide info on whats wrong 2", () => {
    var response = question.checkMatch("the woman in the next room is the teacher.");
    expect(response.found).toBe(true);
    expect(response.caseError).toBe(true);
    expect(response.punctuationError).toBe(undefined);
    expect(response.typingError).toBe(undefined);
    expect(response.response.status).toBe("optimal");
  });

  it("should be able to check a response and provide info on whats wrong 3", () => {
    var response = question.checkMatch("The woman in the next room is the teacher");
    expect(response.found).toBe(true);
    expect(response.caseError).toBe(undefined);
    expect(response.punctuationError).toBe(true);
    expect(response.typingError).toBe(undefined);
    expect(response.response.status).toBe("optimal");
  });

  it("should be able to check a response and provide info on whats wrong 4", () => {
    var response = question.checkMatch("The woman in the nxt room is the teacher.");
    expect(response.found).toBe(true);
    expect(response.caseError).toBe(undefined);
    expect(response.punctuationError).toBe(undefined);
    expect(response.typingError).toBe(true);
    expect(response.response.status).toBe("optimal");
  });

  it("should be able to check a response and provide info on whats wrong 5", () => {
    var response = question.checkMatch("The dog in the nxt room is the teacher.");
    expect(response.found).toBe(false);
    expect(response.caseError).toBe(undefined);
    expect(response.punctuationError).toBe(undefined);
    expect(response.typingError).toBe(undefined);
    expect(response.response).toNotExist();
  });

  it("should be able to check a response and provide info on whats wrong 6", () => {
    var response = question.checkMatch("The woman in the next room is a teacher.");
    expect(response.found).toBe(true);
    expect(response.caseError).toBe(undefined);
    expect(response.punctuationError).toBe(undefined);
    expect(response.typingError).toBe(undefined);
    expect(response.response.status).toBe("sub-optimal");
  });

  it("should be able to check a response and provide info on whats wrong 7", () => {
    var response = question.checkMatch("The man in the next room is a teacher.");
    expect(response.found).toBe(true);
    expect(response.caseError).toBe(undefined);
    expect(response.punctuationError).toBe(undefined);
    expect(response.typingError).toBe(true);
    expect(response.response.status).toBe("sub-optimal");
    expect(response.response.feedback).toBe("How do you refer to one specific teacher?");
  });
})
