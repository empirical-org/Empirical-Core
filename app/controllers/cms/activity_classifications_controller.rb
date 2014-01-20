class CMS::ActivityClassificationsController < ApplicationController
  def index
    @activity_classifications = ActivityClassification.all
  end

  def new
    @activity_classification = ActivityClassification.new
  end

  def edit
    @activity_classification = ActivityClassification.find(params[:id])
    render :new
  end

  def create
    @activity_classification = ActivityClassification.new(activity_classification_params)

    if @activity_classification.save
      redirect_to cms_activity_classifications_path, notice: 'ActivityClassification was successfully created.'
    else
      render :new
    end
  end

  def update
    @activity_classification = ActivityClassification.find(params[:id])

    if @activity_classification.update_attributes(activity_classification_params)
      redirect_to cms_activity_classifications_path, notice: 'ActivityClassification was successfully updated.'
    else
      render :new
    end
  end

  def destroy
    @activity_classification = ActivityClassification.find(params[:id])

    @activity_classification.assignments.each do |assignment|
      assignment.scores.each(&:destroy)

      Assignment.find(assignment.id).destroy
    end

    @activity_classification.destroy
    redirect_to cms_activity_classifications_path
  end

  protected

  def activity_classification_params
    params.require(:activity_classification).permit!
  end
end
