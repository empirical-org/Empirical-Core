export function commaSeparatedValuesString(values: string[]) {
  if(!values.length) { return null }
  let valuesString = '';
  values.forEach((value, i) => {
    if(i === values.length - 1) {
      valuesString += `${value}`;
    } else {
      valuesString += `${value}, `;
    }
  });
  return valuesString;
}
