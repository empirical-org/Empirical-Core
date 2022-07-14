# frozen_string_literal: true

require 'rails_helper'

describe PopulateActivityHealthWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:question) { create(:question)}
    let!(:another_question) { create(:question)}
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

    let!(:content_partner) { create(:content_partner, activities: [activity])}
    let!(:activity_session1) do
      create(:activity_session,
        activity: activity,
        started_at: DateTime.new(2021,1,1,4,0,0),
        completed_at: DateTime.new(2021,1,1,4,5,0)
      )
    end

    let!(:activity_session2) do
      create(:activity_session,
        activity: activity,
        started_at: DateTime.new(2021,1,2,4,0,0),
        completed_at: DateTime.new(2021,1,2,4,10,0)
      )
    end

    let!(:activity_session3) do
      create(:activity_session,
        activity: activity,
        started_at: DateTime.new(2021,1,3,4,0,0),
        completed_at: DateTime.new(2021,1,3,4,20,0)
      )
    end

    let!(:diagnostic) { create(:diagnostic_activity)}
    let!(:unit_template) { create(:unit_template, flag: "production")}
    let!(:activities_unit_template) { create(:activities_unit_template, unit_template: unit_template, activity: activity)}
    let!(:sample_unit) { create(:unit, unit_template: unit_template)}
    let!(:unit_activity) { create(:unit_activity, unit: sample_unit, activity: activity)}
    let!(:recommendation) { create(:recommendation, activity: diagnostic, unit_template: unit_template)}

    let!(:concept_result1) do
      create(:old_concept_result,
        activity_session: activity_session1,
        metadata: {
          questionNumber: 1,
          questionScore: 1
        }
      )
    end

    let!(:concept_result2) do
      create(:old_concept_result,
        activity_session: activity_session2,
        metadata: {
          questionNumber: 1,
          questionScore: 0.75
        }
      )
    end

    let!(:concept_result3) do
      create(:old_concept_result,
        activity_session: activity_session3,
        metadata: {
          questionNumber: 1,
          questionScore: 0
        }
      )
    end

    let!(:concept_result4) do
      create(:old_concept_result,
        activity_session: activity_session1,
        metadata: {
          questionNumber: 2,
          questionScore: 1
        }
      )
    end

    before do
      ENV['DEFAULT_URL'] = 'https://quill.org'
      ENV['CMS_URL'] = 'https://cms.quill.org'
      stub_request(:get, "#{ENV['CMS_URL']}/questions/#{question.uid}/question_dashboard_data")
        .to_return(status: 200, body: { percent_common_unmatched: 50,  percent_specified_algos: 75}.to_json, headers: {})
      stub_request(:get, "#{ENV['CMS_URL']}/questions/#{another_question.uid}/question_dashboard_data")
        .to_return(status: 200, body: { percent_common_unmatched: 100,  percent_specified_algos: 75}.to_json, headers: {})
    end

    it 'should create a new Activity Health object' do
      subject.perform(activity.id)
      expect(ActivityHealth.count).to eq(1)
      activity_health = ActivityHealth.first
      expect(activity_health.name).to eq(activity.name)
      expect(activity_health.url).to eq("https://quill.org/connect/#/admin/lessons/#{activity.uid}")
      expect(activity_health.flag).to eq(activity.flag.to_s)
      expect(activity_health.tool).to eq("connect")
      expect(activity_health.avg_difficulty).to eq(1.84)
      expect(activity_health.activity_packs[0]["name"]).to eq(activity.unit_templates[0].name)
    end

    it 'should create new Prompt Health objects' do
      subject.perform(activity.id)
      expect(PromptHealth.count).to eq(2)
      expect(PromptHealth.first.text).to eq(question.data["prompt"])
      expect(PromptHealth.first.percent_common_unmatched).to eq(50)
      expect(PromptHealth.second.text).to eq(another_question.data["prompt"])
      expect(PromptHealth.second.percent_common_unmatched).to eq(100)
    end

    it 'should create a new Activity Health object with a bad activity' do
      bad_activity = create(:activity, activity_classification_id: connect.id, flags: ["nonflag"])
      expect { subject.perform(bad_activity.id) }.not_to raise_error

    end
  end
end
