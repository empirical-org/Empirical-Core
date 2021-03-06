export const genericQuestion = {
  conceptID: "-KLRyCNQCR24LUUEXA6F",
  cues: ["and", "or", "because", "but", "so"],
  focusPoints: {
    "-Kh82k5DfAAQQKljJmyU": {
      conceptResults: {
        xbWqNtZPs6yKbQQk5pKXUg: {
          correct: true,
          name: "Verbs | Active and Passive Voice | Passive Voice",
        },
      },

      feedback: "Who flew around the world.",
      order: 1,
      text: "Anne Lindbergh",
    },
    "-Kh82qvvcNKb85yZPHOs": {
      conceptResults: {
        E3pyzLXodTuT1vGrLbnXtQ: {
          correct: true,
          name: "Adjectives & Adverbs | Adjectives to Adverbs | Adjectives to Adverbs: Consonant Ending",
        },
      },
      feedback: "Who did she fly around the world with?",
      order: 2,
      text: "husband",
    },
    "-Kh82vHrCCP4CG2eSSaC": {
      conceptResults: {
        xbWqNtZPs6yKbQQk5pKXUg: {
          correct: true,
          name: "Verbs | Active and Passive Voice | Passive Voice",
        },
      },
      feedback: "What could she do instead of fly?",
      order: 3,
      text: "home",
    },
  },
  prompt:
    "<p>Anne Lindbergh could stay home.&nbsp;</p>\n<p>She could fly around the world with her husband.</p>",
}

export const fillInBlankQuestionBlankAllowed = {
  blankAllowed: true,
  conceptID: "fJXVAoYCC8S9kByua0kXXA",
  cues: ["a", "an", "the"],
  instructions:
    "Rewrite the sentence. Fill in the blank with one of these articles: a, an, the. If no article is needed, remove the blank.\n<br/><br/>\nCompleta el espacio en blanco con una de estas palabras: a, an, the. Si no se necesita ninguna palabra, quite el espacio en blanco.",
  prompt: "I have ___ friend named Marco who loves ___ football.",
  key: "-Ke_6gyGVXuHiealUgD3",
  attempts: [],
}

export const fillInBlankQuestionBlankNotAllowed = {
  blankAllowed: false,
  conceptID: "fJXVAoYCC8S9kByua0kXXA",
  cues: ["a", "an", "the"],
  instructions:
    "Rewrite the sentence. Fill in the blank with one of these articles: a, an, the. If no article is needed, remove the blank.\n<br/><br/>\nCompleta el espacio en blanco con una de estas palabras: a, an, the. Si no se necesita ninguna palabra, quite el espacio en blanco.",
  prompt: "I have ___ friend named Marco who loves ___ football.",
  key: "-Ke_6gyGVXuHiealUgD3",
  attempts: [],
}
