import { studentwiseAggregateUDF, studentwiseSkillGroupUDF } from "./arrayUtils"

describe('studentwiseAggregateUDF', () => {

  // test('should extract correct spanned-activity counts', () => {
  //   // const activity_ids = ["1678", "3", "4", "1664"];
  //   // const completed_ats = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2024-01-01T00:01:00Z',  '2022-01-02T00:00:00Z'];
  //   // const scores = [80, 42, 0, 90];
  //   // const concept_names = ['a', 'Pronouns', 'c', 'd']
  //   // const result = studentwiseAggregateUDF(scores, concept_names, activity_ids, completed_ats);
  //   // expect(result.spannedActivityCount).toEqual(1)
  //   // expect(result.errorMessage).toEqual(undefined)
  //   // expect(result.Pronouns).toEqual(42)

  // })
  // test('should return default value on insufficient input', () => {
  //   const result = studentwiseAggregateUDF(
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
  //   const result = studentwiseAggregateUDF(activity_ids_array, completed_at_array, scores_array);
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
  //   const result = studentwiseAggregateUDF(activity_ids_array, completed_at_array, scores_array);
  //   expect(result).toEqual({
  //     preTestScore: 80,
  //     numAssignedRecommendedCompleted: 1,
  //     postTestScore: 90
  //   });
  // });

})


describe('studentwiseSkillGroupUDF', () => {

  test('should return skillGroup-score pairs', () => {
    const activityIds = ["1663", "1663", "1664", "1664"];
    const completedAts = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2022-01-02T00:00:00Z', '2022-01-02T00:01:00Z'];
    const scores = [0.5, 0.6, 0.7, 0.8];
    const skillGroupNames = ['Plural and Possessive Nouns', 'Capitalization', 'Plural and Possessive Nouns', 'Capitalization' ]
    const result = studentwiseSkillGroupUDF(scores, activityIds, completedAts, skillGroupNames);
    const parsedResult = JSON.parse(result)

    console.log(parsedResult)
    expect(parsedResult['Plural and Possessive Nouns_pre']).toEqual(0.5)
    expect(parsedResult['Capitalization_pre']).toEqual(0.6)
    expect(parsedResult['Plural and Possessive Nouns_post']).toEqual(0.7)
    expect(parsedResult['Capitalization_post']).toEqual(0.8)
  })

})