export function max(candidates) {
  let candidate, arr = [];
  for (candidate in candidates)
    if (candidates.hasOwnProperty(candidate))
      arr.push(candidate);
  const output  = Math.max.apply(null, arr)
  return output;
}