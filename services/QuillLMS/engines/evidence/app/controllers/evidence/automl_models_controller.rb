module Evidence
  class AutomlModelsController < ApiController
    before_action :set_automl_model, only: [:create, :show, :update, :activate, :destroy]
    append_before_action :set_lms_user_id, only: [:create, :activate]

    # GET /automl_models.json
    def index
      @automl_models = Evidence::AutomlModel.all
      @automl_models = @automl_models.where(prompt_id: params[:prompt_id]) if params[:prompt_id]
      @automl_models = @automl_models.where(state: params[:state]) if params[:state]

      render json: @automl_models
    end

    # GET /automl_models/1.json
    def show
      render json: @automl_model
    end

    # POST /automl_models.json
    def create
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
        render json: @automl_model, status: :ok
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
      params.require(:automl_model).permit(:automl_model_id, :prompt_id, :notes)
    end
  end
end
