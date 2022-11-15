# frozen_string_literal: true

class Api::V1::SessionFeedbackHistoriesController < Api::ApiController
  # GET /feedback_histories.json?page=1&activity_id=33&start_date=2021-04-18T03:00:00.000Z&end_date=2021-05-18T03:00:00.000Z
  def index
    options = params.permit(:page, :activity_id, :start_date, :end_date, :filter_type, :responses_for_scoring).to_h.symbolize_keys
    count_options = params.permit(:activity_id, :start_date, :end_date, :filter_type, :responses_for_scoring).to_h.symbolize_keys
    records = FeedbackHistory.list_by_activity_session(**options)
    count = FeedbackHistory.get_total_count(**count_options)

    render json: {
      total_pages: (count / FeedbackHistory::DEFAULT_PAGE_SIZE.to_f).ceil,
      total_activity_sessions: count,
      current_page: [params[:page].to_i, 1].max,
      activity_sessions: records.map { |r| r.serialize_by_activity_session }
    }
  end

  def session_data_for_csv
    options = params.permit(:activity_id, :start_date, :end_date, :filter_type, :responses_for_scoring).to_h.symbolize_keys
    feedback_histories = FeedbackHistory.session_data_for_csv(**options)
    results = feedback_histories.map { |fh| fh.serialize_csv_data }
    if results
      render json: results
    else
      render plain: "The resource you were looking for does not exist", status: 404
    end
  end

  # GET /feedback_histories/1.json
  def show
    feedback_session_uid = params[:id]
    results = FeedbackHistory.serialize_detail_by_activity_session(feedback_session_uid)
    if results
      render json: results
    else
      render plain: "The resource you were looking for does not exist", status: 404
    end
  end
end
