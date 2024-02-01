# frozen_string_literal: true

module Evidence
  class AutomlModelsController < ApiController
    before_action :set_automl_model, only: [:create, :show, :update, :activate, :destroy]
    append_before_action :set_lms_user_id, only: [:create, :activate]

    def index
      @automl_models = Evidence::AutomlModel.all
      @automl_models = @automl_models.where(prompt_id: params[:prompt_id]) if params[:prompt_id]
      @automl_models = @automl_models.where(state: params[:state]) if params[:state]

      render json: @automl_models
    end

    def show
      render json: @automl_model
    end

    def create
      @automl_model.assign_attributes(custom_create_attrs)

      if @automl_model.save
        render json: @automl_model, status: :created
      else
        render json: @automl_model.errors, status: :unprocessable_entity
      end
    end

    def update
      if @automl_model.update(automl_model_params)
        render json: @automl_model, status: :ok
      else
        render json: @automl_model.errors, status: :unprocessable_entity
      end
    end

    def activate
      if @automl_model.activate
        head :no_content
      else
        render json: @automl_model, status: :unprocessable_entity
      end
    end

    def destroy
      @automl_model.destroy
      head :no_content
    end

    def deployed_model_names
      @names = VertexAI::DeployedModelNamesFetcher.run
      render json: @names
    end

    def enable_more_than_ten_labels
      prompt_id = params['prompt_id']
      automl_model = Evidence::AutomlModel.where(prompt_id:).last

      return render json: { error: "Model not found with prompt id #{prompt_id}" }, status: 404 if automl_model.nil?

      parsed_additional_labels = params['additional_labels'].split(',').map(&:strip)
      labels = (automl_model.labels + parsed_additional_labels).sort.uniq

      Evidence::AutomlModel
        .where(id: automl_model.id)
        .update_all(labels:) # update all since AutomlModel labels are readonly

      automl_model.reload.activate
    end

    private def custom_create_attrs
      VertexAI::ParamsBuilder
        .run(@automl_model.name)
        .merge(state: AutomlModel::STATE_INACTIVE)
    end

    private def set_lms_user_id
      @automl_model.lms_user_id = lms_user_id
    end

    private def set_automl_model
      if params[:id].present?
        @automl_model = Evidence::AutomlModel.find(params[:id])
      else
        @automl_model = Evidence::AutomlModel.new(automl_model_params)
      end
    end

    private def automl_model_params
      params
        .require(:automl_model)
        .permit(:name, :notes, :prompt_id)
    end

  end
end
