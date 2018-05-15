class Api::V1::LessonsTokensController < Api::ApiController
  skip_before_action :verify_authenticity_token

  def create
    token = LessonsTokenCreator.new(current_user).create
    render json: { token: token }
  end
end
