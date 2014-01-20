class CMS::ActivitiesController < ApplicationController
  before_filter :find_classification

  def index
    @activities = @activity_classification.activities
  end

  def new
    @activity = Activity.new
    @activity.workbook_id = params[:workbook_id]
    @activity.build_assessment(body: "Please enter some text.")
  end

  def edit
    @activity = Activity.find(params[:id])
  end

  def create
    @activity = Activity.new(activity_params)

    if @activity.save
      redirect_to cms_activities_path, notice: 'Activity was successfully created.'
    else
      render :new
    end
  end

  def update
    @activity = subject

    if @activity.update_attributes(activity_params)
      redirect_to cms_activities_path, notice: 'Activity was successfully updated.'
    else
      render :new
    end
  end

  def destroy
    @activity = subject

    @activity.assignments.each do |assignment|
      assignment.scores.each(&:destroy)

      Assignment.find(assignment.id).destroy
    end

    @activity.destroy
    redirect_to cms_activities_path
  end

protected

  def subject
    @activity_classification.activities.find(params[:id])
  end

  def find_classification
    @activity_classification = ActivityClassification.find_by_key!(params[:key])
  end

  def activity_params
    params.require(:activity).permit!
  end
end
