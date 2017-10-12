import expect from 'expect';
import Question from '../../app/libs/question';
import data from '../../app/libs/femaleTeacher.test.data'

describe("The female teacher example", () => {
  const question = new Question(data);

  it("should be able to check a response and provide info on whats wrong 1", () => {
    var returnValue = question.checkMatch("The woman in the next room is the teacher.");
    expect(returnValue.found).toBe(true);
    expect(returnValue.response.optimal).toBe(true);
  });

  it("should be able to check a response and provide info on whats wrong 2", () => {
    var returnValue = question.checkMatch("the woman in the next room is the teacher.");
    expect(returnValue.found).toBe(true);
    expect(returnValue.response.author).toBe("Capitalization Hint")
    expect(returnValue.response.optimal).toBe(undefined);
  });

  it("should be able to check a response and provide info on whats wrong 3", () => {
    var returnValue = question.checkMatch("The woman in the next room is the teacher");
    expect(returnValue.found).toBe(true);
    expect(returnValue.response.author).toBe("Punctuation Hint")
  });

  it("should be able to check a response and provide info on whats wrong when punctuation and case are wrong", () => {
    var returnValue = question.checkMatch("the woman in the next room is the teacher");
    expect(returnValue.found).toBe(true);
    expect(returnValue.response.author).toBe("Punctuation and Case Hint")
  });

  it("should be able to check a response and provide info on whats wrong 5", () => {
    var returnValue = question.checkMatch("The dog in the nxt room is the teacher.");
    expect(returnValue.found).toBe(true);
    expect(returnValue.response.author).toBe("Required Words Hint")
    expect(returnValue.response).toExist();
  });

  it("should be able to check a response and provide info on whats wrong 6", () => {
    var returnValue = question.checkMatch("The woman in the next room is a teacher.");
    expect(returnValue.found).toBe(true);
    expect(returnValue.response.optimal).toBe(false);
  });

  it("should be able to identify when a response already exists and has been marked as optimal", () => {
    var returnValue = question.checkMatch("The woman in the next room is the teacher.");
    expect(returnValue.found).toBe(true);
    expect(returnValue.response.optimal).toBe(true);
  });


})
