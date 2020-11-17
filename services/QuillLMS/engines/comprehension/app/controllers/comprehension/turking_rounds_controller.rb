module Comprehension
  class TurkingRoundsController < ApplicationController
    before_action :set_turking_round, only: [:show, :update, :destroy]

    # GET /turking_rounds.json
    def index
      @turking_rounds = Comprehension::TurkingRound.all

      render json: @turking_rounds
    end

    # GET /turking_rounds/1.json
    def show
      render json: @turking_round
    end

    # POST /turking_rounds.json
    def create
      @turking_round = Comprehension::TurkingRound.new(turking_round_params)

      if @turking_round.save
        render json: @turking_round, status: :created, location: @turking_round
      else
        render json: @turking_round.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /turking_rounds/1.json
    def update
      if @turking_round.update(turking_round_params)
        head :no_content
      else
        render json: @turking_round.errors, status: :unprocessable_entity
      end
    end

    # DELETE /turking_rounds/1.json
    def destroy
      @turking_round.destroy
      head :no_content
    end

    private def set_turking_round
      @turking_round = Comprehension::TurkingRound.find(params[:id])
    end

    private def turking_round_params
      params.require(:turking_round).permit(:activity_id, :uuid, :expires_at)
    end
  end
end
