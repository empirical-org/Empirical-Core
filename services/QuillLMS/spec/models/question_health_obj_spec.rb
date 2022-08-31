# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionHealthObj, type: :model do

  describe '#question_health' do
    let!(:connect) { create(:activity_classification, key: ActivityClassification::CONNECT_KEY) }
    let!(:question) { create(:question)}
    let!(:activity) { create(:activity, activity_classification_id: connect.id) }
    let!(:activity_session1) { create(:activity_session, activity: activity) }
    let!(:activity_session2) { create(:activity_session, activity: activity) }
    let!(:activity_session3) { create(:activity_session, activity: activity) }

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

    before do
      ENV['DEFAULT_URL'] = 'https://quill.org'
      ENV['CMS_URL'] = 'https://cms.quill.org'
      stub_request(:get, "#{ENV['CMS_URL']}/questions/#{question.uid}/question_dashboard_data")
        .to_return(status: 200, body: { percent_common_unmatched: 50,  percent_specified_algos: 75}.to_json, headers: {})
    end

    it 'should return an object with that questions health info' do
      activity.update(data: {questions: [{key: question.uid}]}.to_json)
      health_obj = QuestionHealthObj.new(activity, question, 1, connect.key).run
      expect(health_obj[:url]).to eq("https://quill.org/connect/#/admin/questions/#{question.uid}/responses")
      expect(health_obj[:text]).to eq(question.data['prompt'])
      expect(health_obj[:flag]).to eq(question.data['flag'])
      expect(health_obj[:incorrect_sequences]).to eq(question.data["incorrectSequences"].length)
      expect(health_obj[:focus_points]).to eq(question.data["focusPoints"].length)
      expect(health_obj[:percent_common_unmatched]).to eq(50)
      expect(health_obj[:percent_specified_algorithms]).to eq(75)
      expect(health_obj[:difficulty]).to eq(2.67)
      expect(health_obj[:percent_reached_optimal]).to eq(66.67)
    end

    it 'should return without erroring if one of the url values is nil' do
      health_obj = QuestionHealthObj.new(activity, question, 1, nil).run
      expect(health_obj[:url]).to eq("https://quill.org//#/admin/questions/#{question.uid}/responses")
      expect(health_obj[:text]).to eq(question.data['prompt'])
      expect(health_obj[:flag]).to eq(question.data['flag'])
      expect(health_obj[:incorrect_sequences]).to eq(question.data["incorrectSequences"].length)
      expect(health_obj[:focus_points]).to eq(question.data["focusPoints"].length)
      expect(health_obj[:percent_common_unmatched]).to eq(50)
      expect(health_obj[:percent_specified_algorithms]).to eq(75)
      expect(health_obj[:difficulty]).to eq(2.67)
      expect(health_obj[:percent_reached_optimal]).to eq(66.67)
    end
  end

end
