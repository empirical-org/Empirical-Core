class Api::V1::FirebaseTokensController < ApiController

  def create
    app = FirebaseApp.find_by_name(params[:app])
    render json: {
      token: app.token_for(current_user)
    }
  end
end