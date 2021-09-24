class Api::V1::ActivitySurveyResponsesController < Api::ApiController
  before_action :activity_session_by_uid, only: [:create]

  def create
    activity_survey_response = ActivitySurveyResponse.new(activity_survey_response_params)
    activity_survey_response.activity_session_id = @activity_session.id
    activity_survey_response.save
    render json: activity_survey_response.as_json
  end

  private def activity_survey_response_params
    params[:activity_survey_response].permit([:emoji_selection, :survey_question, multiple_choice_selections: []])
  end

  private def activity_session_by_uid
    @activity_session = ActivitySession.find_by!(uid: params[:activity_session_uid])
  end

end
