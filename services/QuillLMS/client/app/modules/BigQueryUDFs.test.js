import { tierUDF, studentwiseSkillGroupUDF } from "./BigQueryUDFs"

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
    const activityIds = ["1663", "3", "4", "1664"];
    const completedAts = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2024-01-01T00:01:00Z',  '2022-01-02T00:00:00Z'];
    const scores = [false, false, true, true];
    const skillGroupNames = "a b c d".split(' ')

    const result = studentwiseSkillGroupUDF(scores, activityIds, completedAts, skillGroupNames);
    const parsedResult = JSON.parse(result)
    console.log("parseResult:", parsedResult)
    expect(parsedResult.numAssignedRecommendedCompleted).toEqual(1)
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

  it('should extract a valid pre/post pair when multiple are present', () => {
    // const activityIds = ["1663", "3", "4", "1664"];
    // const completedAts = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2024-01-01T00:01:00Z',  '2022-01-02T00:00:00Z'];
    // const scores = [false, false, true, true];
    // const skillGroupNames = "a b c d".split(' ')

    // const result = studentwiseSkillGroupUDF(scores, activityIds, completedAts, skillGroupNames);
    // const parsedResult = JSON.parse(result)
    // expect(parsedResult.recommendedActivityCount).toEqual(10)
  })

})

describe('tierUDF', () => {
  it('should output the correct tier', () => {
    expect(tierUDF('a', 3)).toEqual("-1")
    expect(tierUDF(3, 'a')).toEqual("-1")
    expect(tierUDF(3, 0)).toEqual("-1")
    expect(tierUDF(0, 3)).toEqual("0%")
    expect(tierUDF(3, 10)).toEqual("21-30%")
    expect(tierUDF(81, 100)).toEqual("81-90%")
  })
})
