class Api::V1::PingController < ApiController
  # skip_load_and_authorize_resource

  def show
    render nothing: true, status: :ok
  end

end
