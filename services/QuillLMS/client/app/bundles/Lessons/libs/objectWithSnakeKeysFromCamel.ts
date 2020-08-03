function sample(arg1: string): string {
  return arg1
}

export default function (camelObj: object): object {
  const snakeObj = {};
  // sample(10)
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
