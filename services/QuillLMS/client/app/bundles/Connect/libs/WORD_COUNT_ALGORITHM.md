### Word Count Algorithm

This algorithm takes a user submission and compares the number of words to number of words present in the human-optimal answers in the answerbank if the number of optimal answers is above a threshold (initially 5 optimal answers present.)

If the submissions word count is lower than the smallest word count in the human-optimal answerbank then feedback is served that indicates information may be missing from the submission.

If the submissions word count is larger than the largest word count in the human-optimal answerbank then feedback is served that indicates there maybe unnessecry information in the submission and the user should be more concise.

### User Example & Served Feedback on positive match

##### Too long
Submission:
> The woman in the next room is a teacher _in this school_.

Answer:
> The woman in the next room is a teacher.

Feedback:
> Try again. You should be more concise.

##### Too short
Submission:
> The woman in the room is a teacher.

Answer:
> The woman in the next room is a teacher.

Feedback:
> Try again. You might be missing some vital information from the prompt.

#### Example too long match

```
"The hazy sky has few clouds in the sky." WC = 9
where the human-optimal answerbank contains answers:
"The hazy sky has few clouds." WC = 6
"The cloudy sky is hazy." WC = 5
"The slightly cloudy sky is hazy." WC = 6

MAX WC = 6
MIN WC = 5
```
The submissions word count is 9 which is greater the MAX WC of the human-optimal answerbank.

#### Example too short match

```
"The hazy sky has clouds." WC = 5
where the human-optimal answerbank contains answers:
"The hazy sky has a few clouds." WC = 7
"The slightly cloudy sky is hazy." WC = 6
"The slightly cloudy sky is hazy." WC = 6

MAX WC = 7
MIN WC = 6
```
The submissions word count is 5 which is greater the MIN WC of the human-optimal answerbank.

#### Example negative match
```
"The hazy sky has some clouds." WC = 6
where the human-optimal answerbank contains answers:
"The hazy sky has a few clouds." WC = 7
"The slightly cloudy sky is hazy." WC = 6
"The slightly cloudy sky is hazy." WC = 6

MAX WC = 7
MIN WC = 6
```
The submissions word count is 6 which is between the MIN->MAX WC of the human-optimal answerbank.
