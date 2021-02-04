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
  
    if params[:no_delay] && params[:no_delay] == 'true'
      CreateOrIncrementResponseWorker.perform_async(transformed_response)
    else
       # delaying this to off-hours to eliminate read/write traffic in peak hours
      CreateOrIncrementResponseWorker.perform_in(6.hours, transformed_response)
    end
    render json: {}
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

  # GET /questions/:question_uid/responses
  def responses_for_question
    ids = Rails.cache.fetch(Response.questions_cache_key(params[:question_uid]), expires_in: CACHE_EXPIRY) do
      #NB, the result of this query is too large to store as objects in Memcached for some questions, so storing the ids then fetching them in a query.
      # We might consider removing this caching entirely since the gains are less.
      # As of 9/3/2020 The question with the most responses for this query has 6997 responses.
      Response.where(question_uid: params[:question_uid], parent_id: nil).where.not(optimal: nil).pluck(:id)
    end
    @responses = Response.where(id: ids).to_a
    render json: @responses
  end

  # POST /questions/rematch_all
  def rematch_all_responses_for_question
    RematchResponsesForQuestionWorker.perform_async(params[:uid], params[:type])
  end

  def multiple_choice_options
    multiple_choice_options = Rails.cache.fetch(Response.multiple_choice_cache_key(params[:question_uid]), expires_in: CACHE_EXPIRY) do
      # NB, This is much faster to do the sort and limit in Ruby than Postgres
      # The DB picks a terrible query plan for some reason
      # 45seconds in the DB vs. 0.25 seconds in Ruby
      optimal_responses = Response.where(question_uid: params[:question_uid], optimal: true).sort_by {|r| -r.count}.first(MULTIPLE_CHOICE_LIMIT)
      # This, almost identical query does not have the same query issues
      sub_optimal_responses = Response.where(question_uid: params[:question_uid], optimal: [false, nil]).order('count DESC').limit(MULTIPLE_CHOICE_LIMIT).to_a
      optimal_responses.concat(sub_optimal_responses)
    end
    render json: multiple_choice_options
  end

  def health_of_question
    render json: health_of_question_obj(params[:question_uid])
  end

  def grade_breakdown
    render json: optimality_counts_of_question(params[:question_uid])
  end

  def incorrect_sequences
    render json: IncorrectSequenceCalculator.incorrect_sequences_for_question(params[:question_uid])
  end

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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_response
      @response = Response.find_by_id_or_uid(params[:id])
    end

    def search_params
      params.require(:search).permit(
        :pageNumber,
        :text,
        :excludeMisspellings,
        filters: {},
        sort: {}
      )
    end

    # Only allow a trusted parameter "white list" through.
    def response_params
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

    def params_for_create
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

    def params_for_count_affected_by_incorrect_sequences
      params.require(:data).permit!
    end

    def params_for_count_affected_by_focus_points
      params.require(:data).permit!
    end

    def concept_results_to_boolean(concept_results)
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

    def transformed_new_vals(response_params)
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
