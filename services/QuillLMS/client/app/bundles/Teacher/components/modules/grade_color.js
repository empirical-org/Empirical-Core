export default (grade) => {
  if (grade == null) {
    return 'gray';
  } else if (grade < 0.32) {
    return 'red';
  } else if (grade < 0.83) {
    return 'orange';
  } else if (grade <= 1.0) {
    return 'green';
  }
  return 'gray';
};
