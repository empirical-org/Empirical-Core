import GradeColor from './grade_color'

// generally used for setting color class names, hence the score color concat at end
export default function (grade) {
  const color = GradeColor(grade)
  return `${color}-score-color`;
}
