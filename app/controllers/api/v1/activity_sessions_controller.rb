class Api::V1::ActivitySessionsController < Api::ApiController

  doorkeeper_for :destroy, :show
  before_action :find_activity_session, only: [:show, :update, :destroy]
  before_action :strip_access_token_from_request

  before_action :transform_incoming_request, only: [:update, :create] # TODO: Also include create?

  # GET
  def show
    render json: @activity_session, meta: {status: 'success', message: nil, errors: nil}
  end

  # PATCH, PUT
  def update
    # FIXME: ignore id because it's related to inconsistency between
    # naming - id in app and uid here
    if @activity_session.update(activity_session_params.except(:id))
      @status = :success
      @message =
      render json: @activity_session, meta: {
        status: :success,
        message: "Activity Session Updated",
        errors: [] # FIXME: this is dumb
      }
    else
      render json: @activity_session, meta: {
        status: :failed,
        message: "Activity Session Update Failed",
        errors: @activity_session.errors
      }, status: :unprocessable_entity
    end
  end

  # POST
  def create

    @activity_session = ActivitySession.new(activity_session_params)
    crs = @activity_session.concept_results
    @activity_session.concept_results = []
    # activity_session.set_owner(current_user) if activity_session.ownable?
    # activity_session.data = @data # FIXME: may no longer be necessary?
    if @activity_session.valid? && @activity_session.save
      @activity_session.update(activity_session_params)
      @status = :success
      @message = "Activity Session Created"
    else
      @status = :failed
      @message = "Activity Session Create Failed"
    end
    render json: @activity_session, meta: {status: @status, message: @message, errors: @activity_session.errors}
  end

  # DELETE
  def destroy
    if @activity_session.destroy!
      render json: ActivitySession.new, meta:
        {status: 'success', message: "Activity Session Destroy Successful", errors: nil}
    else
      render json: @activity_session, meta:
        {status: 'failed', message: "Activity Session Destroy Failed", errors: @activity_session.errors}
    end
  end

  private

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
    concept_result_keys = [:concept_uid, metadata: concept_result_allowed_keys]
    params.permit(:id,
                  :access_token, # Required by OAuth
                  :percentage,
                  :state,
                  :completed_at,
                  :activity_uid,
                  :activity_id,
                  :anonymous,
                  :temporary,
                  concept_results_attributes:  concept_result_keys)
      .merge(data: @data).reject {|k,v| v.nil? }
  end

  # Grab a list of all the arbitrarily-named keys that are provided in the concept tag results payload.
  # Returns a list of symbols, e.g. [:student_input, :wpm]
  def concept_result_allowed_keys
    if params[:concept_results_attributes]
      params[:concept_results_attributes].reduce [] do |acc, hash|
        if hash.has_key?(:metadata)
          acc + hash[:metadata].keys.map(&:to_sym)
        else
          acc
        end
      end.uniq
    else
      nil
    end
  end

  # Transform the incoming request parameters so that it can be easily ingested by ActiveRecord.
  # 'concept_results' is the key for the results, but Rails' nested attributes
  # will only work with 'concept_results_attributes' as a key.
  def transform_incoming_request
    if params[:concept_results].present?
      params[:concept_results_attributes] = params.delete(:concept_results)
    else
      params.delete(:concept_results)
    end
  end

  def strip_access_token_from_request
    params.delete(:access_token)
  end
end
