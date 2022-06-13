require 'modules/response_search'
require 'modules/response_aggregator'
require 'modules/incorrect_sequence_calculator'

class ResponsesController < ApplicationController
  include ResponseSearch
  include ResponseAggregator

  RESPONSE_LIMIT = 100
  MULTIPLE_CHOICE_LIMIT = 2
  CACHE_EXPIRY = 8.hours.to_i
  # MAX_MATCHES: A heuristic to reduce controller compute time
  # see https://github.com/empirical-org/Empirical-Core/pull/7086/files
  # for more context
  MAX_MATCHES = 10_000

  before_action :set_response, only: [:show, :update, :destroy]

  # GET /responses/1
  def show
    render json: @response
  end

  # POST /responses
  def create
    new_vals = transformed_new_vals(response_params)
    @response = Response.new(new_vals)
    if !@response.text.blank? && @response.save
      AdminUpdates.run(@response.question_uid)
      render json: @response, status: :created, location: @response
    else
      render json: @response.errors, status: :unprocessable_entity
    end
  end

  # POST /responses/create_or_increment
  def create_or_increment
    transformed_response = transformed_new_vals(params_for_create).to_h
    CreateOrIncrementResponseWorker.perform_async(transformed_response)
    render json: {}
  end

  # POST /responses/create_or_update
  def create_or_update
    symbolized_vals = transformed_new_vals(params_for_create).to_h.symbolize_keys
    response = Response.find_or_initialize_by(text: symbolized_vals[:text], question_uid: symbolized_vals[:question_uid])
    if response.update(symbolized_vals)
      AdminUpdates.run(response.question_uid) if !response.text.blank?
      render json: response
    else
      render json: response.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /responses/1
  def update
    new_vals = transformed_new_vals(response_params)
    updated_response = @response.update(new_vals)
    if updated_response
      render json: @response
    else
      render json: @response.errors, status: :unprocessable_entity
    end
  end

  # DELETE /responses/1
  def destroy
    @response.destroy
  end

  # POST /questions/rematch_all
  # params uid, type, delay (integer for seconds to delay job)
  def rematch_all_responses_for_question
    delay = params[:delay] || 0

    RematchResponsesForQuestionWorker.perform_in(delay, params[:uid], params[:type])
  end

  def health_of_question
    render json: health_of_question_obj(params[:question_uid])
  end

  def grade_breakdown
    render json: optimality_counts_of_question(params[:question_uid])
  end

  def question_dashboard
    admin_question_dashboard = AdminQuestionDashboard.new(params[:question_uid])
    render json: admin_question_dashboard.health
  end

  def incorrect_sequences
    render json: IncorrectSequenceCalculator.incorrect_sequences_for_question(params[:question_uid])
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def count_affected_by_incorrect_sequences
    used_sequences = (
      params_for_count_affected_by_incorrect_sequences[:used_sequences] || []
    ).reject { |us| us.empty? }

    selected_sequences = params_for_count_affected_by_incorrect_sequences[:selected_sequences]
    non_blank_selected_sequences = selected_sequences.reject { |ss| ss.empty?}
    matched_responses_count = 0

    Response.where(question_uid: params[:question_uid], optimal: nil).limit(MAX_MATCHES).each do |response|
      matching_used_sequences = used_sequences.any? { |us| Regexp.new(us).match(response.text)}
      next if matching_used_sequences

      matching_selected_sequence = non_blank_selected_sequences.any? do |ss|
        sequence_particles = ss.split('&&')
        sequence_particles.all? { |sp| !sp.empty? && Regexp.new(sp).match(response.text)}
      end

      if matching_selected_sequence
        matched_responses_count += 1
      end
    end

    render json: {matchedCount: matched_responses_count}
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def count_affected_by_focus_points
    selected_sequences = params_for_count_affected_by_focus_points[:selected_sequences]
    responses = Response.where(question_uid: params[:question_uid])
    non_blank_selected_sequences = selected_sequences.reject { |ss| ss.empty?}
    matched_responses_count = 0
    responses.each do |response|
      match = non_blank_selected_sequences.any? do |ss|
        sequence_particles = ss.split('&&')
        sequence_particles.all? { |sp| !sp.empty? && Regexp.new(sp, 'i').match(response.text)}
      end
      if match
        matched_responses_count += 1
      end
    end
    render json: {matchedCount: matched_responses_count}
  end

  def search
    render json: search_responses(params[:question_uid], search_params)
  end

  def show_many
    render json: {responses: Response.where(id: params[:responses])}
  end

  def edit_many
    responses = Response.where(id: params[:ids])
    responses.update_all(params[:updated_attribute].permit!.to_h)
    # update index
    responses.each do |response|
      response.update_index_in_elastic_search
    end
  end

  def delete_many
    Response.where(id: params[:ids]).destroy_all
  end

  def batch_responses_for_lesson
    question_uids = params[:question_uids]
    questions_with_responses = Response.where(question_uid: question_uids).where.not(optimal: nil).where(parent_id: nil).group_by(&:question_uid)
    render json: {questionsWithResponses: questions_with_responses}.to_json
  end

  def replace_concept_uids
    original_concept_uid = params[:original_concept_uid]
    new_concept_uid = params[:new_concept_uid]
    ActiveRecord::Base.connection.execute("
      UPDATE responses
      SET concept_results = concept_results - '#{original_concept_uid}' || jsonb_build_object('#{new_concept_uid}', concept_results->'#{original_concept_uid}')
      WHERE concept_results ->> '#{original_concept_uid}' IS NOT NULL
    ")
  end

  def clone_responses
    Response.where(question_uid: params[:original_question_uid]).each do |r|
      new_record = r.dup
      new_record.update(question_uid: params[:new_question_uid])
    end
    render json: :ok
  end

  def reindex_responses_updated_today_for_given_question
    question_uid = params[:question_uid]
    Response.__elasticsearch__.import query: -> { where("question_uid = ? AND updated_at >= ?", question_uid, Time.zone.now.beginning_of_day) }
  end

  # Use callbacks to share common setup or constraints between actions.
  private def set_response
    @response = Response.find_by_id_or_uid(params[:id])
  end

  private def search_params
    params.require(:search).permit(
      :pageNumber,
      :text,
      :excludeMisspellings,
      filters: {},
      sort: {}
    )
  end

  # Only allow a trusted parameter "white list" through.
  private def response_params
    params.require(:response).permit(
      :id,
      :uid,
      :parent_id,
      :parent_uid,
      :question_uid,
      :author,
      :text,
      :feedback,
      :count,
      :first_attempt_count,
      :is_first_attempt,
      :child_count,
      :optimal,
      :weak,
      :created_at,
      :updated_at,
      :search,
      :spelling_error,
      :concept_results,
      concept_results: {}
    )
  end

  private def params_for_create
    params.require(:response).permit(
      :id,
      :uid,
      :parent_id,
      :parent_uid,
      :question_uid,
      :author,
      :text,
      :feedback,
      :count,
      :first_attempt_count,
      :child_count,
      :optimal,
      :weak,
      :spelling_error,
      concept_results: {}
    )
  end

  private def params_for_count_affected_by_incorrect_sequences
    params.require(:data).permit!
  end

  private def params_for_count_affected_by_focus_points
    params.require(:data).permit!
  end

  private def concept_results_to_boolean(concept_results)
    new_concept_results = {}
    concept_results.each do |key, val|
      if val.respond_to?(:keys)
        new_concept_results[val['conceptUID']] = val['correct'] == 'true' || val == true
      else
        new_concept_results[key] = ['true', true].include?(val)
      end
    end
    new_concept_results
  end

  private def transformed_new_vals(response_params)
    new_vals = response_params
    if new_vals[:concept_results]
      if new_vals[:concept_results].empty?
        new_vals[:concept_results] = nil
      else
        new_vals[:concept_results] = concept_results_to_boolean(new_vals[:concept_results])
      end
    end
    new_vals
  end
end
