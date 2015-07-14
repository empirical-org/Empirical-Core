class Api::V1::FirebaseTokensController < ApiController
  skip_before_action :verify_authenticity_token

  def create
    app = FirebaseApp.find_by_name!(params[:app])
    render json: {
      token: app.token_for(current_user)
    }
  end
end