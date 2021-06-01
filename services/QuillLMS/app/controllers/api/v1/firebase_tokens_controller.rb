class Api::V1::FirebaseTokensController < Api::ApiController
  def create
    app = FirebaseApp.find_by_name!(params[:app])
    render json: {
      token: app.token_for(current_user)
    }
  end

  def create_for_connect
    app = FirebaseApp.find_by_name!(JSON.parse(params['json'])['app'])
    render json: {
      token: app.connect_token_for(current_user)
    }
  end
end
