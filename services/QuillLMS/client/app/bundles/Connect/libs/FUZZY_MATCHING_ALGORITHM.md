### Fuzzy Matching Algorithm

This algorithm takes a user submission and uses fuzzyset.js to create trigraphs then compares it to a set of trigraphs generated from the answers in the answerbank. The fuzzyset algorithm returns an array of matches, with a score of how strong the match is that corresponds to the number of edits, additions or deletions that need to made to the user submission to find a match.
We calculate a score threshold from the length submission:

```
threshold = (submission.length - 3) / submission.length

score > threshold = positive match
```

This allows for a maximum of 2 edits to the string.

### User Example & Served Feedback on positive match
Submission:
> The _womn_ in the next room is a teacher.

Answer:
> The woman in the next room is a teacher.

Feedback:
> Try again. There may be a spelling mistake.

#### Example positive match
```
"Th hazy sky has few clouds."
or
"Thr hazy sky has few clouds."
would match
"The hazy sky has few clouds."
```
As both would be transformed into
"Th* hazy sky has few clouds" which would have a score higher than the threshold.

#### Example negative match
```
"Andy swept the floor, and Andy painted the walls."
would not match
"Bill swept the floor, and Andy painted the walls."
```

This would require 4 edits to be made to the sentence, giving a score that would be lower than the threshold calculated for the submission.

#### False positives
```
"The hazy sky has a few clouds."
would match
"The hazy sky has few clouds."
```
The insertion of "a " meets the threshold of 2 edits, but we want this to be counted as a word insertion error (or word count error). By making sure that the word count of the matched answer and the submission are equal we can exclude these kinds of matches from the fuzzy matching.
