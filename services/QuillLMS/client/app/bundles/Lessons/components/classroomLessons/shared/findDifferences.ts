// given a submission and prompt
// return new submission (as html) with differences from prompt bolded/colored

export function findDifferences(submission, prompt) {
  const strippedSplitPrompt = prompt.split(/<\/?p[^>]*>/g).join(" ").trim().split(" ").filter((str) => str !== "");
  const splitSubmission = submission.split(" ");
  const newSubmission = splitSubmission.slice();
  for (let i = 0; i < splitSubmission.length; i+=1) {
    if (!strippedSplitPrompt.includes(splitSubmission[i])) {
      newSubmission[i] = `<strong class="submission-differences">${splitSubmission[i]}</strong>`
    }
  }
  return `<p>${newSubmission.join(" ")}</p>`;
}
