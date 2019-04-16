### Context
A student inputs a submission (string of text) and is then served a piece of feedback. If the student’s submission exactly matches a pre-existing string of text (a string that has been marked), the student will receive that feedback. If the string does not match a pre-existing string, we use a series of algorithms to:
Match the student’s string to a pre-existing feedback.
Infer whether an error exists in the student’s string as compared to the pre-existing string.

#### Matching Sequences 

Here is the order of algorithms in the sequence. 

## Quill Diagnostic Sentence Combining

1. Exact Match to Optimal or Sub-Optimal Response
2. Focus Point (looks for the absence of a specific text string)
3. Incorrect Sequence (looks for a specific text string)
4. Case Insensitive Match (ignores case)
5. Punctuation Insensitive Match (ignores punctuation)
6. Punctuation and Case Insensitive Match (ignores Case and Punctuation) 
7. Min Length Matcher (see if response is shorter than all optimal responses)
8. One character difference. 
9. Spacing (ignores all whitespace)

## Quill Connect Sentence Combining

1. Exact Match to Optimal or Sub-Optimal Response
2. Focus Point (looks for the absence of a specific text string)
3. Incorrect Sequence (looks for a specific text string)
4. Case Insensitive Match (ignores case)
5. Punctuation Insensitive Match (ignores punctuation)
6. Punctuation and Case Insensitive Match (ignores Case and Punctuation) 
7. Spacing Before Punctuation
8. Spacing After Commas
9. Spacing (ignores all whitespace)
10. Modified Word Match (looks for a string where one word is different).
11. Missing Word Hint (looks for a string where everything is the same except for a missing word). 
12. Additional Word Hint (looks for a string where everything is the same except for an extra word). 
13. 1-12 but with normalized spelling
14. Flexible Change Object (10-13 but lowercased and with no punctuation)
15. Required Words Match (checks to see if any words present in all optimal answers are missing here)
16. Min Length Matcher (see if response is shorter than all optimal responses)
17. Max Length Matcher (see if response is longer than all optimal responses)
18. Case Start Checker (see if response starts with a capital letter)
19. Punctuation End Checker (see if response ends with punctuation)

## Quill Grammar Questions

1. Exact Match to Optimal or Sub-Optimal Response
2. Focus Point (looks for the absence of a specific text string)
3. Incorrect Sequence (looks for a specific text string)
4. Case Insensitive Match (ignores case)
5. Punctuation Insensitive Match (ignores punctuation)
6. Punctuation and Case Insensitive Match (ignores Case and Punctuation) 
7. Spacing Before Punctuation
8. Spacing After Commas
9. Spacing (ignores all whitespace)
10. Modified Word Match (looks for a string where one word is different).
11. Missing Word Hint (looks for a string where everything is the same except for a missing word). 
12. Additional Word Hint (looks for a string where everything is the same except for an extra word). 
13. 1-12 but with normalized spelling
14. Flexible Change Object (10-13 but lowercased and with no punctuation)
15. Case Start Checker (see if response starts with a capital letter)
16. Punctuation End Checker (see if response ends with punctuation)

## Connect and Diagnostic Fill in Blank Questions
1. Exact Match to Optimal or Sub-Optimal Response
2. Case Insensitive Match (ignores case)


### Question Class

The aim of this class is to find a match between two strings of text. This can be an exact match, a match between a manipulation of the two strings or a fuzzy match of varying distance using diffing or Levenstein distances.

##### Requirements

The class requires a submission to be graded and a bank of responses for it to be compared to.

##### Return value

The checkMatch function returns an object with at minimum the response submitted and whether it was matched to anything in the responses array.

If the string matches a response the returned object will match the response in the database


```
{
  child_count: 2885,
  count: 3484,
  feedback: "<p>That&#x27;s a strong sentence!</p>",
  first_attempt_count: 2123,
  id: 8991322,
  optimal: true
  parent_id: null,
  question_uid: "-LOsT5EN98Lai5yuavG8"
  text: "The friends laughed at the neighbor’s and their joke."
}
```


If the string returns a matching that is non exact an error type will be embedded in the returned object.

```
{
  author: "Focus Point Hint",
  count: 1,
  feedback: "<p>Revise your work. Make sure your sentence tells that the joke was by <em>the neighbor and them</em>.</p>",
  parent_id: 8991322,
  question_uid: "-LOsT5EN98Lai5yuavG8"
  text: "The friends laughed at the neighbor's joke."
}
```

###### Improvements

Instead of having the match keys be unique they should be constants attached to the returned object like so.
```
var matchTypes = {
  CASE_ERROR: "CASE_ERROR",
  EXACT_MATCH: "EXACT MATCH"
}

# Returned Object

{
  found: true,
  submitted: "matchingString",
  matchType: "EXACT_MATCH",
  response: {
    ...,
    text: "matchingString",
    ...
  }
}

```
