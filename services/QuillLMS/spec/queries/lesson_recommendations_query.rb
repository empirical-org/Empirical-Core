# frozen_string_literal: true

require 'rails_helper'

describe LessonRecommendationsQuery do
  subject { described_class.new }

  describe '#rec_activities' do
    let(:activity_category) { create(:activity_category) }
    let(:activity_classification) { create(:activity_classification) }
    let(:activity) { create(:activity, activity_classification_id: activity_classification.id, activity_categories: [activity_category]) }
    let!(:activity_category_activity) { create(:activity_category_activity, activity: activity, activity_category: activity_category) }
    let(:unit_template) { create(:unit_template) }
    let!(:activity_unit_template) { create(:activities_unit_template, activity: activity, unit_template: unit_template) }

    it 'should return the right activity' do
      expect(subject.rec_activities(unit_template.id).first).to eq (
        {
          name: activity.name,
          url: "#{activity_classification.form_url}customize/#{activity.uid}?&preview=true",
        }
      )
    end
  end

  describe '#previous_unit_names' do
    let(:classroom) { create(:classroom, visible: true) }
    let(:unit) { create(:unit, visible: true) }
    let!(:classroom_activity) { create(:classroom_activity, classroom: classroom, unit: unit) }

    it 'should return the unit names that had belonged to the same classroom and classroom activity' do
      expect(subject.previous_unit_names(classroom.id)).to include(unit.name)
    end
  end

  describe '#mark_previously_assigned' do
    let(:classroom) { create(:classroom, visible: true) }
    let(:unit) { create(:unit, visible: true) }
    let!(:classroom_activity) { create(:classroom_activity, classroom: classroom, unit: unit) }
    let(:recs) { [{ previously_assigned: false, recommendation: unit.name }] }

    it 'should find the previous unit names and set the flag' do
      expect(subject.mark_previously_assigned(recs, classroom.id)).to eq([{ previously_assigned: true, recommendation: unit.name }])
    end
  end

  describe '#recs_for_activity' do
    context 'when activity 413' do
      context 'when classroom id given' do
        let(:classroom) { create(:classroom, visible: true) }
        let(:unit) { create(:unit, visible: true, name: "Adjectives Lesson Pack") }
        let!(:classroom_activity) { create(:classroom_activity, classroom: classroom, unit: unit) }

        before do
          allow(subject).to receive(:mark_previously_assigned) do |recs, activity|
            recs.each { |r| r[:previously_assigned] = true }
            recs
          end
          allow(subject).to receive(:rec_activities) { "activities" }
        end

        it 'should return the correct response' do
          expect(subject.recs_for_activity("413", classroom.id)).to eq(
            [
              {
                recommendation: 'Compound Subjects, Objects, and Predicates Lesson Pack',
                activityPackId: 40,
                activities: "activities",
                requirements:
                  [
                    {
                      concept_id: 'Jl4ByYtUfo4VhIKpMt23yA',
                      count: 1
                    },
                    {
                      concept_id: 'QNkNRs8zbCXU7nLBeo4mgA',
                      count: 1,
                    }
                  ],
                previously_assigned: true
          },
              {
                recommendation: 'Adjectives Lesson Pack',
                activityPackId: 39,
                activities: "activities",
                requirements:
                  [
                    {
                      concept_id: 'oCQCO1_eVXQ2zqw_7QOuBw',
                      count: 1,
                    }
                  ],
                previously_assigned: true
              },
              {
                recommendation: 'Adverbs Lesson Pack',
                activityPackId: 41,
                activities: "activities",
                requirements:
                  [
                    {
                      concept_id: 'GZ04vHSTxWUTzhWMGfwcUQ',
                      count: 1
                    }
                  ],
                previously_assigned: true
              },
              {
                recommendation: 'Compound Sentences Lesson Pack',
                activityPackId: 42,
                activities: "activities",
                requirements:
                  [
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
                  ],
                previously_assigned: true
              },
              {
                recommendation: 'Complex Sentences Lesson Pack',
                activityPackId: 43,
                activities: "activities",
                requirements:
                  [
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
                  ],
                previously_assigned: true
              },
              {
                recommendation: 'Appositive Phrases Lesson Pack',
                activityPackId: 44,
                activities: "activities",
                requirements:
                  [
                    {
                      concept_id: 'InfGdB6Plr2M930kqsn63g',
                      count: 1
                    },
                    {
                      concept_id: 'GLjAExmqZShBTZ7DQGvVLw',
                      count: 1
                    }
                  ],
                previously_assigned: true
              },
              {
                recommendation: 'Parallel Structure Lesson Pack',
                activityPackId: 46,
                activities: "activities",
                requirements:
                  [
                    {
                      concept_id: '1ohLyApTz7lZ3JszrA98Xg',
                      count: 1
                    }
                  ],
                previously_assigned: true
              }
            ]
          )
        end
      end

      context 'when classroom id not given' do
        before do
          allow(subject).to receive(:rec_activities) { "activities" }
        end

        it 'should return the correct response' do
          expect(subject.recs_for_activity("413")).to eq(
            [
              {
                recommendation: 'Compound Subjects, Objects, and Predicates Lesson Pack',
                activityPackId: 40,
                activities: "activities",
                requirements:
                  [
                    {
                      concept_id: 'Jl4ByYtUfo4VhIKpMt23yA',
                      count: 1
                    },
                    {
                      concept_id: 'QNkNRs8zbCXU7nLBeo4mgA',
                      count: 1,
                    }
                  ]
                },
              {
                recommendation: 'Adjectives Lesson Pack',
                activityPackId: 39,
                activities: "activities",
                requirements:
                  [
                    {
                      concept_id: 'oCQCO1_eVXQ2zqw_7QOuBw',
                      count: 1,
                    }
                  ]
              },
              {
                recommendation: 'Adverbs Lesson Pack',
                activityPackId: 41,
                activities: "activities",
                requirements:
                  [
                    {
                        concept_id: 'GZ04vHSTxWUTzhWMGfwcUQ',
                        count: 1
                    }
                  ]
              },
              {
                recommendation: 'Compound Sentences Lesson Pack',
                activityPackId: 42,
                activities: "activities",
                requirements:
                  [
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
                activities: "activities",
                requirements:
                  [
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
                activities: "activities",
                requirements:
                  [
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
                activities: "activities",
                requirements:
                  [
                    {
                      concept_id: '1ohLyApTz7lZ3JszrA98Xg',
                      count: 1
                    }
                  ]
              }
          ]
        )
        end

      end
    end

    context 'when activity 417' do
      context 'when classroom id given' do
        let(:classroom) { create(:classroom, visible: true) }
        let(:unit) { create(:unit, visible: true, name: "Adjectives Lesson Pack") }
        let!(:classroom_activity) { create(:classroom_activity, classroom: classroom, unit: unit) }

        before do
          allow(subject).to receive(:mark_previously_assigned) do |recs, activity|
            recs.each { |r| r[:previously_assigned] = true }
            recs
          end
          allow(subject).to receive(:rec_activities) { "activities" }
        end

        it 'should return the correct response' do
          expect(subject.recs_for_activity("447", classroom.id)).to eq(
          [
              {
                  recommendation: 'Adjectives Lesson Pack',
                  activityPackId: 39,
                  activities: "activities",
                  requirements: [
                      {
                          concept_id: 'KvF_BYehx-U2Mk5oGbcjBw',
                          count: 1,
                          noIncorrect: true
                      },

                  ],
                  previously_assigned: true
              },
              {
                  recommendation: 'Adverbs Lesson Pack',
                  activityPackId: 41,
                  activities: "activities",
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
                  ],
                  previously_assigned: true
              },
              {
                  recommendation: 'Compound Sentences Lesson Pack',
                  activityPackId: 42,
                  activities: "activities",
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
                  ],
                  previously_assigned: true
              },
              {
                  recommendation: 'Complex Sentences Lesson Pack',
                  activityPackId: 43,
                  activities: "activities",
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
                  ],
                  previously_assigned: true
              }
          ]
        )
        end
      end

      context 'when classroom id not given' do
        before do
          allow(subject).to receive(:rec_activities) { "activities" }
        end

        it 'should return the correct response' do
          expect(subject.recs_for_activity("447")).to eq(
            [
              {
                recommendation: 'Adjectives Lesson Pack',
                activityPackId: 39,
                activities: "activities",
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
                activities: "activities",
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
                activities: "activities",
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
                activities: "activities",
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
          )
        end
      end
    end
  end
end
