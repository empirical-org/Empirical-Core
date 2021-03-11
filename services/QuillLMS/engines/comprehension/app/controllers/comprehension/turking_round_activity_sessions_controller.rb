module Comprehension
  class TurkingRoundActivitySessionsController < ApplicationController
    skip_before_action :verify_authenticity_token

    before_action :set_turking_round_activity_session, only: [:show, :update, :destroy]

    # GET /turking_round_activity_sessions.json
    def index
      @turking_round_activity_sessions = Comprehension::TurkingRoundActivitySession.all

      render json: @turking_round_activity_sessions
    end

    # GET /turking_round_activity_sessions/1.json
    def show
      render json: @turking_round_activity_session
    end

    # POST /turking_round_activity_sessions.json
    def create
      @turking_round_activity_session = Comprehension::TurkingRoundActivitySession.new(turking_round_activity_session_params)

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

    private def set_turking_round_activity_session
      @turking_round_activity_session = Comprehension::TurkingRoundActivitySession.find(params[:id])
    end

    private def turking_round_activity_session_params
      params.require(:turking_round_activity_session).permit(
        :turking_round_id,
        :activity_session_uid
      )
    end
  end
end
