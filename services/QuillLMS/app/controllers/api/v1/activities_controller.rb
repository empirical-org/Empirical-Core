class Api::V1::ActivitiesController < Api::ApiController

  before_action :doorkeeper_authorize!, only: [:create, :update, :destroy]
  before_action :find_activity, except: [:index, :create, :uids_and_flags, :published_edition]

  # GET
  def show
    render json: @activity, meta: {status: 'success', message: nil, errors: nil}, serializer: ActivitySerializer
  end

  # PATCH, PUT
  def update
    if @activity.update(activity_params)
      @status = :success
      @message = "Activity Updated"
    else
      @status = :failed
      @message = "Activity Update Failed"
    end

    render json: @activity, meta: {status: @status, message: @message, errors: @activity.errors}, serializer: ActivitySerializer

  end

  # POST
  def create
    activity = Activity.new(activity_params)
    activity.owner=(current_user) if activity.ownable?

    if activity.valid? && activity.save
      @status = :success
      @response_status = :ok
      @message = "Activity Created"
    else
      @status = :failed
      @response_status = :unprocessable_entity
      @message = "Activity Create Failed"
    end

    render json: activity,
      meta: {status: @status, message: @message, errors: activity.errors},
      status: @response_status,
      serializer: ActivitySerializer
  end

  # DELETE
  def destroy
    if @activity.destroy!
      render json: Activity.new, meta: {status: 'success', message: "Activity Destroy Successful", errors: nil}, serializer: ActivitySerializer
    else
      render json: @activity, meta: {status: 'failed', message: "Activity Destroy Failed", errors: @activity.errors}, serializer: ActivitySerializer
    end

  end

  def follow_up_activity_name_and_supporting_info
    follow_up_activity_name = @activity.follow_up_activity&.name
    supporting_info = @activity.supporting_info
    render json: {follow_up_activity_name: follow_up_activity_name, supporting_info: supporting_info}
  end

  def supporting_info
    supporting_info = @activity.supporting_info
    render json: {supporting_info: supporting_info}
  end

  def uids_and_flags
    uids_and_flags_obj = {}
    Activity.all.each do |activity|
      uids_and_flags_obj[activity.uid] = {flag: activity.flag}
    end
    render json: uids_and_flags_obj
  end

  def published_edition
    objective = Objective.find_by_name('Publish Customized Lesson')
    milestone = Milestone.find_by_name('Publish Customized Lesson')
    if !Checkbox.find_by(objective_id: objective.id, user_id: current_user.id)
      Checkbox.create(objective_id: objective.id, user_id: current_user.id)
    end
    if !UserMilestone.find_by(milestone_id: milestone.id, user_id: current_user.id)
      UserMilestone.create(milestone_id: milestone.id, user_id: current_user.id)
    end
    render json: {}
  end

  private

  def find_activity
    @activity = Activity.find_by_uid(params[:id]) || Activity.find_by_id(params[:id])
    raise ActiveRecord::RecordNotFound unless @activity
  end

  def activity_params
    params.delete(:access_token)
    params.delete(:activity) # read only and therefore static
    @data = params.delete(:data) # the thing likely to be persisted

    params.except(:id).permit(:name,
                              :description,
                              :activity_classification_uid,
                              :topic_uid,
                              :flags,
                              :uid)
                      .merge(data: @data)
                      .reject {|k,v| v.nil? }
  end

end
