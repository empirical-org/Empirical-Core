class Cms::CriteriaController < Cms::CmsController
  def new
    @activity_classification = ActivityClassification
      .find(params[:activity_classification_id])
    @activity = Activity.find(params[:activity_id])
    @recommendation = Recommendation.find(params[:recommendation_id])
    @criterion = Criterion.new
  end
end
