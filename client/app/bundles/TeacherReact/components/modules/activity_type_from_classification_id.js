export default (classificationId) => {
  if (classificationId === 1) {
    return 'Quill Proofreader';
  } else if (classificationId === 2) {
    return 'Quill Grammar';
  } else if (classificationId === 4) {
    return 'Quill Diagnostic';
  } else if (classificationId === 5) {
    return 'Quill Connect';
  }
};
