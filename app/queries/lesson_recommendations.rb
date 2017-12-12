class LessonRecommendations
    def rec_activities(rec_id)
      activities = ActiveRecord::Base.connection.execute("SELECT activities.name, activities.uid, activity_classifications.form_url
        FROM activities
        INNER JOIN activities_unit_templates ON activities.id = activities_unit_templates.activity_id
        INNER JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id
        INNER JOIN activity_category_activities ON activities.id = activity_category_activities.activity_id
        INNER JOIN activity_categories ON activity_categories.id = activity_category_activities.activity_category_id
        WHERE activities_unit_templates.unit_template_id = #{rec_id}
        ORDER BY activity_categories.order_number, activity_category_activities.order_number").to_a
      activities.map do |act|
        base_route = act['form_url']
        url = "#{base_route}customize/#{act['uid']}?&preview=true"
        {name: act['name'], url: url}
      end
    end

    def previous_unit_names(classroom_id)
      ActiveRecord::Base.connection.execute("SELECT DISTINCT unit.name FROM units unit
      LEFT JOIN classroom_activities as ca ON ca.unit_id = unit.id
      WHERE ca.classroom_id = #{classroom_id}
      AND ca.visible = true
      AND unit.visible = true").to_a.map {|e| e['name']}
    end

    def mark_previously_assigned(recs, classroom_id)
      # TODO: this needs to be able to handle when we have made the name
      # end in " | BETA"
      prev_names = previous_unit_names(classroom_id)
      recs.each { |r| r[:previously_assigned] = prev_names.include?(r[:recommendation]) }
      recs
    end

    def recs_for_activity(activity, classroom_id=nil)
        recs = send("recs_#{activity}_data")
        if classroom_id
          mark_previously_assigned(recs, classroom_id)
        else
          recs
        end
    end

    def recs_413_data
      [
          # {
          #     recommendation: 'Fragments',
          #     activityPackId: 28,
          #     requirements: [
          #         {
          #             concept_id: 'j89kdRGDVjG8j37A12p37Q',
          #             count: 3
          #         },
          #         {
          #             concept_id: 'KfA8-dg8FvlJz4eY0PkekA',
          #             count: 6
          #         },
          #         {
          #             concept_id: 'LH3szu784pXA5k2N9lxgdA',
          #             count: 3
          #         }
          #     ]
          # },

          {
              recommendation: 'Compound Subjects, Objects, and Predicates Lesson Pack',
              activityPackId: 40,
              activities: rec_activities(40),
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
              activities: rec_activities(39),
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
              activities: rec_activities(41),
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
              activities: rec_activities(42),
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
              activities: rec_activities(43),
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
              activities: rec_activities(44),
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
              activities: rec_activities(46),
              requirements: [
                  {
                      concept_id: '1ohLyApTz7lZ3JszrA98Xg',
                      count: 1
                  }
              ]
          }
      ]

    end

    def recs_447_data
      [
        # {
        #     recommendation: 'Fragments',
        #     activityPackId: 28,
        # activities: rec_activities(24),
        #     requirements: [
        #         {
        #             concept_id: 'KfA8-dg8FvlJz4eY0PkekA',
        #             count: 0,
        #             noIncorrect: true
        #         }
        #     ]
        # },
        # {
        #     recommendation: 'Articles',
        #     activityPackId: 2,
        #     activities: rec_activities(24),
        #     requirements: [
        #         {
        #             concept_id: 'fJXVAoYCC8S9kByua0kXXA',
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: 'XHUbxx87N7TK1F-tiaNy-A',
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: '5s-r1281DV8EpHyc9qJfiw',
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: 'QsC1lua0t41_J2em_c7kUA',
        #             count: 0,
        #             noIncorrect: true
        #         }
        #     ]
        # },
        # {
        #     recommendation: 'Verb Tense',
        #     activityPackId: 10,
        #     activities: rec_activities(24),
        #     requirements: [
        #         {
        #             concept_id: 'TE-ElKaRWWumTrmVE4-m6g',
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: 'RPNqOZuka_n8RESKbBF8OQ',
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: '9ZPpieSHhlMYQkEvrhQP1w',
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: 'YeioybAcmeBNsp3KRb9aow',
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: '1mXma17dtAL7NGmJRU80bQ',
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: 'TPm4a19NUn2RlKLCbPbVUw',
        #             count: 0,
        #             noIncorrect: true
        #         }
        #     ]
        # },
        # {
        #     recommendation: 'Prepositions',
        #     activityPackId: 7,
        #     activities: rec_activities(24),
        #     requirements: [
        #         {
        #             concept_id: "LPMBB_M5hooC263qXFc_Yg",
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: "lD5FBHF-FEPpsFG0SXlcfQ",
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: "FZ0wa0oqQ-6ELHf1gzVJjw",
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: "wpzl6e2NhXcBaKDC11K4NA",
        #             count: 0,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: "iY2_MBNxcVgzH3xmnyeEJA",
        #             count: 0,
        #             noIncorrect: true
        #         }
        #     ]
        # },
        {
            recommendation: 'Adjectives Lesson Pack',
            activityPackId: 39,
            activities: rec_activities(39),
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
            activities: rec_activities(41),
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
        # {
        #     recommendation: 'Subject Verb Agreement',
        #     activityPackId: 24,
        #     activities: rec_activities(24),
        #     requirements: [
        #         {
        #             concept_id: 'Jl4ByYtUfo4VhIKpMt23yA',
        #             count: 1,
        #             noIncorrect: true
        #         },
        #         {
        #             concept_id: 'Tlhrx6Igxn6cR_SD1U5efA',
        #             count: 0,
        #             noIncorrect: true
        #         }
        #     ]
        # },
        {
            recommendation: 'Compound Sentences Lesson Pack',
            activityPackId: 42,
            activities: rec_activities(42),
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
            activities: rec_activities(43),
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
    end
end
