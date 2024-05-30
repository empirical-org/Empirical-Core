# frozen_string_literal: true

class Api::V1::ConceptFeedbackController < Api::ApiController
  before_action :activity_type, except: [:index]
  before_action :concept_feedback_by_uid, except: [:index, :create, :update]

  CACHE_EXPIRY = 24.hours

  def index
    concept_feedbacks = $redis.get("#{ConceptFeedback::ALL_CONCEPT_FEEDBACKS_KEY}_#{params[:activity_type]}")
    concept_feedbacks ||= fetch_all_concept_feedbacks_and_cache
    render json: concept_feedbacks
  end

  def show
    render(json: @concept_feedback)
  end

  def create
    uid = SecureRandom.uuid
    @concept_feedback = ConceptFeedback.create!(uid: uid, activity_type: @activity_type, data: valid_params)
    render(json: {@concept_feedback.uid => @concept_feedback.as_json})
  end

  def update
    # Because ConceptFeedback is tied to Concept via having the same UID, we need to allow
    # "updates" that are really creates with a specified UID
    begin
      @concept_feedback = ConceptFeedback.find_by!(uid: params[:id], activity_type: @activity_type)
      @concept_feedback.update!(data: valid_params)
    rescue ActiveRecord::RecordNotFound
      @concept_feedback = ConceptFeedback.create!({uid: params[:id], activity_type: @activity_type, data: valid_params})
    end
    render(json: @concept_feedback.as_json)
  end

  def destroy
    @concept_feedback.destroy
    render json: {}, status: :ok
  end

  private def activity_type
    @activity_type = params[:activity_type]
  end

  private def concept_feedback_by_uid
    @concept_feedback = ConceptFeedback.find_by!(uid: params[:id], activity_type: @activity_type)
  end

  private def valid_params
    params.require(:concept_feedback).except(:uid)
  end

  private def fetch_all_concept_feedbacks_and_cache
    concept_feedbacks = ConceptFeedback
      .where(activity_type: params[:activity_type])
      .all
      .reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
      .to_json

    $redis.set("#{ConceptFeedback::ALL_CONCEPT_FEEDBACKS_KEY}_#{params[:activity_type]}", concept_feedbacks)
    concept_feedbacks
  end
end
