class Api::V1::LessonsTokensController < Api::ApiController
  skip_before_action :verify_authenticity_token

  def create
    token = LessonsTokenCreator
      .new(current_user, lessons_token_params[:classroom_activity_id])
      .create
    render json: { token: token }
  end

  private

  def lessons_token_params
    params.require(:lessons_token).permit(:classroom_activity_id)
  end
end
