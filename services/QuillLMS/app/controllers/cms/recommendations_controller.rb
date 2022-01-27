# frozen_string_literal: true

class Cms::RecommendationsController < Cms::CmsController
  before_action :set_activity_classification
  before_action :set_activity
  before_action :set_unit_templates, only: [:new, :create]

  def index
    @recommendations = Recommendation.includes(:unit_template)
      .where(activity: @activity)
    @independent_recommendations = Recommendation.independent_practice
      .where(activity: @activity)
    @group_recommendations = Recommendation.group_lesson
      .where(activity: @activity)
  end

  def new
    @concepts = Concept.where(visible: true)
    @recommendation = Recommendation.new
  end

  def show
    @recommendation = Recommendation.includes(criteria: :concept)
      .find(params[:id])
  end

  def create
    @recommendation = Recommendation.new(
      activity: @activity,
      order: next_order_number_for_category
    )

    if @recommendation.update(recommendation_params)
      redirect_to(
        cms_activity_classification_activity_recommendations_path,
        flash: { notice: 'Recommendation created!'}
      )
    else
      flash.now[:error] = 'Unable to create recommendation.'
      render :new
    end
  end

  def destroy
    @recommendation = Recommendation.find(params[:id])

    if @recommendation.destroy
      flash[:notice] = 'Recommendation destroyed!'
    else
      flash[:error] = 'Unable to destroy recommendation.'
    end

    redirect_to cms_activity_classification_activity_recommendations_path
  end

  def sort
    recommendation_ids = params[:order].split(',')

    if OrderRecommendations.new(recommendation_ids).update_order
      flash[:notice] = 'Recommendation order updated!'
    else
      flash[:error] = 'Unable to update Recommendation order.'
    end

    redirect_to cms_activity_classification_activity_recommendations_path
  end

  private def set_activity_classification
    @activity_classification = ActivityClassification
      .find(params[:activity_classification_id])
  end

  private def set_activity
    @activity = Activity.find(params[:activity_id])
  end

  private def set_unit_templates
    @unit_templates = UnitTemplate.all
  end

  private def next_order_number_for_category
    if @activity.recommendations.present? && @activity.recommendations.send(category).present?
      @activity.recommendations.send(category).last.order + 1
    else
      0
    end
  end

  private def category
    return unless Recommendation.categories.keys.include? recommendation_params[:category]

    recommendation_params[:category].to_sym
  end

  private def recommendation_params
    params.require(:recommendation).permit(:name, :unit_template_id, :category)
  end
end
