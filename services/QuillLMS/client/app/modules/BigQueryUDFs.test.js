import { tierUDF, studentwiseSkillGroupUDF, findLastIndex, parseElement } from "./BigQueryUDFs"

describe('studentwiseSkillGroupUDF', () => {
  it('should return skillGroup-score pairs', () => {
    const activityIds = ["1663", "1663", "1664", "1664"];
    const completedAts = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2022-01-02T00:00:00Z', '2022-01-02T00:01:00Z'];
    const scores = [false, false, true, true];
    const skillGroupNames = ['Plural and Possessive Nouns', 'Capitalization', 'Plural and Possessive Nouns', 'Capitalization' ]
    const result = studentwiseSkillGroupUDF(scores, activityIds, completedAts, skillGroupNames);
    const parsedResult = JSON.parse(result)

    expect(parsedResult['Plural and Possessive Nouns_pre']).toEqual(0)
    expect(parsedResult['Capitalization_pre']).toEqual(0)
    expect(parsedResult['Plural and Possessive Nouns_post']).toEqual(1)
    expect(parsedResult['Capitalization_post']).toEqual(1)
  })

  it('should extract correct spanned-activity counts', () => {
    const activityIds = ["1663", "306", "4", "1664"];
    const completedAts = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2024-01-01T00:01:00Z',  '2022-01-02T00:00:00Z'];
    const scores = [false, false, true, true];
    const skillGroupNames = "a b c d".split(' ')

    const result = studentwiseSkillGroupUDF(scores, activityIds, completedAts, skillGroupNames);
    const parsedResult = JSON.parse(result)
    expect(parsedResult.numAssignedRecommendedCompleted).toEqual(1)
  })


  it('should ignore spanned activities that are not recommended by the pre diagnostic', () => {
    const activityIds = ["1663", "9999", "4", "1664"];
    const completedAts = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2024-01-01T00:01:00Z',  '2022-01-02T00:00:00Z'];
    const scores = [false, false, true, true];
    const skillGroupNames = "a b c d".split(' ')

    const result = studentwiseSkillGroupUDF(scores, activityIds, completedAts, skillGroupNames);
    const parsedResult = JSON.parse(result)
    expect(parsedResult.numAssignedRecommendedCompleted).toEqual(0)
  })

  it('should extract the correct rec activity account', () => {
    const activityIds = ["1663", "3", "4", "1664"];
    const completedAts = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2024-01-01T00:01:00Z',  '2022-01-02T00:00:00Z'];
    const scores = [false, false, true, true];
    const skillGroupNames = "a b c d".split(' ')

    const result = studentwiseSkillGroupUDF(scores, activityIds, completedAts, skillGroupNames);
    const parsedResult = JSON.parse(result)

    expect(parsedResult.recommendedActivityCount).toEqual(10)
  })

  it('should remove commas from skill group names that have commas', () => {
    const activityIds = ["1663", "1664"];
    const completedAts = ['2022-01-01T00:00:00Z', '2022-01-02T00:00:00Z'];
    const scores = [false, true];
    const skillGroupNames = ['Compound Subjects, Objects, and Predicates', 'Compound Subjects, Objects, and Predicates']

    const result = studentwiseSkillGroupUDF(scores, activityIds, completedAts, skillGroupNames);
    const parsedResult = JSON.parse(result)

    expect(parsedResult['Compound Subjects Objects and Predicates_pre']).toEqual(0)
    expect(parsedResult['Compound Subjects Objects and Predicates_post']).toEqual(1)

  })
})

// Mock removeCommas function since it's not defined outside of the UDF context
function removeCommas(str) {
  return str.replace(/,/g, '');
}

describe('parseElement', () => {
  it('should parse elements correctly', () => {
    const inputString = "true|1668|2023-10-31 13:37:19.789202|Subject-Verb Agreement"
    const expectedOutput = {
      score: 1,
      activityId: 1668,
      completedAt: "2023-10-31 13:37:19.789202",
      skillGroupName: "Subject-Verb Agreement"
    }

    expect(parseElement(inputString, removeCommas)).toEqual(expectedOutput)
  })

  it('should throw error on invalid input', () => {
    const inputString = "bad|input"

    expect(() => (parseElement(inputString, removeCommas))).toThrow(`Invalid element string: ${inputString}`)
  })
})

describe('findLastIndex', () => {
  it('should return the correct index', () => {
    const finderFn = (x) => x == 4
    const arr = [2, 4, 6, 4]
    expect(findLastIndex(arr, 0, finderFn)).toEqual(3)
  })

  it('should return the correct index, with 2-element array', () => {
    const finderFn = (x) => x == 4
    const arr = [2, 4]
    expect(findLastIndex(arr, 0, finderFn)).toEqual(1)
  })

  it('should return the correct index, with 1-element array', () => {
    const finderFn = (x) => x == 4
    const arr = [2, 4]
    expect(findLastIndex(arr, 1, finderFn)).toEqual(1)
  })
})

describe('tierUDF', () => {
  it('should output the correct tier', () => {
    expect(tierUDF(0, 3)).toEqual("0%")
    expect(tierUDF(3, 10)).toEqual("21-30%")
    expect(tierUDF(81, 100)).toEqual("81-90%")
  })

  it('should return -1 for invalid inputs', () => {
    expect(tierUDF('a', 3)).toEqual("-1")
    expect(tierUDF(3, 'a')).toEqual("-1")
    expect(tierUDF(3, 0)).toEqual("-1")
    expect(tierUDF(120, 10)).toEqual("-1")
  })
})
