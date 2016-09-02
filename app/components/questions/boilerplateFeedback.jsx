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
        name: "Category 2",
        description: "This is a description for category 2",
        children: [
          {
            key: "2-0",
            name: "Category 1, subcategory 0",
            description: "This is a description for category 2, subcategory 0"
          },
          {
            key: "1-1",
            name: "Category 1, subcategory 1",
            description: "This is a description for category 2, subcategory 1"
          }
        ]
      }
    ]
  )
}
