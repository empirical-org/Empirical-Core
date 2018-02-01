//What was formerly the string.prototype.normalize found in a few files, compare with native String.normalize()
export default function (string) {
  return string.replace(/[\u201C\u201D]/g, '\u0022').replace(/[\u00B4\u0060\u2018\u2019]/g, '\u0027').replace('‚', ',');
};