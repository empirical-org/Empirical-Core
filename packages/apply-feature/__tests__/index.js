//const { applyFeatureToPercentage } = require('../index');
import { applyFeatureToPercentage } from '../index';

describe("applyFeatureToPercentage", () => {
  it("should return false if there is no identifier provided", () => {
    const result = applyFeatureToPercentage();
    expect(result).toEqual(false);
  });

  it("should return false if the identifier is not a string", () => {
    const result = applyFeatureToPercentage(null);
    expect(result).toEqual(false);
  });

  it("should return false if the percentage is not provided", () => {
    const result = applyFeatureToPercentage('string');
    expect(result).toEqual(false);
  });

  it("should return true if the percentage is 100", () => {
    const result = applyFeatureToPercentage('string', 100);
    expect(result).toEqual(true);
  });

  it("should return true if the identifier calculates within the percentage", () => {
    const identifier = 'string' // This hashes to 1389043664
    const result = applyFeatureToPercentage(identifier, 70);
    expect(result).toEqual(true);
  });

  it("should return false if the identifier calculates outside the percentage", () => {
    const identifier = 'string' // This hashes to 1389043664
    const result = applyFeatureToPercentage(identifier, 60);
    expect(result).toEqual(false);
  });
});
