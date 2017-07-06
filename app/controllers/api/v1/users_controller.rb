class Api::V1::UsersController < Api::ApiController

  def index
    render json: {user: current_user, text: "Hi"}
  end

end
