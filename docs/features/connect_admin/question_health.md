# Question Health

The question health dashboard shows the overall health of the questions broken down by question type. This allows us to quickly see how healthy our questions are and how much time/energy we need to spend on grading. If all of the question types are in a great status, we know we are in a strong position.

## Filters

The question health dashboard is filterable by question flag, with the option to see scores only for questions flagged as 'Alpha', 'Beta', 'Production', and 'Archived'.

## Getting the Data

The data we use for this page comes through five reducers listening to five different sections of the Firebase database: questions, diagnosticQuestions, sentenceFragments, fillInBlank, and scoreAnalysis. While the first four refer to different kinds of questions stored in Firebase, the fifth contains aggregated data on each question in the form that follows:

```
question_uid: {
  question_uid: string,
  responses: integer,
  unmatched_responses: integer,
  total_attempts: integer,
  common_matched_attempts: integer,
  common_unmatched_attempts: integer,
  common_unmatched_responses: integer
}
```

This data comes from a query in the CMS. Once this page is rendered, a call will be made to the CMS every five minutes to check for new data and have it pushed to firebase.

Once the reducers have all received their data from firebase, the scores, grouped by question type, get saved to the state.

## Calculating Question Health

### Question Health
In order to determine the health of a question, we divide the number of common unmatched responses by the total number of responses for that question. These are then categorized as follows:

- Very Weak: >5% of responses are common and unmatched
- Weak: 2%-5% of responses are common and unmatched
- Okay: 0.5%-2% of responses are common and unmatched
- Strong: 0%-0.5% of responses are common and unmatched

### Question Type Overall Health
We aggregate scores for each question type in order to categorize them as follows:

- On Fire: >20% of questions in this question type are weak or very weak
- Bad: 10%-20% of questions in this question type are weak or very weak
- Good: 5%-10% of questions in this question type are weak or very weak
- Great: 0%-5% of questions in this question type are weak or very weak.
