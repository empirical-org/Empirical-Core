export function getColumnWidth(accessor, headerText, data, averageFontWidth=10) {
  let max = 0;

  const maxWidth = 400;

  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && data[i][accessor] !== null) {
      if (String(data[i][accessor] || 'null').length > max) {
        max = String(data[i][accessor] || 'null').length;
      }
    }
  }

  return Math.min(maxWidth, Math.max(max, headerText.length) * averageFontWidth);
}
