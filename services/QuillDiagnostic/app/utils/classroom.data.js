export default [{
  prompt: "Combine the following sentences into one sentence.",
  sentences: [
    "The teacher is a woman.",
    "The teacher is in the next room."
  ],
  responses: [
    {
      text: "The woman in the next room is the teacher.",
      feedback: "Excellent, that's correct!",
      status: "optimal",
    },
    {
      text: "The woman in the next room is a teacher.",
      feedback: "How do you refer to one specific teacher?",
      status: "sub-optimal",
    },
    {
      text: "The woman teacher is in the next room.",
      feedback: "We write female teacher instead of woman teacher.",
      status: "sub-optimal",
    },
    {
      text: "The woman is the teacher in the next room.",
      feedback: "It is stronger to write \"In the next room\" before \"is the teacher.\"",
      status: "sub-optimal",
    },
    {
      text: "The female teacher is in the next room.",
      feedback: "Excellent, that's correct!",
      status: "optimal",
    },
    {
      text: "The teacher is in the next room.",
      feedback: "What gender is the teacher?",
      status: "sub-optimal",
    }
  ]
}]
