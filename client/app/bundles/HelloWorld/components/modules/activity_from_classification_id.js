export default (classificationId) => {
    if (classificationId === 1) {
      return 'flag';
    } else if (classificationId === 2) {
      return 'puzzle'
    } else if (classificationId === 4) {
      return 'diagnostic'
    } else if (classificationId === 5) {
      return 'connect';
    } else if (classificationId === 6) {
    return 'lessons';
  }
}
