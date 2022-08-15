# frozen_string_literal: true

require 'rails_helper'

describe 'SerializeActivityHealth' do
  let!(:question) { create(:question)}
  let!(:another_question) { create(:question)}
  let!(:a_bad_question) { create(:question)}
  let!(:connect) { create(:activity_classification, key: ActivityClassification::CONNECT_KEY) }

  let!(:activity) do
    create(:activity,
      activity_classification_id: connect.id,
      data: {
        questions: [
          {key: question.uid},
          {key: another_question.uid}
        ]
      }
    )
  end

  let!(:bad_activity) do
    create(:activity,
      activity_classification_id: connect.id,
      data: {
        questions: [
          {key: question.uid},
          {key: a_bad_question.uid}
        ]
      }
    )
  end

  let!(:content_partner) { create(:content_partner, activities: [activity])}
  let!(:start_time) { 1.day.ago }
  let!(:activity_session1) { create(:activity_session, activity: activity, state: "finished", started_at: DateTime.new(2021,1,1,4,0,0), completed_at: DateTime.new(2021,1,1,4,5,0)) }
  let!(:activity_session2) { create(:activity_session, activity: activity, state: "finished", started_at: start_time, completed_at: start_time + 10.minutes) }
  let!(:activity_session3) { create(:activity_session, activity: activity, state: "finished", started_at: start_time, completed_at: start_time + 20.minutes) }
  let!(:diagnostic) { create(:diagnostic_activity)}
  let!(:unit_template) { create(:unit_template, flag: "production")}
  let!(:activities_unit_template) { create(:activities_unit_template, unit_template: unit_template, activity: activity)}
  let!(:unit_template2) { create(:unit_template, flag: "archived")}
  let!(:activities_unit_template2) { create(:activities_unit_template, unit_template: unit_template2, activity: activity)}
  let!(:sample_unit) { create(:unit, unit_template: unit_template)}
  let!(:unit_activity) { create(:unit_activity, unit: sample_unit, activity: activity)}
  let!(:recommendation) { create(:recommendation, activity: diagnostic, unit_template: unit_template)}

  let!(:concept_result1) do
    create(:concept_result,
     activity_session: activity_session1,
     question_number: 1,
     question_score: 1
   )
  end

  let!(:concept_result2) do
    create(:concept_result,
      activity_session: activity_session2,
      question_number: 1,
      question_score: 0.75
    )
  end

  let!(:concept_result3) do
    create(:concept_result,
      activity_session: activity_session3,
      question_number: 1,
      question_score: 0
    )
  end

  let!(:concept_result4) do
    create(:concept_result,
      activity_session: activity_session1,
      question_number: 2,
      question_score: 1
    )
  end

  before do
    ENV['DEFAULT_URL'] = 'https://quill.org'
    ENV['CMS_URL'] = 'https://cms.quill.org'
    stub_request(:get, "#{ENV['CMS_URL']}/questions/#{question.uid}/question_dashboard_data")
      .to_return(status: 200, body: { percent_common_unmatched: 50,  percent_specified_algos: 75}.to_json, headers: {})
    stub_request(:get, "#{ENV['CMS_URL']}/questions/#{another_question.uid}/question_dashboard_data")
      .to_return(status: 200, body: { percent_common_unmatched: 100,  percent_specified_algos: 75}.to_json, headers: {})
    stub_request(:get, "#{ENV['CMS_URL']}/questions/#{a_bad_question.uid}/question_dashboard_data")
      .to_return(status: 200, body: { percent_common_unmatched: nil,  percent_specified_algos: nil}.to_json, headers: {})
  end

  it 'gets the correct basic data for that activity' do
    data = SerializeActivityHealth.new(activity).data
    expect(data[:name]).to eq(activity.name)
    expect(data[:url]).to eq("https://quill.org/connect/#/admin/lessons/#{activity.uid}")
    expect(data[:flag]).to eq(activity.flag.to_s)
    expect(data[:activity_categories]).to eq(activity.activity_categories.pluck(:name).sort)
    expect(data[:content_partners]).to eq([content_partner.name])
    expect(data[:tool]).to eq("connect")
    expect(data[:activity_packs]).to eq(activity.unit_templates.where(flag: "production").map {|ut| {id: ut.id, name: ut.name}}.sort_by{|h| h[:name]})
    expect(data[:diagnostics]).to eq([diagnostic.name])
  end

  it 'calculates the number plays in the last three months' do
    UnitActivity.where(activity: activity).destroy_all
    unit = create(:unit)
    create(:classroom_unit, unit: unit, created_at: 1.year.ago)
    create(:unit_activity, unit: unit, activity: activity)
    data = SerializeActivityHealth.new(activity).data
    expect(data[:recent_plays]).to eq(2)
  end

  it 'returns nil for recent_plays if the last assignment was less than 3 months ago' do
    UnitActivity.where(activity: activity).destroy_all
    unit = create(:unit)
    create(:classroom_unit, unit: unit, created_at: 1.month.ago)
    create(:unit_activity, unit: unit, activity: activity)
    data = SerializeActivityHealth.new(activity).data
    expect(data[:recent_plays]).to eq(nil)
  end

  it 'returns without erroring if some activity sessions have nil minutes to complete' do
    UnitActivity.where(activity: activity).destroy_all
    unit = create(:unit)
    create(:classroom_unit, unit: unit, created_at: 1.year.ago)
    create(:unit_activity, unit: unit, activity: activity)
    create(:activity_session, activity: activity, state: "finished", started_at: nil, completed_at: nil)
    data = SerializeActivityHealth.new(activity).data
    expect(data[:recent_plays]).to eq(2)
  end

  it 'calculates averages and standard deviation using prompt data' do
    data = SerializeActivityHealth.new(activity).data
    expect(data[:avg_common_unmatched]).to eq(75)
    expect(data[:avg_difficulty]).to eq(1.84)
    expect(data[:standard_dev_difficulty]).to eq(0.84)
  end

  it 'calculates the average length of time to finish the activity' do
    data = SerializeActivityHealth.new(activity).data
    expect(data[:avg_mins_to_complete]).to eq(11.67)
  end

  it 'calculates the data without nil erroring for a brand new activity with no assignments or attributes' do
    new_activity = create(:activity, activity_classification_id: connect.id)
    new_activity.update(activity_categories: [], content_partners: [], units: [])
    new_activity.save

    data = SerializeActivityHealth.new(new_activity).data
    expect(data[:activity_categories]).to eq([])
    expect(data[:content_partners]).to eq([])
    expect(data[:recent_plays]).to eq(nil)
    expect(data[:diagnostics]).to eq([])
    expect(data[:activity_packs]).to eq([])
    expect(data[:avg_mins_to_complete]).to eq(nil)
    expect(data[:avg_difficulty]).to eq(nil)
    expect(data[:avg_common_unmatched]).to eq(nil)
    expect(data[:standard_dev_difficulty]).to eq(nil)
  end

  it 'calculates the data without nil erroring for a badly formatted activity with no assignments or attributes' do

    data = SerializeActivityHealth.new(bad_activity).data

    expect(data[:avg_difficulty]).to eq(0)
    expect(data[:avg_common_unmatched]).to eq(25)
    expect(data[:standard_dev_difficulty]).to eq(0)
  end

  it 'calculates the data without erroring for an activity with one question uid that does not exist' do
    missing_question_activity =
      create(:activity,
        activity_classification_id: connect.id,
        data: {
          questions: [
            {key: question.uid},
            {key: 'not-a-real-uid'}
          ]
        }
      )

    data = SerializeActivityHealth.new(missing_question_activity).data

    expect(data[:avg_difficulty]).to eq(0)
    expect(data[:avg_common_unmatched]).to eq(50)
    expect(data[:standard_dev_difficulty]).to eq(0)
  end
end
