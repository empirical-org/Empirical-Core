class Api::V1::SessionFeedbackHistoriesController < Api::ApiController
  # GET /feedback_histories.json?page=1&activity_id=33
  def index
    options = {}
    records = SessionFeedbackHistory.list_by_activity_session(**params.permit(:page, :activity_id).symbolize_keys)

    count = FeedbackHistory.select(:activity_session_uid).distinct.count

    render json: {
      total_pages: (count / SessionFeedbackHistory::DEFAULT_PAGE_SIZE.to_f).ceil,
      total_activity_sessions: count,
      current_page: [params[:page].to_i, 1].max,
      activity_sessions: SessionFeedbackHistory.serialize_list_by_activity_session(records)
    }
  end

  # GET /feedback_histories/1.json
  def show
    activity_session_uid = params[:id]
    results = SessionFeedbackHistory.serialize_detail_by_activity_session(activity_session_uid)
    if results
      render json: results
    else
      render text: "The resource you were looking for does not exist", status: 404
    end
  end
end
