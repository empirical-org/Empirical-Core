import { studentwiseCompletedActivitiesUDF, studentwiseSkillGroupUDF } from "./arrayUtils"

describe('studentwiseCompletedActivitiesUDF', () => {

  // test('should extract correct spanned-activity counts', () => {
  //   // const activity_ids = ["1678", "3", "4", "1664"];
  //   // const completed_ats = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2024-01-01T00:01:00Z',  '2022-01-02T00:00:00Z'];
  //   // const scores = [80, 42, 0, 90];
  //   // const concept_names = ['a', 'Pronouns', 'c', 'd']
  //   // const result = studentwiseCompletedActivitiesUDF(scores, concept_names, activity_ids, completed_ats);
  //   // expect(result.spannedActivityCount).toEqual(1)
  //   // expect(result.errorMessage).toEqual(undefined)
  //   // expect(result.Pronouns).toEqual(42)

  // })
  // test('should return default value on insufficient input', () => {
  //   const result = studentwiseCompletedActivitiesUDF(
  //     [], [], []
  //   )
  //   expect(result).toEqual(
  //     { preTestScore: -1, numAssignedRecommendedCompleted: 0, postTestScore: -1 }
  //   )
  // })

  // it('should extract correct scores from diagnostics', () => {
  //   const activity_ids_array = ["1678", "1664"];
  //   const completed_at_array = ['2022-01-01T00:00:00Z', '2022-01-02T00:00:00Z'];
  //   const scores_array = [80, 90];
  //   const result = studentwiseCompletedActivitiesUDF(activity_ids_array, completed_at_array, scores_array);
  //   expect(result).toEqual({
  //     preTestScore: 80,
  //     numAssignedRecommendedCompleted: 0,
  //     postTestScore: 90
  //   });
  // });

  // it('should extract correct spanned-activity counts', () => {
  //   const activity_ids_array = ["1678", "3", "4", "1664"];
  //   const completed_at_array = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2024-01-01T00:01:00Z',  '2022-01-02T00:00:00Z'];
  //   const scores_array = [80, 0, 0, 90];
  //   const result = studentwiseCompletedActivitiesUDF(activity_ids_array, completed_at_array, scores_array);
  //   expect(result).toEqual({
  //     preTestScore: 80,
  //     numAssignedRecommendedCompleted: 1,
  //     postTestScore: 90
  //   });
  // });

})


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
    expect(parsedResult.numAssignedRecommendedCompleted).toEqual(1)
  })

})