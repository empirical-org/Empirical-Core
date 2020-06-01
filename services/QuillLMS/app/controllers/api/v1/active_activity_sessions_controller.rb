class Api::V1::ActiveActivitySessionsController < Api::ApiController
  before_action :activity_session_by_uid, except: [:index, :create]

  def show
    render(json: @activity_session)
  end

  def create
    uid = SecureRandom.uuid
    @activity_session = ActiveActivitySession.create!(uid: uid, data: valid_params)
    render(json: {@activity_session.uid => @activity_session.as_json})
  end

  def update
    @activity_session.update!({data: valid_params})
    render(json: @activity_session.as_json)
  end

  def destroy
    @activity_session.destroy
    render(plain: 'OK')
  end

  private def valid_params
    params.require(:active_activity_session).except(:uid)
  end

  private def activity_session_by_uid
    @activity_session = ActiveActivitySession.find_by!(uid: params[:id])
  end
end
