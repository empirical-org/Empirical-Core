class Cms::ActivitiesController < Cms::CmsController
  before_filter :find_classification
  before_filter :set_activity, only: [:edit, :update, :destroy]

  def index
    @flag = params[:flag].to_s.to_sym.presence || :production
    @flag = :archived if @flag == :archive

    if @flag == :production
      @activities = @activity_classification.activities.production
    else
      @activities = @activity_classification.activities.flagged(@flag)
    end
  end

  def new
    @activity = Activity.new(classification: @activity_classification)
  end

  def edit
  end

  def create
    @activity = @activity_classification.activities.new(activity_params)
    if @activity.save
      redirect_to cms_activity_classification_activity_data_path(@activity_classification, @activity), notice: 'Activity was successfully created.'
    else
      render :new
    end
  end

  def update
    if @activity.update_attributes(activity_params)
      redirect_to cms_activity_classification_activity_data_path(@activity_classification, @activity), notice: 'Activity was successfully updated.'
    else
      render :new
    end
  end

  def destroy
    @activity.assignments.each do |assignment|
      assignment.scores.each(&:destroy)
      Assignment.find(assignment.id).destroy
    end

    @activity.destroy
    redirect_to cms_activities_path
  end

  protected

  def set_activity
    @activity = @activity_classification.activities.find(params[:id])
  end

  def find_classification
    @activity_classification = ActivityClassification.find_by_id!(params[:activity_classification_id])
  end

  def activity_params
    params.require(:activity).permit(:name,
                                     :description,
                                     :uid,
                                     :data,
                                     :activity_classification_id,
                                     :standard_id,
                                     :flag,
                                     :flags,
                                     :repeatable,
                                     :follow_up_activity_id,
                                     :supporting_info)
  end
end
