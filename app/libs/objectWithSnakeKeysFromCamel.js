export default function (camelObj) {
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
  return snakeObj;
}
