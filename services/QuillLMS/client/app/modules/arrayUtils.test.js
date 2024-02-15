import { extractDiagnosticMetadataFromActivityArray } from "./arrayUtils"

describe('extractDiagnosticMetadataFromActivityArray', () => {

  test('should return default value on insufficient input', () => {
    const result = extractDiagnosticMetadataFromActivityArray(
      [], [], []
    )
    expect(result).toEqual(
      { preTestScore: -1, numRecsCompleted: 0, postTestScore: -1 }
    )
  })

  it('should extract correct scores from diagnostics', () => {
    const activities_array = [1678, 1664];
    const completed_at_array = ['2022-01-01T00:00:00Z', '2022-01-02T00:00:00Z'];
    const scores_array = [80, 90];
    const result = extractDiagnosticMetadataFromActivityArray(activities_array, completed_at_array, scores_array);
    expect(result).toEqual({
      preTestScore: 80,
      numAssignedRecommendedCompleted: 0,
      postTestScore: 90
    });
  });

  it('should extract correct spanned-activity counts', () => {
    const activities_array = [1678, 3, 4, 1664];
    const completed_at_array = ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2024-01-01T00:01:00Z',  '2022-01-02T00:00:00Z'];
    const scores_array = [80, 0, 0, 90];
    const result = extractDiagnosticMetadataFromActivityArray(activities_array, completed_at_array, scores_array);
    expect(result).toEqual({
      preTestScore: 80,
      numAssignedRecommendedCompleted: 1,
      postTestScore: 90
    });
  });

})