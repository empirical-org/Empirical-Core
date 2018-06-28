class Cms::CriteriaController < Cms::CmsController
  def new
    @activity_classification = ActivityClassification
      .find(params[:activity_classification_id])
    @activity = Activity.find(params[:activity_id])
    @recommendation = Recommendation.find(params[:recommendation_id])
    @criterion = Criterion.new
  end

  def create
    @activity_classification = ActivityClassification
      .find(params[:activity_classification_id])
    @activity = Activity.find(params[:activity_id])
    @recommendation = Recommendation.find(params[:recommendation_id])
    @criterion = Criterion.new(recommendation: @recommendation)

    if @criterion.update(criteria_params)
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

  def destroy
    @criterion = Criterion.find(params[:id])
    @activity_classification = ActivityClassification
      .find(params[:activity_classification_id])
    @activity = Activity.find(params[:activity_id])
    @recommendation = Recommendation.find(params[:recommendation_id])

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

  private

  def criteria_params
    params.require(:criterion).permit(:concept_id, :category, :count)
  end
end
