// generally used for setting color class names, hence the score color concat at end
export default function (grade) {
  let color;
  if (grade === null) {
    color = 'gray';
  } else if (grade >= 80) {
    color = 'green';
  } else if (grade >= 60 && grade <= 79) {
    color = 'yellow';
  } else if (grade <= 59) {
    color = 'red';
  } else {
    color = null;
  }
  return `${color}-score-color`;
}
