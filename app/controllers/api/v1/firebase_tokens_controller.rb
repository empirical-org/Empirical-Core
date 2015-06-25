class Api::V1::FirebaseTokensController < ApiController

  def create
    byebug
    app = FirebaseApp.find_by_name(params[:app])
    current_user = User.find(session[:user_id])
    render json: {
      token: app.token_for(current_user)
    }
  end
end