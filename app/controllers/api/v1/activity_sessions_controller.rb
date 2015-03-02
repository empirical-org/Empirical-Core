class Api::V1::ActivitySessionsController < ApiController

  before_action :find_activity_session, except: [:index, :create]

  before_action :transform_incoming_request, only: [:update] # TODO: Also include create?

  def index
    # FIXME: original API doesn't support index
    @activities = ActivitySession.all
  end

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
    activity_session = ActivitySession.new(activity_session_params)
    activity_session.set_owner(current_user) if activity_session.ownable?
    activity_session.data = @data # FIXME: may no longer be necessary?

    if activity_session.valid? && activity_session.save
      @status = :success
      @message = "Activity Session Created"
    else
      @status = :failed
      @message = "Activity Session Create Failed"
    end

    render json: activity_session, meta: {status: @status, message: @message, errors: activity_session.errors}
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
    @activity_session = ActivitySession.unscoped.find_by_uid!(params[:id])
  end

  def activity_session_params
    params.delete(:activity_session)
    @data = params.delete(:data)
    concept_tag_keys = [:concept_tag_name, :metadata => concept_tag_result_allowed_keys]
    params.permit(:id, :percentage, :state, :time_spent, :completed_at, :activity_uid, :anonymous, concept_tag_results_attributes:  concept_tag_keys)
      .merge(data: @data).reject {|k,v| v.nil? }
  end

  # Grab a list of all the arbitrarily-named keys that are provided in the concept tag results payload.
  # Returns a list of symbols, e.g. [:student_input, :wpm]
  def concept_tag_result_allowed_keys
    if params[:concept_tag_results_attributes]
      params[:concept_tag_results_attributes].reduce [] do |acc, hash|
        acc + hash[:metadata].keys.map(&:to_sym)
      end.uniq
    else
      nil
    end
  end

  # Transform the incoming request parameters so that it can be easily ingested by ActiveRecord.
  # Alias the following request parameters:
  # Map each result to the following structure:
  # {
  #   concept_tag: "Creative Writing",
  #   concept_class: "Writing Concepts",
  #   student_input: "The dog jumped over the cat."
  # },
  # Becomes this:
  # {
  #   metadata: {
  #     concept_tag: "Creative Writing",
  #     concept_class: "Writing Concepts",
  #     student_input: "The dog jumped over the cat."
  #   }
  # }
  #
  # concept_tag_results -> concept_tag_results_attributes
  def transform_incoming_request
    if params[:concept_tag_results].present?
      results = params.delete(:concept_tag_results)
      transformed_results = results.reduce [] do |accumulator, result|
        accumulator << {
          metadata: result
        }
      end
      params[:concept_tag_results_attributes] = transformed_results
    else
      params.delete(:concept_tag_results)
    end
  end
end

