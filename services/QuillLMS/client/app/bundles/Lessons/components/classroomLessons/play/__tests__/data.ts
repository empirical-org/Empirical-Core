const questions = [
  {
    data: {
      play: {
        html: "<p>Lobby HTML</p>"
      },
      teach: {
        script: [
          {
            data: {
              body: "<h4>Objective&nbsp;</h4>\n<p>Students will be able to combine sentences by using a compound subject.&nbsp;</p>\n<h4>Lesson Outline</h4>\n<p>Discuss the lesson objective</p>\n<p>Teacher Model: Combine sentences with a compound subject</p>\n<p>Paired Practice: Combine sentences</p>\n<p>Individual Practice: Combine sentences</p>\n<p>Wrap up lesson</p>\n<h4>Optional Follow-Up Activity</h4>\n<p>Compound Subjects</p>\n<h4>Common Core Standards&nbsp;</h4>\n<p>CCSS.ELA-Literacy.L.7.1.b&nbsp;</p>\n<p>Choose among simple, compound, complex, and compound-complex sentences to signal differing relationships among ideas.</p>\n<h4>Prerequisites&nbsp;</h4>\n<p>Students can identify the action words in a sentence.</p>\n<p>Students can make singular action words plural.</p>"
            },
            type: "Overview"
          }
        ],
        title: "Compound Subjects"
      }
    },
    type: "CL-LB"
  },
  {
    data: {
      play: {
        html: "<p>By the end of class today, you will be able to combine sentences by:&nbsp;</p>\n<blockquote>Using <strong>and</strong> to connect two people or things doing the same action.</blockquote>\n<blockquote>Changing the <strong>action word</strong> to match the number of people or things doing the action.</blockquote>"
      },
      teach: {
        script: [
          {
            data: {
              body: "<p><strong>Say:</strong> Take a minute to read today’s objective out loud to your partner.</p>\n<p><em>Wait for students to finish.</em></p>\n<p><strong>Say:</strong> &nbsp;Today, you’re going to learn one way to combine sentences so that your writing is clearer and less repetitive.</p>",
              heading: "Introduce the objective for the lesson. "
            },
            type: "STEP-HTML"
          }
        ],
        title: "Objectives"
      }
    },
    type: "CL-ST"
  },
  {
    data: {
      play: {
        cues: [""],
        html: "CHANGE ME",
        instructions: "Combine the sentences.",
        prompt: "<p>The choppy sea rocks the wooden ship.</p>\n<p>The heavy wind rocks the wooden ship.</p>"
      },
      teach: {
        script: [
          {
            data: {
              body: "<p><strong>Say: </strong>Sometimes, you have two different people or things doing the same action, like our sentences here.</p>\n<p><em>Ask a student to read the sentences out loud.</em></p>\n<p><strong>Say: </strong>In this case, two different things are both doing the same action-- they are both rocking the wooden ship. What are the two things doing the action in these sentences?</p>\n<p><strong>Anticipated Student Response: </strong>the choppy sea and the wind</p>\n<p><strong>Say: </strong>Good. Watch as I combine the sentences.</p>\n<p><em>In the Model Your Answer box, write:</em> The choppy sea and the heavy wind rock the wooden ship.</p>\n<p><em>Ask a student to read the sentence out loud.</em></p>\n<p><strong>Say: </strong>I had to do two things to combine these sentences. The first was to add <em>and </em>between the two things doing the action.&nbsp;</p>\n<p><em>In the Model Your Answer box, underline “The choppy sea and heavy wind”</em></p>\n<p><strong>Say: </strong>What is the second thing I had to change?</p>\n<p><strong>Anticipated Student Response:</strong> You changed rocks to <em>rock</em>.</p>\n<p><em>In the Model Your Answer box, make “rock” bold.</em></p>\n<p><strong>Say:</strong> Exactly. When I only had one thing in the sentence doing the action, it was okay to use <em>rocks</em>. Since my new combined sentence has two things doing the action, I have to make the action word plural by changing it to <em>rock.</em></p>",
              heading: "Model using \"and\" to combine the sentences. "
            },
            type: "STEP-HTML"
          },
          {
            type: "T-MODEL"
          }
        ],
        title: "Teacher Model"
      }
    },
    type: "CL-MD"
  },
  {
    data: {
      play: {
        cues: [""],
        instructions: "Combine the sentences.",
        prompt: "<p>The sky turns dark as the storm begins.</p>\n<p>The sea turns dark as the storm begins.</p>"
      },
      teach: {
        script: [
          {
            data: {
              body:  "<p><strong>Say: </strong>Try one with your partner. Don’t forget to make sure your action word matches with your new sentence. After deciding on the best answer, both of you will submit a response from your own computer.</p>",
              heading:  "Ask pairs to combine the sentences. "
            },
            type:  "STEP-HTML"
          },
          {
            type:  "T-REVIEW"
          },
          {
            data: {
              body:  "<p><em>Lead a discussion about the errors students made in the incorrect responses, and then discuss the correct response.&nbsp;</em></p>\n<p><em>Ask the following questions: &nbsp;</em></p>\n<ul>\n  <li>Do any of these sentences repeat information that we could remove from the sentence?</li>\n  <li>Is <em>and</em> used correctly to join the two things doing the action?</li>\n  <li>Is the action word plural to match the number of things doing the action?</li>\n</ul>",
              heading:  "Select 1 correct response and 2-3 incorrect responses to display and discuss. "
            },
            type:  "STEP-HTML"
          }
        ],
        title:  "Paired Practice"
      }
    },
    type:  "CL-SA"
  },
  {
    data: {
      play: {
        cues: [""],
        instructions:  "Combine the sentences.",
        prompt:  "<p>A downpour of rain soaks the sailors.</p>\n<p>A powerful wave soaks the sailors.</p>"
      },
    teach: {
      script: [
        {
          data: {
            body:  "<p><strong>Say: </strong>Now try one on your own. Combine these two sentences.&nbsp;</p>",
            heading:  "Ask students to combine the sentences."
          },
          type:  "STEP-HTML"
        },
        {
          type:  "T-REVIEW"
        },
        {
          data: {
            body:  "<p><em>Lead a discussion about the errors students made in the incorrect responses, and then discuss the correct response.&nbsp;</em></p>\n<p><em>Ask the following questions: &nbsp;</em></p>\n<ul>\n  <li>Do any of these sentences repeat information that we could remove from the sentence?</li>\n  <li>Is <em>and</em> used correctly to join the two things doing the action?</li>\n  <li>Is the action word plural to match the number of things doing the action?</li>\n</ul>",
            heading:  "Select 1 correct response and 2-3 incorrect responses to display and discuss. "
          },
          type:  "STEP-HTML"
        }
      ],
      title:  "Individual Practice"
    }
  },
  type:  "CL-SA"
  },
  {
    data: {
      play: {
        html:  "<p><strong>Today, I learned:</strong></p>\n<blockquote>Use <em><strong>and</strong></em> to connect two people or things doing the same action.</blockquote>\n<blockquote>Change the <strong>action word</strong> to match the number of people or things doing the action.</blockquote>"
      },
      teach: {
        script: [
          {
            data: {
              body:  "<p><strong>Say:</strong> Great work everyone! Let’s review what you learned today.</p>\n<p><em>Ask students to read each bullet point out loud.</em>&nbsp;</p>\n<p><em>You can assign an independent practice activity that students can either complete now or later.</em></p>\n<p><em>You can also pull aside the flagged students for small group instruction.&nbsp;</em></p>\n<p><strong>Say:</strong> Follow the instructions on your screen. If your screen says to begin the next activity, go ahead and begin it now. If your screen says to wait for instructions, please wait at your desk quietly for your next steps.</p>",
              heading:  "Review what the students learned today. "
            },
            type:  "STEP-HTML"
          }
        ],
        title:  "Wrap-up"
      }
    },
    type:  "CL-EX"
  }
]

export const playClassroomLessonContainerProps = {
  history: {
    length: 1,
    action: "POP",
    location: {
      pathname: "/play/class-lessons/-KsOXi8nfdjJVxREBwvR",
      search: "?&classroom_unit_id=prvw-50f6ff64-93dc-4354-b24e-ec850ec126c2&student=student",
      hash: ""
    }
  },
  location: {
    pathname: "/play/class-lessons/-KsOXi8nfdjJVxREBwvR",
    search: "?&classroom_unit_id=prvw-50f6ff64-93dc-4354-b24e-ec850ec126c2&student=student",
    hash: ""
  },
  match: {
    path: "/play/class-lessons/:lessonID",
    url: "/play/class-lessons/-KsOXi8nfdjJVxREBwvR",
    isExact: true,
    params: {
      lessonID: "-KsOXi8nfdjJVxREBwvR"
    }
  },
  classroomSessions: {
    onlyShowHeaders: false,
    hasreceiveddata: true,
    submittingnew: false,
    states: {},
    data: {
      absentTeacherState: false,
      current_slide: "4",
      edition_id: "-L1uY8-FMhXAt7oGzQwT",
      id: "prvw-50f6ff64-93dc-4354-b24e-ec850ec126c2-KsOXi8nfdjJVxREBwvR",
      presence: {
        student: true
      },
      preview: true,
      public: true,
      startTime: "2020-06-15T15:11:56.349Z",
      students: {
        student: "James Joyce"
      },
      supportingInfo: "https://assets.quill.org/documents/quill_lessons_pdf/compound_subjects_objects_and_predicates/lesson2_compound_subjects.pdf",
      timestamps: {
        1: "2020-06-15T15:12:04.794Z",
        4: "2020-06-15T15:45:07.536Z"
      }
    },
    error: "",
    showSignupModal: false
  },
  classroomLesson: {
    hasreceiveddata: true,
    submittingnew: false,
    states: {},
    data: {
      id: "-KsOXi8nfdjJVxREBwvR",
      lesson: "2",
      questions,
    title:  "Compound Subjects",
    topic:  "Compound Subjects",
    unit:  "Compound Subjects, Objects, and Predicates"
  },
    error:  "",
    id:  ""
  },
  customize: {
    user_id: null,
    editions: {},
    workingEditionMetadata: {},
    workingEditionQuestions: {},
    incompleteQuestions: [],
    coteachers: [],
    editionQuestions: {
      id:  "-L1uY8-FMhXAt7oGzQwT",
      questions
    },
    originalEditionQuestions: {
      id:  "-L1uY8-FMhXAt7oGzQwT",
      questions
    }
  }
}

export const singleAnswerProps = {
data: {
  play: {
    cues: [""],
    instructions: "Complete the sentence.",
    prompt: "<p>Yesterday, riding my bike through the town.</p>"
  },
  teach:
    {
      script: [
        {
          data: {
            body: "<p><strong>Say:</strong> You’ve seen two ways you can correct an incomplete sentence that has an -ing word. Now try correcting one with your partner. You can use either method as long as you write a complete sentence.&nbsp;</p>",
            heading: "Ask pairs to complete the sentence."
          },
          type: "STEP-HTML"
        },
        {
          type: "T-REVIEW"
        },
        {
          data: {
            body: "<p><em>Read the responses out loud.</em></p>\n<p><strong>Say: </strong>Are there any responses that are still incomplete sentences?</p>",
            heading: "Select 2-3 correct responses and 1-2 incorrect responses to display and discuss."
          },
          type: "STEP-HTML"
        },
        {
          data: {
            body: "<p><em>Ask the following questions about the incorrect responses:</em></p>\n<ul>\n  <li>How could we revise this sentence to make it a complete sentence?</li>\n  <li>What information is needed to finish the idea?</li>\n  <li>Is there anything else we need to change to make the sentence correct?</li>\n</ul>",
            heading: "Discuss responses that are incomplete sentences."
          },
          type: "STEP-HTML"
        }
      ],
      title: "Paired Practice"
    }
  },
  mode: null,
  submissions: null,
  selected_submissions: null,
  selected_submission_order: null,
  studentCount: 1
}

export const fillInTheBlankProps = {
  data: {
    play: {
      cues: [
        "the",
        "a"
      ],
      instructions: "Fill in the blank with one of the highlighted words.",
      prompt: "We waited in line at the store. ___ line was very long!"
    },
    teach: {
      script: [
        {
          data: {
            body: "<p><strong>Say:</strong> Let’s practice. With your partner, decide whether to use <em>a</em> or <em>the</em> in this sentence. Discuss why as well.</p>",
            heading: "Ask pairs to fill in the blank with \"a\" or \"the.\""
          },
          type: "STEP-HTML"
        },
        {
          type: "T-REVIEW"
        },
        {
          data: {
            body: "<p><em>Ask students to share their explanations for why they chose “a” or why they chose “the.”</em></p>\n<p><strong>Say: </strong>Thank you for sharing your ideas! As many of you explained, we use <em>the</em> here because we're talking about a specific line—the one we waited in! The sentence tells us which line we’re talking about.</p>",
            heading: "Select 1 correct response and 1 incorrect responses to display and discuss. "
          },
          type: "STEP-HTML"
        }
      ],
      title: "Paired Practice"
    }
  },
  mode: null,
  submissions: null,
  selected_submissions: null,
  selected_submission_order: null,
  studentCount: 1
}

export const listBlanksProps = {
  data: {
    play: {
      blankLabel: "",
      cues: [""],
      instructions: "",
      nBlanks: 3,
      prompt: "List three action words:"
    },
    teach: {
      script: [
        {
          data: {
            body: "<p><strong>Say:</strong> Every sentence must have at least one action word. Take one minute and think of three action words like <em>ate</em> or <em>dance</em>. Type one action word in each box and submit your response.</p>",
            heading: "Ask students to list 3 action words on their own."
          },
          type: "STEP-HTML"
        },
        {
          type: "T-REVIEW"
        },
        {
          data: {
            body: "<p><em>Ask a student to read the list of words out loud.</em></p>\n<p><strong>Say: </strong>Good work! Every sentence needs an action word like one of these words. Remember that words like <em>is</em> and <em>are</em> also count because they show that something <em>existed</em>. If an action word is missing, your sentence is incomplete.</p>",
            heading: "Select and display 4-5 correct student responses."
          },
          type: "STEP-HTML"
        },
        {
          data: {
            body: "<p>If your students are unfamiliar with linking verbs like <em>is, am, are, was,</em> and<em> were</em>, you may choose to spend additional time providing examples of these words in a sentence.</p>",
            heading: "Note:"
          },
          type: "STEP-HTML-TIP"
        }
      ],
      title: "Individual Response"
    }
  },
  mode: null,
  submissions: null,
  selected_submissions: null,
  selected_submission_order: null,
  studentCount: 1
}

export const multistepProps = {
  data: {
    play: {
      cues: [""],
      instructions: "",
      prompt: "Label each group of words as a fragment or a complete sentence.",
      stepLabels: [
        "Even though he had practiced every night and he was a talented singer.",
        "After finding out about the secret spot and walking three miles to get there.",
        "Before he went home, he took photographs of all his friends and said goodbye."
      ]
    },
    teach: {
      script: [
        {
          data: {
            body: "<p><strong>Say:</strong> CHANGE ME</p>",
            heading: "STEP HTML HEADING"
          },
          type: "STEP-HTML"
        },
        {
          type: "T-REVIEW"
        }
      ],
      title: "MULTISTEP SLIDE TITLE"
    }
  },
  mode: null,
  submissions: null,
  selected_submissions: null,
  selected_submission_order: null,
  studentCount: 2
}
