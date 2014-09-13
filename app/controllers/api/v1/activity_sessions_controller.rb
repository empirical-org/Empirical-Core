class Api::V1::ActivitySessionsController < ApiController

  before_action :find_activity_session, except: [:index, :create]

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
      @message = "Activity Session Updated"
    else
      @status = :failed
      @message = "Activity Session Update Failed"
    end

    render json: @activity_session, meta: {status: @status, message: @message, errors: @activity_session.errors}
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
    @activity_session = ActivitySession.find_by_uid(params[:id])
  end

  def activity_session_params
    params.delete(:activity_session)
    @data = params.delete(:data)

    params.permit(:id, :percentage, :state, :time_spent, :completed_at, :activity_uid, :anonymous).merge(data: @data).reject {|k,v| v.nil? }
  end

end

