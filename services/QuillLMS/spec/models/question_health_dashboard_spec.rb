# frozen_string_literal: true

require 'rails_helper'

describe QuestionHealthDashboard, type: :model do
  let!(:activity) { create(:activity) }
  let!(:activity_session1) { create(:activity_session, activity: activity) }
  let!(:activity_session2) { create(:activity_session, activity: activity) }
  let!(:activity_session3) { create(:activity_session, activity: activity) }

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

  describe '#percent_reached_optimal_for_question' do
    it 'calculates the percent of question plays that resulted in an optimal response' do
      percent = QuestionHealthDashboard.new(activity.id, 1, nil).percent_reached_optimal_for_question
      expect(percent).to eq(66.67)
    end

    it 'calculates the percent of question plays even if attempt data doesnt contain all attempt numbers' do
      percent = QuestionHealthDashboard.new(activity.id, 2, nil).percent_reached_optimal_for_question
      expect(percent).to eq(100)
    end

    it 'is zero if there are no attempts' do
      percent = QuestionHealthDashboard.new(activity.id, 3, nil).percent_reached_optimal_for_question
      expect(percent).to eq(0)
    end
  end

  describe '#average_attempts_for_question' do
    it 'calculates the average number of attempts made on that question' do
      attempts = QuestionHealthDashboard.new(activity.id, 1, nil).average_attempts_for_question
      expect(attempts).to eq(2.67)
    end

    it 'calculates the average number of attempts made even if attempt data doesnt contain all attempt numbers' do
      attempts = QuestionHealthDashboard.new(activity.id, 2, nil).average_attempts_for_question
      expect(attempts).to eq(1)
    end

    it 'is zero if there are no attempts' do
      attempts = QuestionHealthDashboard.new(activity.id, 3, nil).average_attempts_for_question
      expect(attempts).to eq(0)
    end
  end

  describe '#cms_dashboard_stats' do
    it 'fetches stats from cms dashboard endpoint' do
      ENV['CMS_URL'] = 'https://cms.quill.org'
      question_uid = SecureRandom.uuid
      stub_request(:get, "#{ENV['CMS_URL']}/questions/#{question_uid}/question_dashboard_data")
        .to_return(status: 200, body: { percent_common_unmatched: 50,  percent_specified_algos: 75}.to_json, headers: {})
      dashboard_stats = QuestionHealthDashboard.new(activity.id, 1, question_uid).cms_dashboard_stats
      expect(dashboard_stats["percent_common_unmatched"]).to eq(50)
      expect(dashboard_stats["percent_specified_algos"]).to eq(75)
    end

    it 'should return empty data without raising error if json parser fails' do
      ENV['CMS_URL'] = 'https://cms.quill.org'
      question_uid = SecureRandom.uuid
      stub_request(:get, "#{ENV['CMS_URL']}/questions/#{question_uid}/question_dashboard_data")
        .to_return(status: 200, body: "there was some kind of error here", headers: {})
      dashboard_stats = QuestionHealthDashboard.new(activity.id, 1, question_uid).cms_dashboard_stats
      expect(dashboard_stats["percent_common_unmatched"]).to eq(nil)
      expect(dashboard_stats["percent_specified_algos"]).to eq(nil)
    end
  end
end
