# frozen_string_literal: true

namespace :recommendations do
  desc 'create from hardcode'
  task :create_ind => :environment do
    activities = {
      '413' => [
        {
          recommendation: 'Compound Subjects, Objects, and Predicates',
          activityPackId: 24,
          requirements: [
            {
              concept_id: 'Jl4ByYtUfo4VhIKpMt23yA',
              count: 1
            },
            {
              concept_id: 'QNkNRs8zbCXU7nLBeo4mgA',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Adjectives',
          activityPackId: 23,
          requirements: [
            {
              concept_id: 'oCQCO1_eVXQ2zqw_7QOuBw',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Adverbs of Manner',
          activityPackId: 25,
          requirements: [
            {
              concept_id: 'GZ04vHSTxWUTzhWMGfwcUQ',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Compound Sentences',
          activityPackId: 22,
          requirements: [
            {
              concept_id: 'GiUZ6KPkH958AT8S413nJg',
              count: 2
            },
            {
              concept_id: 'Qqn6Td-zR6NIAX43NOHoCg',
              count: 1
            },
            {
              concept_id: 'hJKqVOkQQQgfEsmzOWC1xw',
              count: 1
            },
            {
              concept_id: 'tSSLMHqX0q-9mKTJHSyung',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Complex Sentences',
          activityPackId: 21,
          requirements: [
            {
              concept_id: 'nb0JW1r5pRB5ouwAzTgMbQ',
              count: 2
            },
            {
              concept_id: 'Q8FfGSv4Z9L2r1CYOfvO9A',
              count: 2
            },
            {
              concept_id: 'S8b-N3ZrB50CWgxD5yg8yQ',
              count: 1
            },
            {
              concept_id: '7H2IMZvq0VJ4Uvftyrw7Eg',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Appositives and Modifying Phrases',
          activityPackId: 27,
          requirements: [
            {
              concept_id: 'InfGdB6Plr2M930kqsn63g',
              count: 1
            },
            {
              concept_id: 'GLjAExmqZShBTZ7DQGvVLw',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Parallel Structure',
          activityPackId: 29,
          requirements: [
            {
              concept_id: '1ohLyApTz7lZ3JszrA98Xg',
              count: 1
            }
          ]
        }
      ],
      '447' => [
        {
          recommendation: 'Articles',
          activityPackId: 2,
          requirements: [
            {
              concept_id: 'fJXVAoYCC8S9kByua0kXXA',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'XHUbxx87N7TK1F-tiaNy-A',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: '5s-r1281DV8EpHyc9qJfiw',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'QsC1lua0t41_J2em_c7kUA',
              count: 0,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Verb Tense',
          activityPackId: 10,
          requirements: [
            {
              concept_id: 'TE-ElKaRWWumTrmVE4-m6g',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'RPNqOZuka_n8RESKbBF8OQ',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: '9ZPpieSHhlMYQkEvrhQP1w',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'YeioybAcmeBNsp3KRb9aow',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: '1mXma17dtAL7NGmJRU80bQ',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'TPm4a19NUn2RlKLCbPbVUw',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'I5Si4ZxILjjDR077WgSZ6w',
              count: 0,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Prepositions',
          activityPackId: 7,
          requirements: [
            {
              concept_id: "LPMBB_M5hooC263qXFc_Yg",
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: "lD5FBHF-FEPpsFG0SXlcfQ",
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: "FZ0wa0oqQ-6ELHf1gzVJjw",
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: "wpzl6e2NhXcBaKDC11K4NA",
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: "iY2_MBNxcVgzH3xmnyeEJA",
              count: 0,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Adjectives',
          activityPackId: 23,
          requirements: [
            {
              concept_id: 'o1yvrCpaYu0r-jqogv7PBw',
              count: 1,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Adverbs',
          activityPackId: 25,
          requirements: [
            {
              concept_id: 'GZ04vHSTxWUTzhWMGfwcUQ',
              count: 1,
              noIncorrect: true
            },
            {
              concept_id: 'opY7bPUsNUMBk3FFhZ0wog',
              count: 0,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Subject Verb Agreement',
          activityPackId: 24,
          requirements: [
            {
              concept_id: 'Jl4ByYtUfo4VhIKpMt23yA',
              count: 1,
              noIncorrect: true
            },
            {
              concept_id: 'Tlhrx6Igxn6cR_SD1U5efA',
              count: 0,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Compound Sentences',
          activityPackId: 22,
          requirements: [
            {
              concept_id: 'tSSLMHqX0q-9mKTJHSyung',
              count: 1,
              noIncorrect: true
            },
            {
              concept_id: 'R3sBcYAvoXP2_oNVXiA98g',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'GiUZ6KPkH958AT8S413nJg',
              count: 1,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Complex Sentences',
          activityPackId: 21,
          requirements: [
            {
              concept_id: '7H2IMZvq0VJ4Uvftyrw7Eg',
              count: 1,
              noIncorrect: true
            },
            {
              concept_id: '6gQZPREURQQAaSzpIt_EEw',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'nb0JW1r5pRB5ouwAzTgMbQ',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'Q8FfGSv4Z9L2r1CYOfvO9A',
              count: 0,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Capitalization',
          activityPackId: 33,
          requirements: [
            {
              concept_id: '66upe3S5uvqxuHoHOt4PcQ',
              count: 0,
              noIncorrect: true
            }
          ]
        },
      ],
      '602' => [
        {
          recommendation: 'Compound Subjects, Objects, and Predicates',
          activityPackId: 24,
          requirements: [
            {
              concept_id: 'Jl4ByYtUfo4VhIKpMt23yA',
              count: 1
            },
            {
              concept_id: 'QNkNRs8zbCXU7nLBeo4mgA',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Adjectives',
          activityPackId: 23,
          requirements: [
            {
              concept_id: 'oCQCO1_eVXQ2zqw_7QOuBw',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Adverbs of Manner',
          activityPackId: 25,
          requirements: [
            {
              concept_id: 'GZ04vHSTxWUTzhWMGfwcUQ',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Compound Sentences',
          activityPackId: 22,
          requirements: [
            {
              concept_id: 'GiUZ6KPkH958AT8S413nJg',
              count: 2
            },
            {
              concept_id: 'Qqn6Td-zR6NIAX43NOHoCg',
              count: 1
            },
            {
              concept_id: 'hJKqVOkQQQgfEsmzOWC1xw',
              count: 1
            },
            {
              concept_id: 'tSSLMHqX0q-9mKTJHSyung',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Complex Sentences',
          activityPackId: 21,
          requirements: [
            {
              concept_id: 'nb0JW1r5pRB5ouwAzTgMbQ',
              count: 2
            },
            {
              concept_id: 'Q8FfGSv4Z9L2r1CYOfvO9A',
              count: 2
            },
            {
              concept_id: 'S8b-N3ZrB50CWgxD5yg8yQ',
              count: 1
            },
            {
              concept_id: '7H2IMZvq0VJ4Uvftyrw7Eg',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Appositives and Modifying Phrases',
          activityPackId: 27,
          requirements: [
            {
              concept_id: 'InfGdB6Plr2M930kqsn63g',
              count: 1
            },
            {
              concept_id: 'GLjAExmqZShBTZ7DQGvVLw',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Relative Clauses',
          activityPackId: 49,
          requirements: [
            {
              concept_id: 'mandatory',
              count: 1
            },
          ]
        },
        {
          recommendation: 'Prepositional Phrases',
          activityPackId: 50,
          requirements: [
            {
              concept_id: 'mandatory',
              count: 1
            },
          ]
        }
      ]
    }

    manditory_concept = Concept.find_or_create_by(name: 'Mandatory')

    activities.each do |activity_id, recommendations|
      ActiveRecord::Base.transaction do
        recommendations.each_with_index do |recommendation_data, i|
          recommendation = Recommendation.create!(
            name: recommendation_data[:recommendation],
            activity_id: activity_id,
            unit_template_id: recommendation_data[:activityPackId],
            category: :independent_practice,
            order: i
          )

          puts "Created recommendation - #{recommendation.name}"

          recommendation_data[:requirements].each do |criterion_data|
            concept_uid = begin
              if criterion_data[:concept_id] === 'mandatory'
                manditory_concept.uid
              else
                criterion_data[:concept_id]
              end
            end

            concept   = Concept.find_by(uid: concept_uid)
            criterion = Criterion.create!(
              concept: concept,
              count: criterion_data[:count],
              recommendation: recommendation,
              no_incorrect: !!criterion_data[:noIncorrect]
            )

            puts " --> Created criterion - id:#{criterion.id}"
          end
        end
      end
    end

  end

  task :create_group => :environment do
    activities = {
      '413' => [
        {
          recommendation: 'Compound Subjects, Objects, and Predicates Lesson Pack',
          activityPackId: 40,
          requirements: [
            {
              concept_id: 'Jl4ByYtUfo4VhIKpMt23yA',
              count: 1
            },
            {
              concept_id: 'QNkNRs8zbCXU7nLBeo4mgA',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Adjectives Lesson Pack',
          activityPackId: 39,
          requirements: [
            {
              concept_id: 'oCQCO1_eVXQ2zqw_7QOuBw',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Adverbs Lesson Pack',
          activityPackId: 41,
          requirements: [
            {
              concept_id: 'GZ04vHSTxWUTzhWMGfwcUQ',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Compound Sentences Lesson Pack',
          activityPackId: 42,
          requirements: [
            {
              concept_id: 'GiUZ6KPkH958AT8S413nJg',
              count: 2
            },
            {
              concept_id: 'Qqn6Td-zR6NIAX43NOHoCg',
              count: 1
            },
            {
              concept_id: 'hJKqVOkQQQgfEsmzOWC1xw',
              count: 1
            },
            {
              concept_id: 'tSSLMHqX0q-9mKTJHSyung',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Complex Sentences Lesson Pack',
          activityPackId: 43,
          requirements: [
            {
              concept_id: 'nb0JW1r5pRB5ouwAzTgMbQ',
              count: 2
            },
            {
              concept_id: 'Q8FfGSv4Z9L2r1CYOfvO9A',
              count: 2
            },
            {
              concept_id: 'S8b-N3ZrB50CWgxD5yg8yQ',
              count: 1
            },
            {
              concept_id: '7H2IMZvq0VJ4Uvftyrw7Eg',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Appositive Phrases Lesson Pack',
          activityPackId: 44,
          requirements: [
            {
              concept_id: 'InfGdB6Plr2M930kqsn63g',
              count: 1
            },
            {
              concept_id: 'GLjAExmqZShBTZ7DQGvVLw',
              count: 1
            }
          ]
        },
        {
          recommendation: 'Parallel Structure Lesson Pack',
          activityPackId: 46,
          requirements: [
            {
              concept_id: '1ohLyApTz7lZ3JszrA98Xg',
              count: 1
            }
          ]
        }
      ],
      '447' => [
        {
          recommendation: 'Adjectives Lesson Pack',
          activityPackId: 39,
          requirements: [
            {
              concept_id: 'KvF_BYehx-U2Mk5oGbcjBw',
              count: 1,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Adverbs Lesson Pack',
          activityPackId: 41,
          requirements: [
            {
              concept_id: 'GZ04vHSTxWUTzhWMGfwcUQ',
              count: 1,
              noIncorrect: true
            },
            {
              concept_id: 'opY7bPUsNUMBk3FFhZ0wog',
              count: 0,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Compound Sentences Lesson Pack',
          activityPackId: 42,
          requirements: [
            {
              concept_id: 'tSSLMHqX0q-9mKTJHSyung',
              count: 1,
              noIncorrect: true
            },
            {
              concept_id: 'R3sBcYAvoXP2_oNVXiA98g',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'GiUZ6KPkH958AT8S413nJg',
              count: 1,
              noIncorrect: true
            }
          ]
        },
        {
          recommendation: 'Complex Sentences Lesson Pack',
          activityPackId: 43,
          requirements: [
            {
              concept_id: '7H2IMZvq0VJ4Uvftyrw7Eg',
              count: 1,
              noIncorrect: true
            },
            {
              concept_id: '6gQZPREURQQAaSzpIt_EEw',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'nb0JW1r5pRB5ouwAzTgMbQ',
              count: 0,
              noIncorrect: true
            },
            {
              concept_id: 'Q8FfGSv4Z9L2r1CYOfvO9A',
              count: 0,
              noIncorrect: true
            }
          ]
        }
      ]
    }

    manditory_concept = Concept.find_or_create_by(name: 'Mandatory')

    activities.each do |activity_id, recommendations|
      ActiveRecord::Base.transaction do
        recommendations.each_with_index do |recommendation_data, i|
          recommendation = Recommendation.create!(
            name: recommendation_data[:recommendation],
            activity_id: activity_id,
            unit_template_id: recommendation_data[:activityPackId],
            category: :group_lesson,
            order: i
          )

          puts "Created recommendation - #{recommendation.name}"

          recommendation_data[:requirements].each do |criterion_data|
            concept_uid = begin
              if criterion_data[:concept_id] === 'mandatory'
                manditory_concept.uid
              else
                criterion_data[:concept_id]
              end
            end

            concept   = Concept.find_by(uid: concept_uid)
            criterion = Criterion.create!(
              concept: concept,
              count: criterion_data[:count],
              recommendation: recommendation,
              no_incorrect: !!criterion_data[:noIncorrect]
            )

            puts " --> Created criterion - id:#{criterion.id}"
          end
        end
      end
    end

  end

end