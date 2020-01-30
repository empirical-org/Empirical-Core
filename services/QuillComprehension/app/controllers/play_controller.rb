class PlayController < ApplicationController
  before_action :set_question, only: [:new, :create]
  skip_before_action :verify_authenticity_token, only: [:create]

  def new
    @page_js_bundle = 'play_question'
    @activity = @question.activity
  end

  def create
    feedback = Feedback.new(prompt_id: @question.id, entry: params[:entry]).response
    json = feedback.parsed_response
    render json: json, status: feedback.code
  end

  private def set_question
    @question = Question.find(params[:question_id])
  end
end
