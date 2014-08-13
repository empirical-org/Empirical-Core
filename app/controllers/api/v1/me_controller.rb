class Api::V1::MeController < ApiController
  # skip_load_and_authorize_resource

  def show
    render nothing: true, status: :ok
  end
end
