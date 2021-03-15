module Comprehension
  class AutomlModelsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_automl_model, only: [:show, :update, :activate, :destroy]

    # GET /automl_models.json
    def index
      @automl_models = Comprehension::AutomlModel.all

      render json: @automl_models
    end

    # GET /automl_models/1.json
    def show
      render json: @automl_model
    end

    # POST /automl_models.json
    def create
      @automl_model = Comprehension::AutomlModel.new(automl_model_params)
      @automl_model.populate_from_automl_model_id

      if @automl_model.save
        render json: @automl_model, status: :created
      else
        render json: @automl_model.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /automl_models/1.json
    def update
      if @automl_model.update(automl_model_params)
        head :no_content
      else
        render json: @automl_model.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /automl_models/1.json
    def activate
      if @automl_model.activate
        head :no_content
      else
        render json: @automl_model, status: :unprocessable_entity
      end
    end

    # DELETE /automl_models/1.json
    def destroy
      @automl_model.destroy
      head :no_content
    end

    private def set_automl_model
      @automl_model = Comprehension::AutomlModel.find(params[:id])
    end

    private def automl_model_params
      params.require(:automl_model).permit(:automl_model_id, :prompt_id)
    end
  end
end
