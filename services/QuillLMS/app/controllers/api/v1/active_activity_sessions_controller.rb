# frozen_string_literal: true

class Api::V1::ActiveActivitySessionsController < Api::ApiController
  before_action :activity_session_by_uid, only: [:show]
  REDIS_PREFIX = 'active_activity_session_data_'
  def show
    render json: @activity_session.as_json
  end

  def update
    cache_key = "#{REDIS_PREFIX}#{params[:id]}"

    @aas_data = $redis.get(cache_key).
      yield_self { |x| x.nil? ? '{}' : x }.
      yield_self { |x| JSON.parse x }

    merged = @aas_data.merge(working_params)
    $redis.set(cache_key, merged.to_json)
    # @activity_session = ActiveActivitySession.find_or_initialize_by(uid: params[:id])
    # @activity_session.data ||= {}
    # @activity_session.data = @activity_session.data.merge(working_params)
    # @activity_session.save!

    head :no_content
  end

  private def working_params
    return valid_params unless params.dig(:active_activity_session, :passage)

    permitted_passage_object = params[:active_activity_session][:passage].map do |paragraph|
      paragraph.map do |word_object|
        word_object.permit!
      end
    end
    valid_params.merge({ passage: permitted_passage_object })
  end

  private def valid_params
    params
      .permit(active_activity_session: {})
      .require(:active_activity_session)
      .except(:uid)
  end

  private def activity_session_by_uid
    @activity_session = ActiveActivitySession.find_by!(uid: params[:id])
  end
end
