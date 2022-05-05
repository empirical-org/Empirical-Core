# frozen_string_literal: true

module Evidence
  class TurkingRoundActivitySessionsController < ApiController
    ARCHIVED_FLAG = :archived

    before_action :set_turking_round_activity_session, only: [:show, :update, :destroy]

    # GET /turking_round_activity_sessions.json
    def index
      @turking_round_activity_sessions = Evidence::TurkingRoundActivitySession.all

      render json: @turking_round_activity_sessions
    end

    # GET /turking_round_activity_sessions/1.json
    def show
      render json: @turking_round_activity_session
    end

    # POST /turking_round_activity_sessions.json
    def create
      @turking_round_activity_session = Evidence::TurkingRoundActivitySession.new(turking_round_activity_session_params)

      if @turking_round_activity_session.save
        render json: @turking_round_activity_session, status: :created
      else
        render json: @turking_round_activity_session.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /turking_round_activity_sessions/1.json
    def update
      if @turking_round_activity_session.update(turking_round_activity_session_params)
        head :no_content
      else
        render json: @turking_round_activity_session.errors, status: :unprocessable_entity
      end
    end

    # DELETE /turking_round_activity_sessions/1.json
    def destroy
      @turking_round_activity_session.destroy
      head :no_content
    end

    def validate
      if Evidence::TurkingRound.find(params[:turking_round_id]).expires_at > Time.current && Evidence::Activity.find(params[:activity_id]).parent_activity.flag != ARCHIVED_FLAG
        return render json: true
      end

      render json: false
    end

    private def set_turking_round_activity_session
      @turking_round_activity_session = Evidence::TurkingRoundActivitySession.find(params[:id])
    end

    private def turking_round_activity_session_params
      params.require(:turking_round_activity_session).permit(
        :turking_round_id,
        :activity_session_uid
      )
    end
  end
end
