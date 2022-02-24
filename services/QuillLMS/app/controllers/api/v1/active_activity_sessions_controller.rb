# frozen_string_literal: true

class Api::V1::ActiveActivitySessionsController < Api::ApiController
  before_action :activity_session_by_uid, only: [:show]

  def show
    render json: @activity_session.as_json
  end

  def update
    retried = false
    begin
      @activity_session = ActiveActivitySession.find_or_initialize_by(uid: params[:id])
      @activity_session.data ||= {}
      @activity_session.data = @activity_session.data.merge(update_params)
      @activity_session.save!
    rescue ActiveRecord::RecordNotUnique => e
      # Due to the way that ActiveRecord handles unique validations such as the one on UID,
      # it is possible that parallel calls to "update" will result in two threads trying
      # to create the same UID record and running into the RecordNotUnique error.  If this
      # happens, it should be safe to just retry the function because now the record is
      # in the database so find_or_initialize_by should locate the existing record.
      # If, for some reason, running this a second time generates the same error, we don't
      # want to keep retrying because that indicates some other, more worrying, problem.
      raise e if retried

      retried = true
      retry
    end
    head :no_content
  end

  private def update_params
    params['active_activity_session']
      .reject {|key, _| key == 'uid' }
      .to_unsafe_hash
  end

  private def activity_session_by_uid
    @activity_session = ActiveActivitySession.find_by!(uid: params[:id])
  end
end
