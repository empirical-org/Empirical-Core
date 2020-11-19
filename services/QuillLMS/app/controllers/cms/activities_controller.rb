class Cms::ActivitiesController < Cms::CmsController
  before_filter :find_classification
  before_filter :set_activity, only: [:update, :destroy]
  before_filter :set_style_and_javascript_file, only: [:new, :edit]

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
    activity = Activity.new(classification: @activity_classification)
    @activity = format_activity_for_activity_form(activity)
  end

  def edit
    activity = Activity.find(params[:id])
    @activity = format_activity_for_activity_form(activity)
  end

  def create
    @activity = @activity_classification.activities.new(activity_params)
    if @activity.save
      render json: { activity: @activity }
    else
      render json: { }
    end
  end

  def update
    if @activity.update_attributes!(activity_params)
      render json: { activity: @activity }
    else
      render json: { }
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

  def format_activity_for_activity_form(activity)
    formatted_activity = activity.attributes.slice(
      'id',
      'name',
      'description',
      'supporting_info',
      'repeatable',
      'flag',
      'flags',
      'standard_id',
      'raw_score_id',
      'follow_up_activity_id'
    )
    formatted_activity['content_partner_ids'] = activity.content_partner_ids
    formatted_activity['topic_ids'] = activity.topic_ids
    formatted_activity['activity_category_ids'] = activity.activity_category_ids
    formatted_activity
  end

  def set_activity
    @activity = @activity_classification.activities.find(params[:id])
  end

  def find_classification
    @activity_classification = ActivityClassification.find_by_id!(params[:activity_classification_id])
  end

  def set_style_and_javascript_file
    @js_file = 'staff'
    @style_file = 'staff'
  end

  def activity_params
    params.require(:activity).permit(:name,
                                     :description,
                                     :uid,
                                     :data,
                                     :activity_classification_id,
                                     :standard_id,
                                     :flag,
                                     :repeatable,
                                     :follow_up_activity_id,
                                     :supporting_info,
                                     :raw_score_id,
                                     topic_ids: [],
                                     activity_category_ids: [],
                                     content_partner_ids: [],
                                     flags: []
                                   )
  end
end
