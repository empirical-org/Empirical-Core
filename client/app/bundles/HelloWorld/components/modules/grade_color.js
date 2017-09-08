export default (grade) => {
  if (grade == null) {
    return 'gray';
  } else if (grade < 0.6) {
    return 'red';
  } else if (grade < 0.8) {
    return 'orange';
  } else if (grade <= 1.0) {
    return 'green';
  }
  return 'gray';
};
