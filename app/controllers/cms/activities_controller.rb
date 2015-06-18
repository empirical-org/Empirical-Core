class CMS::ActivitiesController < ApplicationController
  before_filter :admin!
  before_filter :find_classification

  def index
    @flag = params[:flag].to_s.to_sym.presence || :production
    @flag = :archived if @flag == :archive

    @activities = if @flag == :production
      @activity_classification.activities.production
    else
      @activity_classification.activities.flagged(@flag)
    end
  end

  def new
    @activity = Activity.new(classification: @activity_classification)
  end

  def edit
    @activity = Activity.find(params[:id])
  end

  def create
    @activity = @activity_classification.activities.new(activity_params)

    if @activity.save
      redirect_to cms_activity_data_path(@activity_classification.key, @activity), notice: 'Activity was successfully created.'
    else
      render :new
    end
  end

  def update
    @activity = subject

    if @activity.update_attributes(activity_params)
      redirect_to cms_activity_data_path(@activity_classification.key, @activity), notice: 'Activity was successfully updated.'
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
