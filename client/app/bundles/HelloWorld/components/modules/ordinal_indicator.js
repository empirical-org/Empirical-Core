export default function(num){
  let numString = num.toString();
  let lastDigit = numString[numString.length-1]

  if (lastDigit === 1) {
      formattedGrade = grade + 'st'
  } else if (grade === 2) {
      formattedGrade = grade + 'nd'
  } else if (grade === 3) {
      formattedGrade = grade + 'rd'
  } else {
      formattedGrade = grade + 'th'
  }


}
