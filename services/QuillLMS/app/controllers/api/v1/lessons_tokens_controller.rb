class Api::V1::LessonsTokensController < Api::ApiController
  skip_before_action :verify_authenticity_token

  def create
    token = CreateLessonsToken
      .new(current_user, params[:classroom_unit_id])
      .call
    render json: { token: token }
  end
end
