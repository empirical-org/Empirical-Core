class Cms::CriteriaController < Cms::CmsController
  before_action :set_activity
  before_action :set_recommendation
  before_action :set_activity_classification
  before_action :set_criterion, only: [:edit, :update, :destroy]

  def new
    @criterion = Criterion.new
  end

  def create
    @criterion = Criterion.new(recommendation: @recommendation)
    if @criterion.update(criterion_params)
      redirect_to cms_activity_classification_activity_recommendation_path(
        @activity_classification,
        @activity,
        @recommendation
      ), flash: { notice: 'Criterion created!' }
    else
      flash.now[:error] = 'Unable to create criterion.'
      render :new
    end
  end

  def edit; end

  def update
    if @criterion.update(criterion_params)
      redirect_to cms_activity_classification_activity_recommendation_path(
        @activity_classification,
        @activity,
        @recommendation
      ), flash: { notice: 'Criterion updated!' }
    else
      flash.now[:error] = 'Unable to update criterion.'
      render :edit
    end
  end

  def destroy
    if @criterion.destroy
      flash[:notice] = 'Criterion deleted!'
    else
      flash[:error] = 'Unable to delete criterion.'
    end

    redirect_to cms_activity_classification_activity_recommendation_path(
      @activity_classification,
      @activity,
      @recommendation
    )
  end

  private def set_criterion
    @criterion = Criterion.find(params[:id])
  end

  private def set_activity_classification
    @activity_classification = ActivityClassification
      .find(params[:activity_classification_id])
  end

  private def set_activity
    @activity = Activity.find(params[:activity_id])
  end

  private def set_recommendation
    @recommendation = Recommendation.find(params[:recommendation_id])
  end

  private def criterion_params
    params.require(:criterion)
      .permit(:concept_id, :category, :count, :no_incorrect)
  end
end
