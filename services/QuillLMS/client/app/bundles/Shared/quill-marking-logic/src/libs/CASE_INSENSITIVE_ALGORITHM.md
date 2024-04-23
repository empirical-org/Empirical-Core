### Case Insensitive Matching Algorithm

This algorithm takes a user submission and down-cases all letters then compares it to the lowercased answers in the answerbank. If the lowercased versions are identical, it matches and then serves feedback indicating there is a capitalization error.

### User Example & Served Feedback on positive match
Submission: the woman in the next room is a teacher.
Answer: The woman in the next room is a teacher.
Feedback: How could you update the capitalization?

#### Example positive match
```
"THE rain in SPAIN falls mainly on the PLAIN."
would match
"The rain in Spain falls mainly on the plain."

as both would be transformed into
"the rain in spain falls mainly on the plain."
```

#### Example negative match
```
"I live at number 123$ Bushwick Ave."
would not match
"I live at number 1234 Bushwick Ave."

Assuming that the user help the shift button down prematurely and got "$" instead of "4".
We can't assume the keyboard set up of all the users so we can't revert to "4".
```
