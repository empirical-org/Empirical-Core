import _ from 'underscore';

export default function (camelObj, convertCR = true) {
  const snakeObj = {};
  for (const camelKey in camelObj) {
    if (camelObj.hasOwnProperty(camelKey)) {
      let snakeKey;
      switch (camelKey) {
        case 'questionUID':
          snakeKey = 'question_uid';
          break;
        case 'gradeIndex':
          snakeKey = 'grade_index';
          break;
        case 'parentID':
          snakeKey = 'parent_id';
          break;
        case 'conceptResults':
          snakeKey = 'concept_results';
          break;
        default:
          snakeKey = camelKey;
      }
      snakeObj[snakeKey] = camelObj[camelKey];
    }
  }
  if (convertCR && snakeObj.concept_results) {
    const crs = _.values(snakeObj.concept_results);
    const newHash = {};
    _.each(crs, (val) => {
      if (val.conceptUID && val.conceptUID.length > 0) {
        newHash[val.conceptUID] = val.correct;
      }
    });
    snakeObj.concept_results = newHash;
  }
  return snakeObj;
}
