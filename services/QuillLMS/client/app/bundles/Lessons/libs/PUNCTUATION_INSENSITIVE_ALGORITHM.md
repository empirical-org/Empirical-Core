### Punctuation Insensitive Matching Algorithm

This algorithm takes a user submission and removes all punctuation then compares it to the answers in the answerbank with their punctuation removed. If a match is found, it serves feedback indicating there is a punctuation error.

### User Example & Served Feedback on positive match
Submission: The woman in the next room is a teacher
Answer: The woman in the next room is a teacher.
Feedback: There may be an error. How could you update the punctuation?

#### Example positive match
```
"The hazy sky has few clouds"
or
"The hazy sky has few clouds!"
would match
"The hazy sky has few clouds."

as both would be transformed into
"The hazy sky has few clouds"
```

#### Example negative match
```
"Bill swept the floor , and Andy painted the walls."
would not match
"Bill swept the floor, and Andy painted the walls."

This is due to the double whitespace being left between "floor" and "Andy".
An improvement could be made to normalize the whitespace to a single space between words on matching.
```
