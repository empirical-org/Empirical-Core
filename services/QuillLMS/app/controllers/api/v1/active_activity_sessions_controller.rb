class Api::V1::ActiveActivitySessionsController < Api::ApiController
  before_action :activity_session_by_uid, only: [:show, :destroy]

  def show
    render json: @activity_session.as_json
  end

  def update
    @activity_session = ActiveActivitySession.find_or_create_by(uid: params[:id])
    @activity_session.data ||= {}
    @activity_session.data = @activity_session.data.merge(valid_params)
    @activity_session.save!
    render json: @activity_session.as_json
  end

  def destroy
    @activity_session.destroy
    render(plain: 'OK')
  end

  private def valid_params
    params.require(:active_activity_session).except(:uid)
  end

  private def activity_session_by_uid
    @activity_session = ActiveActivitySession.find_by(uid: params[:id])
  end
end
