# frozen_string_literal: true

class Api::V1::ActivitySessionsController < Api::ApiController

  before_action :doorkeeper_authorize!, only: [:destroy]
  before_action :transform_incoming_request, only: [:update, :create]
  before_action :find_activity_session, only: [:show, :update, :destroy]
  before_action :strip_access_token_from_request

  def show
    render json: @activity_session, meta: {status: 'success', message: nil, errors: nil}, serializer: ActivitySessionSerializer
  end

  def update
    # FIXME: ignore id because it's related to inconsistency between
    # naming - id in app and uid here
    if @activity_session.completed_at
      status = :unprocessable_entity
      message = "Activity Session Already Completed"
    elsif @activity_session.update(activity_session_params)
      status = :ok
      message = "Activity Session Updated"
      handle_concept_results
      ActiveActivitySession.find_by_uid(@activity_session.uid)&.destroy if @activity_session.completed_at
    else
      status = :unprocessable_entity
      message = "Activity Session Update Failed"
      @errors = @activity_session.errors
    end

    render json: @activity_session,
      meta: {
        message: message,
        errors: @errors || []
      },
      status: status,
      serializer: ActivitySessionSerializer
  end

  def create
    @activity_session = ActivitySession.new(activity_session_params)
    @activity_session.user = current_user if current_user

    if @activity_session.save
      handle_concept_results if @concept_results
      @status = :success
      @message = "Activity Session Created"
    else
      @status = :failed
      @message = "Activity Session Create Failed"
    end

    render json: @activity_session,
      meta: {
        status: @status,
        message: @message,
        errors: @activity_session.errors
      },
      serializer: ActivitySessionSerializer
  end

  def destroy
    if @activity_session.destroy!
      render json: ActivitySession.new,
        meta: {
          status: 'success',
          message: "Activity Session Destroy Successful",
          errors: nil
        },
        serializer: ActivitySessionSerializer
    else
      render json: @activity_session,
        meta: {
          status: 'failed',
          message: "Activity Session Destroy Failed",
          errors: @activity_session.errors
        },
        serializer: ActivitySessionSerializer
    end
  end

  private def handle_concept_results
    return if !@concept_results

    concept_results_to_save = @concept_results.map { |c| concept_results_hash(c) }.reject(&:empty?)
    return if concept_results_to_save.empty?

    ConceptResultOld.bulk_insert(values: concept_results_to_save)
  end

  private def concept_results_hash(concept_result)
    concept = Concept.find_by(uid: concept_result["concept_uid"])
    return {} if concept.blank?

    concept_result.merge(concept_id: concept.id, activity_session_id: @activity_session.id)
  end

  private def find_activity_session
    @activity_session = ActivitySession.unscoped.find_by_uid!(params[:id])
  end

  private def activity_session_params
    params.delete(:activity_session)
    data = params.delete(:data)&.permit!
    clean_data = TimeTrackingCleaner.run(data)
    time_tracking = clean_data&.fetch(ActivitySession::TIME_TRACKING_KEY, nil)
    timespent = ActivitySession.calculate_timespent(@activity_session, time_tracking)

    record_long_timespent(timespent, @activity_session&.user_id, @activity_session&.id)

    params
      .permit(activity_session_permitted_params)
      .merge(data: clean_data&.permit!)
      .reject { |_, v| v.nil? }
      .merge(timespent: timespent)
  end

  private def record_long_timespent(timespent, user_id, activity_session_id)
    return if timespent.nil?
    return if timespent <= 3600

    begin
      raise ActivitySession::LongTimeTrackingError, "#{timespent} seconds for user #{user_id} and activity session #{activity_session_id}"
    rescue => e
      ErrorNotifier.report(e)
    end
  end

  private def transform_incoming_request
    if params[:concept_results].present?
      @concept_results = params.delete(:concept_results).map do |concept_result|
        concept_result
          .permit(concept_results_permitted_params)
          .merge(metadata: concept_result[:metadata].permit!)
          .to_h
      end
    else
      params.delete(:concept_results)
    end
  end

  private def activity_session_permitted_params
    [
      :access_token, # Required by OAuth
      :activity_id,
      :activity_uid,
      :anonymous,
      :classroom_unit_id,
      :completed_at,
      :percentage,
      :question_type,
      :state,
      :temporary
    ]
  end

  private def concept_results_permitted_params
    [
      :activity_classification_id,
      :activity_session_id,
      :concept_id,
      :concept_uid,
      :question_type,
      :metadata
    ]
  end

  private def strip_access_token_from_request
    params.delete(:access_token)
  end
end
