class Api::V1::LessonsTokensController < Api::ApiController
  skip_before_action :verify_authenticity_token

  def create
    token = CreateLessonsToken
      .new(current_user, params[:classroom_unit_id])
      .call
    # This HEADER is required when POST requests are made by Javascript
    # At least, that's what we think to be the case
    headers['Access-Control-Allow-Credentials'] = 'true'
    render json: { token: token }
  end
end
