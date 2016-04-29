### Question Class

The aim of this class is to find a match between two strings of text. This can be an exact match, a match between a manipulation of the two strings or a fuzzy match of varying distance using diffing or Levenstein distances.

##### Requirements

All that the class needs to work is the prompt to be compared and a bank of responses to be compared to.

##### Return value

The checkMatch function returns an object with at minimum the response submitted and wether it was matched to anything in the responses array.

Below is an example of a failure to match the "nonMatchingResponseString" to any of the responses in the
```
{
  found: false,
  submitted: "nonMatchingResponseString"
}
```
If the string matches a response the response will be embedded in the returned object
```
{
  found: true,
  submitted: "matchingString",
  response: {
    ...,
    text: "matchingString",
    ...
  }
}
```
If the string returns a matching that is non exact an error type will be embedded in the returned object.
```
  found: true,
  submitted: "matchingstring",
  caseError: true,
  response: {
    ...,
    text: "matchingString",
    ...
  }
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
