require 'json'
require 'rails_helper'

describe Api::V1::ActivitySurveyResponsesController, type: :controller do
  let!(:activity_session) { create(:activity_session) }

  describe "#create" do
    it "should create a new record" do
      data = {
        emoji_selection: 1,
        multiple_choice_selections: ['This activity was the worst', 'This activity was the best'],
        survey_question: 'What did you think of this activity?'
      }
      post :create, params: { activity_session_uid: activity_session.uid, activity_survey_response: data }, as: :json
      new_activity_survey_response = ActivitySurveyResponse.find_by(activity_session_id: activity_session.id)
      expect(new_activity_survey_response).to be
      expect(new_activity_survey_response.emoji_selection).to eq(data[:emoji_selection])
      expect(new_activity_survey_response.multiple_choice_selections).to eq(data[:multiple_choice_selections])
      expect(new_activity_survey_response.survey_question).to eq(data[:survey_question])
    end

  end

end
