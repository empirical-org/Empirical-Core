const denormalizedSession = {
  "currentQuestion":{
    "uid":"-Jzw0qjQwbyM2twtkmW1",
    "flag":"production",
    "prompt":"\u003cp\u003eThere are more \u003cu\u003ethan / then\u003c/u\u003e 300 million people in the United States.\u003c/p\u003e",
    "answers":[
      {
        "text":"There are more {than} 300 million people in the United States."
      }
    ],
    "attempts":[
      
    ],
    "concept_uid":"OHoxJvIruMUR095tBZWZ7Q",
    "focusPoints":{
      "-LmR-7F8XTaK9qdN1htY":{
        "text":"th[ae]n",
        "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        }
      }
    },
    "instructions":"Rewrite the sentence with the correct underlined word.",
    "rule_description":"\u003cbr/\u003e",
    "incorrectSequences":[
      {
        "text":"(th[ea]n.*){2,}",
        "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "key":"N5VXCdTAs91gP46gATuvPQ",
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"[Tt]hen",
        "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. Use\u003cem\u003e more than\u003c/em\u003e to compare amounts.\u003c/p\u003e",
        "conceptResults":{
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":false,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        }
      },
      {
        "text":"^[Tt]han(\\.)?$",
        "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          },
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":true,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"unit|||stat",
        "feedback":"\u003cp\u003eTry again. Always capitalize the names of countries.\u003c/p\u003e",
        "conceptResults":{
          "YkA1YFe-dUvXqkEXxbNgQw":{
            "name":"Capitalization | Capitalizing Geographic Names | Capitalizing Geographic Names",
            "correct":false,
            "conceptUID":"YkA1YFe-dUvXqkEXxbNgQw"
          }
        }
      }
    ]
  },
  "hasreceiveddata":true,
  "answeredQuestions":[
    {
      "uid":"-Jzw0qjQwbyM2twtkmW7",
      "flag":"production",
      "prompt":"\u003cp\u003eFive is more \u003cu\u003ethan / then\u003c/u\u003e four.\u003c/p\u003e",
      "answers":[
        {
          "text":"Five is more {than} four."
        }
      ],
      "attempts":[
        {
          "id":8856627,
          "text":"Five is more than four.",
          "count":128332,
          "optimal":true,
          "feedback":"\u003cb\u003eWell done!\u003c/b\u003e That's the correct answer.",
          "child_count":25117,
          "question_uid":"-Jzw0qjQwbyM2twtkmW7",
          "conceptResults":{
            "OHoxJvIruMUR095tBZWZ7Q":{
              "correct":true,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          },
          "concept_results":[
            {
              "correct":false,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          ],
          "first_attempt_count":38452
        }
      ],
      "concept_uid":"OHoxJvIruMUR095tBZWZ7Q",
      "focusPoints":{
        "-LmR-RBr0JvsherLP7Ao":{
          "key":"-LmR-RBr0JvsherLP7Ao",
          "text":"th[ae]n",
          "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          }
        }
      },
      "instructions":"Rewrite the sentence with the correct underlined word.",
      "rule_description":"\u003cbr/\u003e",
      "incorrectSequences":[
        {
          "key":"0",
          "text":"(th.*){2,}",
          "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          },
          "caseInsensitive":true
        },
        {
          "key":"1",
          "text":"[Tt]hen",
          "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. Use \u003cem\u003emore than\u003c/em\u003e to compare amounts.\u003c/p\u003e",
          "conceptResults":{
            "OHoxJvIruMUR095tBZWZ7Q":{
              "name":"Commonly Confused Words | Than, Then | Than",
              "correct":false,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          }
        },
        {
          "key":"2",
          "text":"^[Tt]han(\\.)?$",
          "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            },
            "OHoxJvIruMUR095tBZWZ7Q":{
              "name":"Commonly Confused Words | Than, Then | Than",
              "correct":true,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          },
          "caseInsensitive":true
        }
      ]
    },
    {
      "uid":"-Jzw0qjQwbyM2twtkmWB",
      "flag":"production",
      "prompt":"\u003cp\u003eThat was \u003cu\u003ethan / then\u003c/u\u003e; this is now.\u003c/p\u003e",
      "answers":[
        {
          "text":"That was {then}, this is now."
        }
      ],
      "attempts":[
        {
          "id":12871435,
          "text":"That was then; this is now.",
          "count":225896,
          "optimal":true,
          "feedback":"\u003cp\u003e\u003cstrong\u003eWell done!\u003c/strong\u003e That\u0026#x27;s the correct answer.\u003c/p\u003e",
          "child_count":57685,
          "question_uid":"-Jzw0qjQwbyM2twtkmWB",
          "conceptResults":{
            "VuTHlr5mg3wudXOOJQXuNw":{
              "correct":true,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          },
          "concept_results":[
            {
              "correct":false,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          ],
          "first_attempt_count":61023
        }
      ],
      "concept_uid":"VuTHlr5mg3wudXOOJQXuNw",
      "focusPoints":{
        "-LrJqK8yVGb-rpjuxLvb":{
          "key":"-LrJqK8yVGb-rpjuxLvb",
          "text":"th[ae]n",
          "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          }
        }
      },
      "instructions":"Rewrite the sentence with the correct underlined word.",
      "rule_description":"\u003cbr/\u003e",
      "incorrectSequences":[
        {
          "key":"0",
          "text":"(th[ae]n.*){2,}",
          "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          },
          "caseInsensitive":true
        },
        {
          "key":"1",
          "text":"[Tt]han",
          "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethan\u003c/em\u003e to compare things. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. \u003c/p\u003e",
          "conceptResults":{
            "VuTHlr5mg3wudXOOJQXuNw":{
              "name":"Commonly Confused Words | Than, Then | Then",
              "correct":false,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          }
        },
        {
          "key":"2",
          "text":"^[Tt]hen(\\.)?$",
          "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            },
            "VuTHlr5mg3wudXOOJQXuNw":{
              "name":"Commonly Confused Words | Than, Then | Then",
              "correct":true,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          },
          "caseInsensitive":true
        },
        {
          "key":"3",
          "text":"then( )?(,|\\.)?( )?[Tt]his",
          "feedback":"\u003cp\u003eGood work! Now use a semicolon to join the ideas.\u003c/p\u003e",
          "conceptResults":{
            "BUyy_3YljKsm3xJhNk4Olg":{
              "name":"Punctuation | Semicolons  | Separating Clauses with Semicolons",
              "correct":false,
              "conceptUID":"BUyy_3YljKsm3xJhNk4Olg"
            }
          }
        },
        {
          "key":"4",
          "text":"then;this",
          "feedback":"\u003cp\u003eCheck your spacing. Always put a space after a semicolon.\u003c/p\u003e",
          "conceptResults":{
            "jaUtRoHeqvvNhiEBOhjvhg":{
              "name":"Punctuation | Spaces with Punctuation | Spaces with Punctuation",
              "correct":false,
              "conceptUID":"jaUtRoHeqvvNhiEBOhjvhg"
            }
          }
        }
      ]
    }
  ],
  "unansweredQuestions":[
    {
      "uid":"-Jzw0qjQwbyM2twtkmWA",
      "flag":"production",
      "prompt":"\u003cp\u003eIf you finish your dinner, \u003cu\u003ethan / then\u003c/u\u003e you can have dessert.\u003c/p\u003e",
      "answers":[
        {
          "text":"If you finish your dinner, {then} you can have dessert."
        }
      ],
      "concept_uid":"VuTHlr5mg3wudXOOJQXuNw",
      "focusPoints":{
        "-LrJq37Ad2IlGGTzlheL":{
          "text":"th[ae]n",
          "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          }
        }
      },
      "instructions":"Rewrite the sentence with the correct underlined word.",
      "rule_description":"\u003cbr/\u003e",
      "incorrectSequences":[
        {
          "text":"(th.*){2,}",
          "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          },
          "caseInsensitive":true
        },
        {
          "text":"[Tt]han",
          "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethan\u003c/em\u003e to compare things. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. \u003c/p\u003e",
          "conceptResults":{
            "VuTHlr5mg3wudXOOJQXuNw":{
              "name":"Commonly Confused Words | Than, Then | Then",
              "correct":false,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          }
        },
        {
          "text":"^[Tt]hen(\\.)?$",
          "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            },
            "VuTHlr5mg3wudXOOJQXuNw":{
              "name":"Commonly Confused Words | Than, Then | Then",
              "correct":true,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          },
          "caseInsensitive":true
        },
        {
          "text":"desert",
          "feedback":"\u003cp\u003eTry again. Use \u003cem\u003edesert\u003c/em\u003e to talk about the place. Use \u003cem\u003edessert\u003c/em\u003e to talk about a sweet treat.\u003c/p\u003e",
          "conceptResults":{
            "H-2lrblngQAQ8_s-ctye4g":{
              "name":"Spelling | Spelling | Spelling",
              "correct":false,
              "conceptUID":"H-2lrblngQAQ8_s-ctye4g"
            }
          }
        },
        {
          "text":"^[Ii]f yo\u0026\u0026ner [Tt]hen y",
          "feedback":"\u003cp\u003eGood work! Now add a missing period.\u003c/p\u003e",
          "conceptResults":{
            "Q8FfGSv4Z9L2r1CYOfvO9A":{
              "name":"Conjunctions | Subordinating Conjunctions | Subordinating Conjunction at the Beginning of a Sentence",
              "correct":false,
              "conceptUID":"Q8FfGSv4Z9L2r1CYOfvO9A"
            }
          }
        },
        {
          "text":"er the",
          "feedback":"\u003cp\u003eTry again. Don\u0026#x27;t forget to add a comma.\u003c/p\u003e",
          "conceptResults":{
            "mdFUuuNR7N352bbMw4Mj9Q":{
              "name":"Punctuation | Punctuation | Punctuation",
              "correct":false,
              "conceptUID":"mdFUuuNR7N352bbMw4Mj9Q"
            }
          },
          "caseInsensitive":true
        }
      ]
    },
    {
      "uid":"-Jzw0qjQwbyM2twtkmW6",
      "flag":"production",
      "prompt":"\u003cp\u003eI would rather have fun \u003cu\u003ethan / then\u003c/u\u003e be bored.\u003c/p\u003e",
      "answers":[
        {
          "text":"I would rather have fun {than} be bored."
        }
      ],
      "concept_uid":"OHoxJvIruMUR095tBZWZ7Q",
      "focusPoints":{
        "-LmR-Nv0u5PSCwHDz8O7":{
          "text":"th[ae]n",
          "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          }
        }
      },
      "instructions":"Rewrite the sentence with the correct underlined word.",
      "rule_description":"\u003cbr/\u003e",
      "incorrectSequences":[
        {
          "text":"(th[ae]n.*){2,}",
          "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          },
          "caseInsensitive":true
        },
        {
          "text":"[Tt]hen",
          "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. Use \u003cem\u003ethan\u003c/em\u003e to compare things, like having fun and being bored.\u003c/p\u003e",
          "conceptResults":{
            "OHoxJvIruMUR095tBZWZ7Q":{
              "name":"Commonly Confused Words | Than, Then | Than",
              "correct":false,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          }
        },
        {
          "text":"^[Tt]han(\\.)?$",
          "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            },
            "OHoxJvIruMUR095tBZWZ7Q":{
              "name":"Commonly Confused Words | Than, Then | Than",
              "correct":true,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          },
          "caseInsensitive":true
        }
      ]
    },
    {
      "uid":"-Jzw0qjQwbyM2twtkmWC",
      "flag":"production",
      "prompt":"\u003cp\u003eThere was nice weather for a while, but \u003cu\u003ethan / then\u003c/u\u003e a storm came.\u003c/p\u003e",
      "answers":[
        {
          "text":"There was nice weather for a while, but {then} a storm came."
        }
      ],
      "concept_uid":"VuTHlr5mg3wudXOOJQXuNw",
      "focusPoints":{
        "-LrJqQh-q3l7DHOB8bUv":{
          "text":"th[ae]n",
          "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          }
        }
      },
      "instructions":"Rewrite the sentence with the correct underlined word.",
      "rule_description":"\u003cbr/\u003e",
      "incorrectSequences":[
        {
          "text":"(th.*){2,}",
          "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          },
          "caseInsensitive":true
        },
        {
          "text":"[Tt]han",
          "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethan\u003c/em\u003e to compare things. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. \u003c/p\u003e",
          "conceptResults":{
            "VuTHlr5mg3wudXOOJQXuNw":{
              "name":"Commonly Confused Words | Than, Then | Then",
              "correct":false,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          }
        },
        {
          "text":"^[Tt]hen(\\.)?$",
          "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            },
            "VuTHlr5mg3wudXOOJQXuNw":{
              "name":"Commonly Confused Words | Than, Then | Then",
              "correct":true,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          },
          "caseInsensitive":true
        },
        {
          "text":"hile but then",
          "feedback":"\u003cp\u003eGood work! Now remember to use a comma before \u003cem\u003ebut\u003c/em\u003e when it joins two complete sentences.\u003c/p\u003e",
          "conceptResults":{
            "GiUZ6KPkH958AT8S413nJg":{
              "name":"Conjunctions | Coordinating Conjunctions | Comma Before Coordinating Conjunctions",
              "correct":false,
              "conceptUID":"GiUZ6KPkH958AT8S413nJg"
            }
          }
        },
        {
          "text":"ut( )?,",
          "feedback":"\u003cp\u003eTry again. Check the placement of your comma.\u003c/p\u003e",
          "conceptResults":{
            "GiUZ6KPkH958AT8S413nJg":{
              "name":"Conjunctions | Coordinating Conjunctions | Comma Before Coordinating Conjunctions",
              "correct":false,
              "conceptUID":"GiUZ6KPkH958AT8S413nJg"
            }
          },
          "caseInsensitive":true
        },
        {
          "text":"awhile",
          "feedback":"\u003cp\u003eCheck your spacing. \u003cem\u003eA while\u003c/em\u003e is two words.\u003c/p\u003e",
          "conceptResults":{
            "5Yv4-kNHwwCO2p8HI90oqQ":{
              "name":"Spacing | Spacing | Spacing",
              "correct":false,
              "conceptUID":"5Yv4-kNHwwCO2p8HI90oqQ"
            }
          }
        }
      ]
    },
    {
      "uid":"-Jzw0qjQwbyM2twtkmW2",
      "flag":"production",
      "prompt":"\u003cp\u003eHer speakers are much louder \u003cu\u003ethan / then\u003c/u\u003e mine.\u003c/p\u003e",
      "answers":[
        {
          "text":"Her speakers are much louder {than} mine."
        }
      ],
      "concept_uid":"OHoxJvIruMUR095tBZWZ7Q",
      "focusPoints":{
        "-LmQzyTF9UF5XxewPNYC":{
          "text":"th[ae]",
          "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          }
        }
      },
      "instructions":"Rewrite the sentence with the correct underlined word.",
      "rule_description":"\u003cbr/\u003e",
      "incorrectSequences":[
        {
          "text":"(th.*){2,}",
          "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            }
          },
          "caseInsensitive":true
        },
        {
          "text":"[Tt]hen",
          "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. Use \u003cem\u003ethan\u003c/em\u003e to compare things, like how loud her speakers are and how loud mine are.\u003c/p\u003e",
          "conceptResults":{
            "OHoxJvIruMUR095tBZWZ7Q":{
              "name":"Commonly Confused Words | Than, Then | Than",
              "correct":false,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          }
        },
        {
          "text":"^[Tt]han(\\.)?$",
          "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
          "conceptResults":{
            "N5VXCdTAs91gP46gATuvPQ":{
              "name":"Structure | Sentence Quality | Including Details From Prompt",
              "correct":false,
              "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
            },
            "OHoxJvIruMUR095tBZWZ7Q":{
              "name":"Commonly Confused Words | Than, Then | Than",
              "correct":true,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          },
          "caseInsensitive":true
        }
      ]
    }
  ]
}

const normalizedSession = {
  "currentQuestion":{
    "question":"-Jzw0qjQwbyM2twtkmW1",
    "attempts":[]
  },
  "hasreceiveddata":true,
  "answeredQuestions":[
    {
      "question":"-Jzw0qjQwbyM2twtkmW7",
      "attempts":[
        {
          "id":8856627,
          "text":"Five is more than four.",
          "count":128332,
          "optimal":true,
          "feedback":"\u003cb\u003eWell done!\u003c/b\u003e That's the correct answer.",
          "child_count":25117,
          "question_uid":"-Jzw0qjQwbyM2twtkmW7",
          "conceptResults":{
            "OHoxJvIruMUR095tBZWZ7Q":{
              "correct":true,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          },
          "concept_results":[
            {
              "correct":false,
              "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
            }
          ],
          "first_attempt_count":38452
        }
      ]
    },
    {
      "question":"-Jzw0qjQwbyM2twtkmWB",
      "attempts":[
        {
          "id":12871435,
          "text":"That was then; this is now.",
          "count":225896,
          "optimal":true,
          "feedback":"\u003cp\u003e\u003cstrong\u003eWell done!\u003c/strong\u003e That\u0026#x27;s the correct answer.\u003c/p\u003e",
          "child_count":57685,
          "question_uid":"-Jzw0qjQwbyM2twtkmWB",
          "conceptResults":{
            "VuTHlr5mg3wudXOOJQXuNw":{
              "correct":true,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          },
          "concept_results":[
            {
              "correct":false,
              "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
            }
          ],
          "first_attempt_count":61023
        }
      ]
    }
  ],
  "unansweredQuestions":[
    "-Jzw0qjQwbyM2twtkmWA",
    "-Jzw0qjQwbyM2twtkmW6",
    "-Jzw0qjQwbyM2twtkmWC",
    "-Jzw0qjQwbyM2twtkmW2"
  ]
}

const mockQuestions = {
  "-Jzw0qjQwbyM2twtkmW1": {
    "uid":"-Jzw0qjQwbyM2twtkmW1",
    "flag":"production",
    "prompt":"\u003cp\u003eThere are more \u003cu\u003ethan / then\u003c/u\u003e 300 million people in the United States.\u003c/p\u003e",
    "answers":[
      {
        "text":"There are more {than} 300 million people in the United States."
      }
    ],
    "attempts":[
      
    ],
    "concept_uid":"OHoxJvIruMUR095tBZWZ7Q",
    "focusPoints":{
      "-LmR-7F8XTaK9qdN1htY":{
        "text":"th[ae]n",
        "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        }
      }
    },
    "instructions":"Rewrite the sentence with the correct underlined word.",
    "rule_description":"\u003cbr/\u003e",
    "incorrectSequences":[
      {
        "text":"(th[ea]n.*){2,}",
        "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "key":"N5VXCdTAs91gP46gATuvPQ",
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"[Tt]hen",
        "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. Use\u003cem\u003e more than\u003c/em\u003e to compare amounts.\u003c/p\u003e",
        "conceptResults":{
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":false,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        }
      },
      {
        "text":"^[Tt]han(\\.)?$",
        "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          },
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":true,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"unit|||stat",
        "feedback":"\u003cp\u003eTry again. Always capitalize the names of countries.\u003c/p\u003e",
        "conceptResults":{
          "YkA1YFe-dUvXqkEXxbNgQw":{
            "name":"Capitalization | Capitalizing Geographic Names | Capitalizing Geographic Names",
            "correct":false,
            "conceptUID":"YkA1YFe-dUvXqkEXxbNgQw"
          }
        }
      }
    ]
  },
  "-Jzw0qjQwbyM2twtkmW7": {
    "uid":"-Jzw0qjQwbyM2twtkmW7",
    "flag":"production",
    "prompt":"\u003cp\u003eFive is more \u003cu\u003ethan / then\u003c/u\u003e four.\u003c/p\u003e",
    "answers":[
      {
        "text":"Five is more {than} four."
      }
    ],
    "attempts":[
      {
        "id":8856627,
        "text":"Five is more than four.",
        "count":128332,
        "optimal":true,
        "feedback":"\u003cb\u003eWell done!\u003c/b\u003e That's the correct answer.",
        "child_count":25117,
        "question_uid":"-Jzw0qjQwbyM2twtkmW7",
        "conceptResults":{
          "OHoxJvIruMUR095tBZWZ7Q":{
            "correct":true,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        },
        "concept_results":[
          {
            "correct":false,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        ],
        "first_attempt_count":38452
      }
    ],
    "concept_uid":"OHoxJvIruMUR095tBZWZ7Q",
    "focusPoints":{
      "-LmR-RBr0JvsherLP7Ao":{
        "key":"-LmR-RBr0JvsherLP7Ao",
        "text":"th[ae]n",
        "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        }
      }
    },
    "instructions":"Rewrite the sentence with the correct underlined word.",
    "rule_description":"\u003cbr/\u003e",
    "incorrectSequences":[
      {
        "key":"0",
        "text":"(th.*){2,}",
        "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        },
        "caseInsensitive":true
      },
      {
        "key":"1",
        "text":"[Tt]hen",
        "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. Use \u003cem\u003emore than\u003c/em\u003e to compare amounts.\u003c/p\u003e",
        "conceptResults":{
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":false,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        }
      },
      {
        "key":"2",
        "text":"^[Tt]han(\\.)?$",
        "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          },
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":true,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        },
        "caseInsensitive":true
      }
    ]
  },
  "-Jzw0qjQwbyM2twtkmWB": {
    "uid":"-Jzw0qjQwbyM2twtkmWB",
    "flag":"production",
    "prompt":"\u003cp\u003eThat was \u003cu\u003ethan / then\u003c/u\u003e; this is now.\u003c/p\u003e",
    "answers":[
      {
        "text":"That was {then}, this is now."
      }
    ],
    "attempts":[
      {
        "id":12871435,
        "text":"That was then; this is now.",
        "count":225896,
        "optimal":true,
        "feedback":"\u003cp\u003e\u003cstrong\u003eWell done!\u003c/strong\u003e That\u0026#x27;s the correct answer.\u003c/p\u003e",
        "child_count":57685,
        "question_uid":"-Jzw0qjQwbyM2twtkmWB",
        "conceptResults":{
          "VuTHlr5mg3wudXOOJQXuNw":{
            "correct":true,
            "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
          }
        },
        "concept_results":[
          {
            "correct":false,
            "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
          }
        ],
        "first_attempt_count":61023
      }
    ],
    "concept_uid":"VuTHlr5mg3wudXOOJQXuNw",
    "focusPoints":{
      "-LrJqK8yVGb-rpjuxLvb":{
        "key":"-LrJqK8yVGb-rpjuxLvb",
        "text":"th[ae]n",
        "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        }
      }
    },
    "instructions":"Rewrite the sentence with the correct underlined word.",
    "rule_description":"\u003cbr/\u003e",
    "incorrectSequences":[
      {
        "key":"0",
        "text":"(th[ae]n.*){2,}",
        "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        },
        "caseInsensitive":true
      },
      {
        "key":"1",
        "text":"[Tt]han",
        "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethan\u003c/em\u003e to compare things. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. \u003c/p\u003e",
        "conceptResults":{
          "VuTHlr5mg3wudXOOJQXuNw":{
            "name":"Commonly Confused Words | Than, Then | Then",
            "correct":false,
            "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
          }
        }
      },
      {
        "key":"2",
        "text":"^[Tt]hen(\\.)?$",
        "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          },
          "VuTHlr5mg3wudXOOJQXuNw":{
            "name":"Commonly Confused Words | Than, Then | Then",
            "correct":true,
            "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
          }
        },
        "caseInsensitive":true
      },
      {
        "key":"3",
        "text":"then( )?(,|\\.)?( )?[Tt]his",
        "feedback":"\u003cp\u003eGood work! Now use a semicolon to join the ideas.\u003c/p\u003e",
        "conceptResults":{
          "BUyy_3YljKsm3xJhNk4Olg":{
            "name":"Punctuation | Semicolons  | Separating Clauses with Semicolons",
            "correct":false,
            "conceptUID":"BUyy_3YljKsm3xJhNk4Olg"
          }
        }
      },
      {
        "key":"4",
        "text":"then;this",
        "feedback":"\u003cp\u003eCheck your spacing. Always put a space after a semicolon.\u003c/p\u003e",
        "conceptResults":{
          "jaUtRoHeqvvNhiEBOhjvhg":{
            "name":"Punctuation | Spaces with Punctuation | Spaces with Punctuation",
            "correct":false,
            "conceptUID":"jaUtRoHeqvvNhiEBOhjvhg"
          }
        }
      }
    ]
  },
  "-Jzw0qjQwbyM2twtkmWA": {
    "uid":"-Jzw0qjQwbyM2twtkmWA",
    "flag":"production",
    "prompt":"\u003cp\u003eIf you finish your dinner, \u003cu\u003ethan / then\u003c/u\u003e you can have dessert.\u003c/p\u003e",
    "answers":[
      {
        "text":"If you finish your dinner, {then} you can have dessert."
      }
    ],
    "concept_uid":"VuTHlr5mg3wudXOOJQXuNw",
    "focusPoints":{
      "-LrJq37Ad2IlGGTzlheL":{
        "text":"th[ae]n",
        "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        }
      }
    },
    "instructions":"Rewrite the sentence with the correct underlined word.",
    "rule_description":"\u003cbr/\u003e",
    "incorrectSequences":[
      {
        "text":"(th.*){2,}",
        "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"[Tt]han",
        "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethan\u003c/em\u003e to compare things. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. \u003c/p\u003e",
        "conceptResults":{
          "VuTHlr5mg3wudXOOJQXuNw":{
            "name":"Commonly Confused Words | Than, Then | Then",
            "correct":false,
            "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
          }
        }
      },
      {
        "text":"^[Tt]hen(\\.)?$",
        "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          },
          "VuTHlr5mg3wudXOOJQXuNw":{
            "name":"Commonly Confused Words | Than, Then | Then",
            "correct":true,
            "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"desert",
        "feedback":"\u003cp\u003eTry again. Use \u003cem\u003edesert\u003c/em\u003e to talk about the place. Use \u003cem\u003edessert\u003c/em\u003e to talk about a sweet treat.\u003c/p\u003e",
        "conceptResults":{
          "H-2lrblngQAQ8_s-ctye4g":{
            "name":"Spelling | Spelling | Spelling",
            "correct":false,
            "conceptUID":"H-2lrblngQAQ8_s-ctye4g"
          }
        }
      },
      {
        "text":"^[Ii]f yo\u0026\u0026ner [Tt]hen y",
        "feedback":"\u003cp\u003eGood work! Now add a missing period.\u003c/p\u003e",
        "conceptResults":{
          "Q8FfGSv4Z9L2r1CYOfvO9A":{
            "name":"Conjunctions | Subordinating Conjunctions | Subordinating Conjunction at the Beginning of a Sentence",
            "correct":false,
            "conceptUID":"Q8FfGSv4Z9L2r1CYOfvO9A"
          }
        }
      },
      {
        "text":"er the",
        "feedback":"\u003cp\u003eTry again. Don\u0026#x27;t forget to add a comma.\u003c/p\u003e",
        "conceptResults":{
          "mdFUuuNR7N352bbMw4Mj9Q":{
            "name":"Punctuation | Punctuation | Punctuation",
            "correct":false,
            "conceptUID":"mdFUuuNR7N352bbMw4Mj9Q"
          }
        },
        "caseInsensitive":true
      }
    ]
  },
  "-Jzw0qjQwbyM2twtkmW6": {
    "uid":"-Jzw0qjQwbyM2twtkmW6",
    "flag":"production",
    "prompt":"\u003cp\u003eI would rather have fun \u003cu\u003ethan / then\u003c/u\u003e be bored.\u003c/p\u003e",
    "answers":[
      {
        "text":"I would rather have fun {than} be bored."
      }
    ],
    "concept_uid":"OHoxJvIruMUR095tBZWZ7Q",
    "focusPoints":{
      "-LmR-Nv0u5PSCwHDz8O7":{
        "text":"th[ae]n",
        "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        }
      }
    },
    "instructions":"Rewrite the sentence with the correct underlined word.",
    "rule_description":"\u003cbr/\u003e",
    "incorrectSequences":[
      {
        "text":"(th[ae]n.*){2,}",
        "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"[Tt]hen",
        "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. Use \u003cem\u003ethan\u003c/em\u003e to compare things, like having fun and being bored.\u003c/p\u003e",
        "conceptResults":{
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":false,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        }
      },
      {
        "text":"^[Tt]han(\\.)?$",
        "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          },
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":true,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        },
        "caseInsensitive":true
      }
    ]
  },
  "-Jzw0qjQwbyM2twtkmWC": {
    "uid":"-Jzw0qjQwbyM2twtkmWC",
    "flag":"production",
    "prompt":"\u003cp\u003eThere was nice weather for a while, but \u003cu\u003ethan / then\u003c/u\u003e a storm came.\u003c/p\u003e",
    "answers":[
      {
        "text":"There was nice weather for a while, but {then} a storm came."
      }
    ],
    "concept_uid":"VuTHlr5mg3wudXOOJQXuNw",
    "focusPoints":{
      "-LrJqQh-q3l7DHOB8bUv":{
        "text":"th[ae]n",
        "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        }
      }
    },
    "instructions":"Rewrite the sentence with the correct underlined word.",
    "rule_description":"\u003cbr/\u003e",
    "incorrectSequences":[
      {
        "text":"(th.*){2,}",
        "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"[Tt]han",
        "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethan\u003c/em\u003e to compare things. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. \u003c/p\u003e",
        "conceptResults":{
          "VuTHlr5mg3wudXOOJQXuNw":{
            "name":"Commonly Confused Words | Than, Then | Then",
            "correct":false,
            "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
          }
        }
      },
      {
        "text":"^[Tt]hen(\\.)?$",
        "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          },
          "VuTHlr5mg3wudXOOJQXuNw":{
            "name":"Commonly Confused Words | Than, Then | Then",
            "correct":true,
            "conceptUID":"VuTHlr5mg3wudXOOJQXuNw"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"hile but then",
        "feedback":"\u003cp\u003eGood work! Now remember to use a comma before \u003cem\u003ebut\u003c/em\u003e when it joins two complete sentences.\u003c/p\u003e",
        "conceptResults":{
          "GiUZ6KPkH958AT8S413nJg":{
            "name":"Conjunctions | Coordinating Conjunctions | Comma Before Coordinating Conjunctions",
            "correct":false,
            "conceptUID":"GiUZ6KPkH958AT8S413nJg"
          }
        }
      },
      {
        "text":"ut( )?,",
        "feedback":"\u003cp\u003eTry again. Check the placement of your comma.\u003c/p\u003e",
        "conceptResults":{
          "GiUZ6KPkH958AT8S413nJg":{
            "name":"Conjunctions | Coordinating Conjunctions | Comma Before Coordinating Conjunctions",
            "correct":false,
            "conceptUID":"GiUZ6KPkH958AT8S413nJg"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"awhile",
        "feedback":"\u003cp\u003eCheck your spacing. \u003cem\u003eA while\u003c/em\u003e is two words.\u003c/p\u003e",
        "conceptResults":{
          "5Yv4-kNHwwCO2p8HI90oqQ":{
            "name":"Spacing | Spacing | Spacing",
            "correct":false,
            "conceptUID":"5Yv4-kNHwwCO2p8HI90oqQ"
          }
        }
      }
    ]
  },
  "-Jzw0qjQwbyM2twtkmW2": {
    "uid":"-Jzw0qjQwbyM2twtkmW2",
    "flag":"production",
    "prompt":"\u003cp\u003eHer speakers are much louder \u003cu\u003ethan / then\u003c/u\u003e mine.\u003c/p\u003e",
    "answers":[
      {
        "text":"Her speakers are much louder {than} mine."
      }
    ],
    "concept_uid":"OHoxJvIruMUR095tBZWZ7Q",
    "focusPoints":{
      "-LmQzyTF9UF5XxewPNYC":{
        "text":"th[ae]",
        "feedback":"\u003cp\u003eTry again. Rewrite your sentence with one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        }
      }
    },
    "instructions":"Rewrite the sentence with the correct underlined word.",
    "rule_description":"\u003cbr/\u003e",
    "incorrectSequences":[
      {
        "text":"(th.*){2,}",
        "feedback":"\u003cp\u003eTry again. Use only one of the underlined words from the prompt.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          }
        },
        "caseInsensitive":true
      },
      {
        "text":"[Tt]hen",
        "feedback":"\u003cp\u003eTry again. Use \u003cem\u003ethen\u003c/em\u003e to talk about the timing of events. Use \u003cem\u003ethan\u003c/em\u003e to compare things, like how loud her speakers are and how loud mine are.\u003c/p\u003e",
        "conceptResults":{
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":false,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        }
      },
      {
        "text":"^[Tt]han(\\.)?$",
        "feedback":"\u003cp\u003eGood work! Now write the whole sentence.\u003c/p\u003e",
        "conceptResults":{
          "N5VXCdTAs91gP46gATuvPQ":{
            "name":"Structure | Sentence Quality | Including Details From Prompt",
            "correct":false,
            "conceptUID":"N5VXCdTAs91gP46gATuvPQ"
          },
          "OHoxJvIruMUR095tBZWZ7Q":{
            "name":"Commonly Confused Words | Than, Then | Than",
            "correct":true,
            "conceptUID":"OHoxJvIruMUR095tBZWZ7Q"
          }
        },
        "caseInsensitive":true
      }
    ]
  }
}

export {
  denormalizedSession,
  normalizedSession,
  mockQuestions
}
