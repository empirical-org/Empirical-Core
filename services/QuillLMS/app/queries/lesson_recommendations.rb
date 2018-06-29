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
