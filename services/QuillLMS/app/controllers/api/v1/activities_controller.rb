# frozen_string_literal: true

class Api::V1::ActivitiesController < Api::ApiController
  CLASSIFICATION_TO_TOOL = {:connect => "connect", :sentence => "grammar"}

  before_action :doorkeeper_authorize!, only: [:create, :update, :destroy], unless: :staff?
  before_action :find_activity, except: [:index, :create, :uids_and_flags, :published_edition, :activities_health, :diagnostic_activitie, :evidence_activity_healths, :evidence_prompt_healths]

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

  def diagnostic_activities
    render json: {diagnostics: Activity.where(classification: ActivityClassification.diagnostic)}
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

  def activities_health
    render json: {activities_health: ActivityHealth.all.includes(:prompt_healths).as_json}
  end

  def evidence_activity_healths
    render json: {activity_healths: Evidence::ActivityHealth.all.includes(:prompt_healths).as_json}
  end

  def evidence_prompt_healths
    render json: {prompt_healths: Evidence::PromptHealth.all.as_json}
  end

  def question_health
    questions = @activity.data["questions"]
    tool = CLASSIFICATION_TO_TOOL[ActivityClassification.find(@activity.activity_classification_id).key.to_sym]
    questions_arr = questions.each.with_index(1).map do |q, question_number|
      question = Question.find_by(uid: q["key"])
      question.present? ? QuestionHealthObj.new(@activity, question, question_number, tool).run : {}
    end
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
