class Api::V1::ActivitiesController < Api::ApiController
  include QuillAuthentication

  CLASSIFICATION_TO_TOOL = {"connect": "connect", "sentence": "grammar"}

  before_action :doorkeeper_authorize!, only: [:create, :update, :destroy], unless: :staff?
  before_action :find_activity, except: [:index, :create, :uids_and_flags, :published_edition]

  def show
    render json: @activity, meta: {status: 'success', message: nil, errors: nil}, serializer: ActivitySerializer
  end

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

  def question_health
    questions = @activity.data["questions"]
    tool = CLASSIFICATION_TO_TOOL[ActivityClassification.find(@activity.activity_classification_id).key.to_sym]
    questions_arr = questions.each_with_index.map { |q, i|
      question_number = i + 1
      question = Question.find_by(uid: q["key"])
      data = question.data
      health_dashboard = QuestionHealthDashboard.new(@activity.id, question_number, question.uid)
      {
        url: ENV['DEFAULT_URL'].to_s + "/" + tool + "/#/admin/questions/" + question.uid + "/responses",
        text: data["prompt"],
        flag: data["flag"],
        number_of_incorrect_sequences: data["incorrectSequences"].length,
        number_of_focus_points: data["focusPoints"].length,
        percent_common_unmatched: health_dashboard.cms_dashboard_stats["percent_common_unmatched"],
        percent_specified_algorithms: health_dashboard.cms_dashboard_stats["percent_specified_algos"],
        difficulty: health_dashboard.average_attempts_for_question,
        percent_reached_optimal: health_dashboard.percent_reached_optimal_for_question
      }
    }
    render json: {question_health: questions_arr}
  end
  
  private def find_activity
    @activity = Activity.find_by_uid(params[:id]) || Activity.find_by_id(params[:id])
    raise ActiveRecord::RecordNotFound unless @activity
  end

  private def activity_params
    params.delete(:access_token)
    params.delete(:activity) # read only and therefore static
    @data = params.delete(:data) # the thing likely to be persisted

    params.except(:id).permit(:name,
                              :description,
                              :activity_classification_uid,
                              :standard_uid,
                              :uid,
                              flags: [])
                      .merge(data: @data)
                      .reject {|k,v| v.nil? }
  end

end
