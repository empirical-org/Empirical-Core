# frozen_string_literal: true

class Api::V1::ConceptFeedbackController < Api::ApiController
  before_action :activity_type, only: [:show, :create, :update, :destroy]
  before_action :concept_feedback_by_uid, only: [:show, :destroy]

  CACHE_EXPIRY = 24.hours

  def index
    render json: cached_concept_feedbacks
  end

  def translations
    render json: cached_concept_feedbacks(translated: true)
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


  private def cached_concept_feedbacks(translated: false)
    $redis.get(cache_key(translated)) || fetch_and_cache_concept_feedbacks(translated:)
  end

  private def fetch_and_cache_concept_feedbacks(translated: false)
    query = ConceptFeedback.where(activity_type: params[:activity_type])
    query = query.includes(:translation_mappings, :english_texts, :translated_texts) if translated

    concept_feedbacks = query.each_with_object({}) do |cf, acc|
      acc.merge!(translated ? cf.translations_json(locale: params[:locale]) : { cf.uid => cf.as_json })
    end.to_json

    $redis.set(cache_key(translated:), concept_feedbacks)
    concept_feedbacks
  end

  private def cache_key(translated)
    base = "#{ConceptFeedback::ALL_CONCEPT_FEEDBACKS_KEY}_#{params[:activity_type]}"
    translated ? "#{base}_#{params[:locale]}" : base
  end
end
