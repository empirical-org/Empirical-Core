require 'rails_helper'

RSpec.describe QuestionHealthObj, type: :model do

  describe '#question_health' do
    let!(:connect) { create(:activity_classification, key: ActivityClassification::CONNECT_KEY) }
    let!(:question) { create(:question)}
    let!(:activity) { create(:activity, activity_classification_id: connect.id) }
    let!(:activity_session_1) { create(:activity_session, activity: activity) }
    let!(:activity_session_2) { create(:activity_session, activity: activity) }
    let!(:activity_session_3) { create(:activity_session, activity: activity) }
    let!(:concept_result_1) { create(:concept_result, activity_session: activity_session_1, metadata: {correct: 1, questionNumber: 1, attemptNumber: 1}.to_json)}
    let!(:concept_result_2) { create(:concept_result, activity_session: activity_session_2, metadata: {correct: 0, questionNumber: 1, attemptNumber: 1}.to_json)}
    let!(:concept_result_3) { create(:concept_result, activity_session: activity_session_3, metadata: {correct: 0, questionNumber: 1, attemptNumber: 1}.to_json)}
    let!(:concept_result_4) { create(:concept_result, activity_session: activity_session_2, metadata: {correct: 1, questionNumber: 1, attemptNumber: 2}.to_json)}
    let!(:concept_result_5) { create(:concept_result, activity_session: activity_session_3, metadata: {correct: 0, questionNumber: 1, attemptNumber: 2}.to_json)}
    let!(:concept_result_6) { create(:concept_result, activity_session: activity_session_3, metadata: {correct: 0, questionNumber: 1, attemptNumber: 3}.to_json)}
    let!(:concept_result_7) { create(:concept_result, activity_session: activity_session_3, metadata: {correct: 0, questionNumber: 1, attemptNumber: 4}.to_json)}
    let!(:concept_result_8) { create(:concept_result, activity_session: activity_session_3, metadata: {correct: 0, questionNumber: 1, attemptNumber: 5}.to_json)}

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
      expect(health_obj[:number_of_incorrect_sequences]).to eq(question.data["incorrectSequences"].length)
      expect(health_obj[:number_of_focus_points]).to eq(question.data["focusPoints"].length)
      expect(health_obj[:percent_common_unmatched]).to eq(50)
      expect(health_obj[:percent_specified_algorithms]).to eq(75)
      expect(health_obj[:difficulty]).to eq(2.67)
      expect(health_obj[:percent_reached_optimal]).to eq(66.67)
    end
  end

end
