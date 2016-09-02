export default function getBoilerplateFeedback () {
  return (
    [
      {
        key: "1",
        name: "Feedback 1",
        description: "Student writes a strong sentence and uses correct grammar.",
        children: [
          {
            key: "1-0",
            name: "Coordinating or Conjunction",
            description: "That’s a strong sentence! Using the word or helps show there’s a choice, and you put the comma in the right place."
          },
          {
            key: "1-1",
            name: "Coordinating or Conjunction (no comma)",
            description: "That’s a strong sentence! The word or helps show there’s a choice, and you remembered this type of sentence doesn’t need a comma."
          },
          {
            key: "1-2",
            name: "Coordinating and Conjunction",
            description: "That’s a strong sentence! The word and is used to add another idea, and you put the comma in the right place."
          },
          {
            key: "1-3",
            name: "Time",
            description: "That’s a strong sentence! Using the word (insert conjunction) helps show the order of events, and you put the comma in the right place."
          },
          {
            key: "1-4",
            name: "Cause (no comma)",
            description: "That’s a strong sentence! Using (insert conjunction) helps tell why or give reason, and you remembered this type of sentence doesn’t need a comma."
          },
          {
            key: "1-5",
            name: "Cause",
            description: "That’s a strong sentence! Using the word (insert conjunction) helps tell why or give a reason, and you put the comma in the right place."
          },
          {
            key: "1-6",
            name: "Opposition (no comma)",
            description: "That’s a strong sentence! You used (insert conjunction) to show that the two ideas are opposites. You remembered that this type of sentence doesn’t need a comma."
          },
          {
            key: "1-7",
            name: "Opposition",
            description: "That’s a strong sentence! Using the word (insert conjunction) helps show the two ideas are opposite, and you put the comma in the right place."
          },
          {
            key: "1-8",
            name: "Condition",
            description: "That’s a strong sentence! Using the word (insert conjunction) helps show that if one idea happens, the second idea will happen. You also put the comma in the right place."
          },
          {
            key: "1-8",
            name: "Condition (no comma)",
            description: "That’s a strong sentence! Using the word (insert conjunction) helps show that if one idea happens, the second idea will happen. You also remembered this type of sentence doesn’t need a comma."
          }
        ]
      },
      {
        key: "2",
        name: "Feedback 2",
        description: "Student uses correct punctuation and the correct joining word but makes another grammar error. The feedback will include the student response with the error underlined.",
        children: [
          {
            key: "2-0",
            name: "",
            description: "You used a strong joining word, and you punctuated the sentence correctly. Good work! Now check your verb tense."
          }
        ]
      },
      {
        key: "3",
        name: "Feedback 3",
        description: "Student uses an inaccurate joining word in a multi-cue or uncued activity.",
        children: [
          {
            key: "3-0",
            name: "Coordinating and Conjunction",
            description: "Which joining word is used to add another idea?"
          },
          {
            key: "3-1",
            name: "Coordinating or Conjunction",
            description: "Revise your work. Which joining word is used to show there’s a choice?"
          },
          {
            key: "3-2",
            name: "Time Conjunctions",
            description: "Revise your work. Which joining word helps show the order of events?"
          },
          {
            key: "3-3",
            name: "Cause Conjunctions",
            description: " Try again! Which joining word helps tell why or give a reason?"
          },
          {
            key: "3-4",
            name: "Opposition Conjunctions",
            description: "Try again! Which joining word helps show that the two ideas are opposite?"
          },
          {
            key: "3-5",
            name: "Condition Conjunctions",
            description: "Try again! Which joining word helps show that one of the ideas must happen for the other one to happen?"
          }
        ]
      },
      {
        key: "4",
        name: "Feedback 4",
        description: "Sentence is grammatically correct and makes sense, but the student uses a joining word other than the word specified in the cue box.",
        children: [
          {
            key: "4-0",
            name: "",
            description: "Strong sentence! Now revise your sentence with the joining word in the directions."
          }
        ]
      },
      {
        key: "5",
        name: "Feedback 5",
        description: "Student uses a joining word other than the word specified in the cue box, and the joining word they chose does not make sense.",
        children: [
          {
            key: "5-0",
            name: "",
            description: "Revise your sentence with the joining word in the directions."
          }
        ]
      },
      {
        key: "6",
        name: "Feedback 6",
        description: "Student writes a sentence that uses the correct joining word but is not punctuated correctly.",
        children: [
          {
            key: "6-0",
            name: "Coordinating And Conjunction",
            description: "Using and helps show that another idea has been added. Nice! Now correct your punctuation."
          },
          {
            key: "6-1",
            name: "Coordinating or Conjunction",
            description: "Using or helps show that there’s a choice. Nice! Now correct your punctuation."
          },
          {
            key: "6-2",
            name: "Time Conjunction",
            description: "Using (insert conjunction) helps show the order of events, and you put it in the right spot. Nice! Now correct your punctuation."
          },
          {
            key: "6-3",
            name: "Cause Conjunction",
            description: "Using (insert conjunction) helps tell why or give a reason, and you put it in the right spot. Nice! Now correct your punctuation."
          },
          {
            key: "6-4",
            name: "Opposition Conjunction",
            description: "Using (insert conjunction) shows the ideas are opposites, and you put it in the right spot. Nice! Now correct your punctuation."
          },
          {
            key: "6-5",
            name: "Condition Conjunction",
            description: " Using (insert conjunction) shows that if one thing happens, the other will happen. Now compare your sentence to the example and correct your punctuation."
          }
        ]
      },
      {
        key: "7",
        name: "Feedback 7",
        description: "Student writes a sentence that uses the correct joining word but the relationship between the ideas is not accurate (i.e., the clauses are in the wrong order).",
        children: [
          {
            key: "7-0",
            name: "Time Conjunction",
            description: "Revise your work. (insert conjunction) is the right word to use, but you haven’t shown the correct order of events."
          },
          {
            key: "7-1",
            name: "Cause Conjunction",
            description: "Revise your work. (insert conjunction) is the right word to use, but you need to re-order the ideas to show that … (tailored to the question)."
          },
          {
            key: "7-2",
            name: "Other Conjunction",
            description: "Revise your work. (insert conjunction) is the right word to use, but you need to re-order the ideas to show that …(tailored to the question)."
          }
        ]
      },
    ]
  )
}
