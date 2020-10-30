class Api::V1::ActivitySessionsController < Api::ApiController

  before_action :doorkeeper_authorize!, only: [:destroy]
  before_action :find_activity_session, only: [:show, :update, :destroy, :update_comprehension_session]
  before_action :strip_access_token_from_request
  before_action :transform_incoming_request, only: [:update, :create]

  # GET
  def show
    render json: @activity_session, meta: {status: 'success', message: nil, errors: nil}, serializer: ActivitySessionSerializer
  end

  # PATCH, PUT
  def update
    # FIXME: ignore id because it's related to inconsistency between
    # naming - id in app and uid here
    if @activity_session.completed_at
      render json: @activity_session, meta: {
        status: :failed,
        message: "Activity Session Already Completed",
        errors: "This activity session has already been completed."
      }, status: :unprocessable_entity, serializer: ActivitySessionSerializer
    elsif @activity_session.update(activity_session_params.except(:id, :concept_results))
      NotifyOfCompletedActivity.new(@activity_session).call if @activity_session.classroom_unit_id

      if @concept_results
        handle_concept_results
      end
      @status = :success
      render json: @activity_session, meta: {
        status: :success,
        message: "Activity Session Updated",
        errors: [] # FIXME: this is dumb
      }, serializer: ActivitySessionSerializer
    else
      render json: @activity_session, meta: {
        status: :failed,
        message: "Activity Session Update Failed",
        errors: @activity_session.errors
      }, status: :unprocessable_entity, serializer: ActivitySessionSerializer
    end
  end

  def update_comprehension_session
    update
  end

  # POST
  def create

    @activity_session = ActivitySession.new(activity_session_params.except(:id, :concept_results))
    crs = @activity_session.concept_results
    @activity_session.user = current_user if current_user
    @activity_session.concept_results = []
    # activity_session.owner=(current_user) if activity_session.ownable?
    # activity_session.data = @data # FIXME: may no longer be necessary?
    if @activity_session.save
      if @activity_session.update(activity_session_params.except(:id))
        if @concept_results
          handle_concept_results
        end
        @status = :success
        @message = "Activity Session Created"
      end
    else
      @status = :failed
      @message = "Activity Session Create Failed"
    end
    render json: @activity_session, meta: {status: @status, message: @message, errors: @activity_session.errors}, serializer: ActivitySessionSerializer
  end

  # DELETE
  def destroy
    if @activity_session.destroy!
      render json: ActivitySession.new, meta:
        {status: 'success', message: "Activity Session Destroy Successful", errors: nil},
        serializer: ActivitySessionSerializer
    else
      render json: @activity_session, meta:
        {status: 'failed', message: "Activity Session Destroy Failed", errors: @activity_session.errors},
        serializer: ActivitySessionSerializer
    end
  end

  private

  def handle_concept_results
    valid_concept_uids_and_ids = Concept.where(uid: @concept_results.map{|cr| cr[:concept_uid]}).pluck(:uid, :id)
    concept_results_to_save = []
    @concept_results.each do |cr|
      valid_info = valid_concept_uids_and_ids.find{|concept| concept.first == cr[:concept_uid]}
      if valid_info
        cr[:activity_session_id] = @activity_session.id
        cr[:concept_id] = valid_info.last
        concept_results_to_save.push(cr)
      end
    end
    ConceptResult.bulk_insert(values: concept_results_to_save)
  end

  def find_activity_session
    # if current_user
    #   @activity_session = current_user.activity_sessions.find_by_uid!(params[:id])
    # else
    @activity_session = ActivitySession.unscoped.find_by_uid!(params[:id])
    # end
  end

  def activity_session_params
    params.delete(:activity_session)
    @data = params.delete(:data)
    params.permit(:id,
                  :access_token, # Required by OAuth
                  :percentage,
                  :state,
                  :question_type,
                  :completed_at,
                  :classroom_unit_id,
                  :activity_uid,
                  :activity_id,
                  :anonymous,
                  :temporary)
      .merge(data: @data).reject {|k,v| v.nil? }
      .merge(timespent: @activity_session&.timespent)
  end

  def transform_incoming_request
    if params[:concept_results].present?
      @concept_results = params.delete(:concept_results)
    else
      params.delete(:concept_results)
    end
  end

  def strip_access_token_from_request
    params.delete(:access_token)
  end
end
