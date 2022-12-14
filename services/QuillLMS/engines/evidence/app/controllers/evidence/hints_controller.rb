# frozen_string_literal: true

module Evidence
  class HintsController < ApiController
    before_action :set_hint, only: [:create, :show, :update, :destroy]

    # GET /hints.json
    def index
      @hints = Evidence::Hint
      render json: @hints.all
    end

    # GET /hints/1.json
    def show
      render json: @hint
    end

    # POST /hints.json
    def create
      if @hint.save
        render json: @hint, status: :created
      else
        render json: @hint.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /hints/1.json
    def update
      if @hint.update(hint_params)
        head :no_content
      else
        render json: @hint.errors, status: :unprocessable_entity
      end
    end

    # DELETE /hints/1.json
    def destroy
      @hint.destroy
      head :no_content
    end

    private def set_hint
      if params[:id].present?
        @hint = Evidence::Hint.find(params[:id])
      else
        @hint = Evidence::Hint.new(hint_params)
      end
    end

    private def hint_params
      params.require(:hint).permit(
        :explanation,
        :image_link,
        :image_alt_text,
        :name
      )
    end
  end
end
