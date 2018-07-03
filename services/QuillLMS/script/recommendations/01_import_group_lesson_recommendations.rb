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

manditory_concept = Concept.find_or_create_by(name: 'Manditory')

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
