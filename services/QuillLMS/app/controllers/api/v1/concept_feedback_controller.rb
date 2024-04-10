# frozen_string_literal: true

class Api::V1::ConceptFeedbackController < Api::ApiController
  before_action :activity_type, except: [:index]
  before_action :concept_feedback_by_uid, except: [:index, :create, :update]

  ALL_CONCEPT_FEEDBACKS_KEY = 'all_concept_feedbacks'

  def index
    all_concept_feedbacks = $redis.get(ALL_CONCEPT_FEEDBACKS_KEY)
    all_concept_feedbacks ||= get_all_concept_feedbacks_and_cache

    render json: all_concept_feedbacks
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
    render(plain: 'OK')
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

  private def get_all_concept_feedbacks_and_cache
    all_concept_feedbacks = ConceptFeedback
      .where(activity_type: params[:activity_type])
      .all
      .reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
    $redis.set(ALL_CONCEPT_FEEDBACKS_KEY, all_concept_feedbacks)
    all_concept_feedbacks
  end
end
