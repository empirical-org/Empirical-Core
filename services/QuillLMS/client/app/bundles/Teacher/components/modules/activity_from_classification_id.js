export default (classificationId) => {
  const intClassificationId = parseInt(classificationId);
  if (intClassificationId === 1) {
    return 'flag';
  } else if (intClassificationId === 2) {
    return 'puzzle';
  } else if (intClassificationId === 4) {
    return 'diagnostic';
  } else if (intClassificationId === 5) {
    return 'connect';
  } else if (intClassificationId === 6) {
    return 'lessons';
  } else if (intClassificationId === 9) {
    return 'comprehension';
  }
};
