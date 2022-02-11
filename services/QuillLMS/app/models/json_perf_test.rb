# frozen_string_literal: true

class JsonPerfTest < ApplicationRecord
  PAYLOAD = {
    "active_activity_session": {
      "answeredQuestions": [
        {
          "question": "-LVcu0oKdFmzrhvnq0hC",
          "attempts": [
            {
              "response": {
                "text": "My favorite coffee cup's handle got chipped.",
                "question_uid": "-LVcu0oKdFmzrhvnq0hC",
                "count": 231450,
                "concept_results": [
                  {
                    "conceptUID": "juG67j5ILKeg8ZX0Dh2m7A",
                    "correct": false
                  }
                ],
                "id": 11731055,
                "author": "",
                "feedback": "<p>That&#x27;s a great sentence!</p>",
                "first_attempt_count": 1,
                "child_count": 11655,
                "optimal": true,
                "weak": false,
                "created_at": "2019-01-07T15:22:07.038Z",
                "updated_at": "2022-02-10T03:29:54.613Z",
                "spelling_error": false,
                "conceptResults": {
                  "juG67j5ILKeg8ZX0Dh2m7A": {
                    "conceptUID": "juG67j5ILKeg8ZX0Dh2m7A",
                    "correct": true
                  }
                },
                "key": "11731055"
              }
            }
          ]
        },
        {
          "question": "-LVcuC5E5Aax2fFT9s25",
          "attempts": [
            {
              "response": {
                "text": "My coat's zipper got stuck.",
                "question_uid": "-LVcuC5E5Aax2fFT9s25",
                "count": 231958,
                "concept_results": [
                  {
                    "conceptUID": "juG67j5ILKeg8ZX0Dh2m7A",
                    "correct": false
                  }
                ],
                "id": 11731137,
                "author": "",
                "feedback": "<p>That&#x27;s a strong sentence!</p>",
                "first_attempt_count": 2,
                "child_count": 4771,
                "optimal": true,
                "weak": false,
                "created_at": "2019-01-07T15:22:53.256Z",
                "updated_at": "2022-02-10T03:30:04.947Z",
                "spelling_error": false,
                "conceptResults": {
                  "nAcT-C3UfPFuhWcf0JJNMw": {
                    "conceptUID": "nAcT-C3UfPFuhWcf0JJNMw",
                    "correct": true
                  }
                },
                "key": "11731137"
              }
            }
          ]
        },
        {
          "question": "-LVcuQkN3FDmPW1Aqi5B",
          "attempts": [
            {
              "response": {
                "text": "There are three coats in the lost-and-found bin.",
                "question_uid": "-LVcuQkN3FDmPW1Aqi5B",
                "count": 230946,
                "concept_results": [
                  {
                    "conceptUID": "juG67j5ILKeg8ZX0Dh2m7A",
                    "correct": false
                  }
                ],
                "id": 11731260,
                "author": "",
                "feedback": "<p>That&#x27;s a strong sentence!</p>",
                "first_attempt_count": 0,
                "child_count": 2312,
                "optimal": true,
                "weak": false,
                "created_at": "2019-01-07T15:23:53.327Z",
                "updated_at": "2022-02-10T03:30:14.454Z",
                "spelling_error": false,
                "conceptResults": {
                  "juG67j5ILKeg8ZX0Dh2m7A": {
                    "conceptUID": "juG67j5ILKeg8ZX0Dh2m7A",
                    "correct": true
                  }
                },
                "key": "11731260"
              }
            }
          ]
        },
        {
          "question": "-LVcubjbb8TyOM9o-8TQ",
          "attempts": [
            {
              "response": {
                "text": "All the winter coats hoods are lined with fur.",
                "question_uid": "-LVcubjbb8TyOM9o-8TQ",
                "count": 200738,
                "concept_results": [
                  {
                    "conceptUID": "juG67j5ILKeg8ZX0Dh2m7A",
                    "correct": false
                  }
                ],
                "id": 11736869,
                "author": "",
                "feedback": "<p>Revise your work. Use the hint as an example of possessive nouns.</p>",
                "first_attempt_count": 3,
                "child_count": 0,
                "optimal": false,
                "weak": false,
                "created_at": "2019-01-07T16:17:05.134Z",
                "updated_at": "2022-02-10T03:30:24.206Z",
                "spelling_error": false,
                "conceptResults": {
                  "uYwGHRRUNwzvGtFT-64KHQ": {
                    "conceptUID": "uYwGHRRUNwzvGtFT-64KHQ",
                    "correct": false,
                    "key": "uYwGHRRUNwzvGtFT-64KHQ"
                  }
                },
                "key": "11736869"
              }
            },
            {
              "response": {
                "text": "All the winter coats' hoods are lined with fur.",
                "question_uid": "-LVcubjbb8TyOM9o-8TQ",
                "count": 226723,
                "concept_results": [
                  {
                    "conceptUID": "juG67j5ILKeg8ZX0Dh2m7A",
                    "correct": false
                  }
                ],
                "id": 11731362,
                "author": "",
                "feedback": "<p>That&#x27;s a strong sentence!</p>",
                "first_attempt_count": 0,
                "child_count": 1279,
                "optimal": true,
                "weak": false,
                "created_at": "2019-01-07T15:24:42.404Z",
                "updated_at": "2022-02-10T03:30:29.951Z",
                "spelling_error": false,
                "conceptResults": {
                  "uYwGHRRUNwzvGtFT-64KHQ": {
                    "conceptUID": "uYwGHRRUNwzvGtFT-64KHQ",
                    "correct": true
                  }
                },
                "key": "11731362"
              }
            }
          ]
        }
      ],
      "unansweredQuestions": [
        "-LVcuv1qCQf40-oVa97h",
        "-LVcv38-HLXe5ng_UqZt",
        "-LVcvD0uB-wWB4vrm-yQ",
        "-LVcvX57Qm0_359tdlni",
        "-LVcvfriKgfjfP90U3i7"
      ],
      "questionSet": [
        {
          "question": "-LVcu0oKdFmzrhvnq0hC",
          "attempts": []
        },
        {
          "question": "-LVcuC5E5Aax2fFT9s25",
          "attempts": []
        },
        {
          "question": "-LVcuQkN3FDmPW1Aqi5B",
          "attempts": []
        },
        {
          "question": "-LVcubjbb8TyOM9o-8TQ",
          "attempts": []
        },
        {
          "question": "-LVculmqTJqqjE26Cvcz",
          "attempts": []
        },
        "-LVcuv1qCQf40-oVa97h",
        "-LVcv38-HLXe5ng_UqZt",
        "-LVcvD0uB-wWB4vrm-yQ",
        "-LVcvX57Qm0_359tdlni",
        "-LVcvfriKgfjfP90U3i7"
      ],
      "currentQuestion": {
        "question": "-LVculmqTJqqjE26Cvcz",
        "attempts": [
          {
            "response": {
              "text": "I put my mittens in the laundry.",
              "question_uid": "-LVculmqTJqqjE26Cvcz",
              "count": 229287,
              "concept_results": [
                {
                  "conceptUID": "juG67j5ILKeg8ZX0Dh2m7A",
                  "correct": false
                }
              ],
              "id": 11731441,
              "author": "",
              "feedback": "<p>That&#x27;s a strong sentence!</p>",
              "first_attempt_count": 0,
              "child_count": 2712,
              "optimal": true,
              "weak": false,
              "created_at": "2019-01-07T15:25:23.573Z",
              "updated_at": "2022-02-10T03:30:28.324Z",
              "spelling_error": false,
              "conceptResults": {
                "juG67j5ILKeg8ZX0Dh2m7A": {
                  "conceptUID": "juG67j5ILKeg8ZX0Dh2m7A",
                  "correct": true
                }
              },
              "key": "11731441"
            }
          }
        ]
      },
      "timeTracking": {
        "landing": 7932,
        "prompt_1": 35615,
        "prompt_2": 24127,
        "prompt_3": 6563,
        "prompt_4": 13032,
        "prompt_5": 12642
      },
      "updatedAt": 1644547899719
    }
  }
end
