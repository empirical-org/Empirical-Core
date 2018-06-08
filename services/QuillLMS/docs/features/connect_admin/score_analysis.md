# Score Analysis

The score analysis dashboard displays a table of all questions on Quill Connect. It includes data for each question in the form of the question type, prompt, number of responses, percentage of weak responses, status, number of focus points, number of incorrect sequences, question flag, and whether or not there is a model.

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
  common_unmatched_responses: integer,
  activities: [{uid: string, name: string}]
}
```

This data comes from a query in the CMS. Once this page is rendered, a call will be made to the CMS every five minutes to check for new data and have it pushed to firebase.

Once the reducers have all received their data from firebase, each question gets saved to the state along with data about its scoring in the form that follows:

```
{
  flag: string (options: 'archived', 'alpha', 'beta', 'production'),
  focusPoints: integer,
  hasModelConcept: boolean,
  incorrectSequences: integer,
  key: string (composed of uid + question type),
  responses: integer,
  status: string (options: 'Strong', 'Okay', 'Weak', 'Very Weak'),
  uid: string
}
```

## Filters
The table can be filtered by question type, health status, and question flag.

## Columns

### Type
The type of question. Options:

- Sentence Fragment
- Fill In Blank
- Sentence Combining
- Diagnostic Question

### Prompt
The text of the question. Clicking on the prompt will take you to that question's page.

### Responses
Number of individual responses to the question.

### Weak Responses
Percentage of responses that are either weak or very weak (see next section for a breakdown of these terms).

### Status
In order to determine the health of a question, we divide the number of common unmatched responses by the total number of responses for that question. These are then categorized as follows:

- Very Weak: >5% of responses are common and unmatched
- Weak: 2%-5% of responses are common and unmatched
- Okay: 0.5%-2% of responses are common and unmatched
- Strong: 0%-0.5% of responses are common and unmatched

### Required #
Number of focus points.

### Incorrect #
Number of incorrect sequences.

### Model
Whether or not there is a model concept.

### Flag
Question flag.

### Activities
Links to activities that contain the question.
