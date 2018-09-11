require 'modules/response_search'
require 'modules/response_aggregator'
require 'modules/incorrect_sequence_calculator'
class ResponsesController < ApplicationController
  include ResponseSearch
  include ResponseAggregator
  before_action :set_response, only: [:show, :update, :destroy]

  # GET /responses
  def index
    @responses = Response.all

    render json: @responses
  end

  # GET /responses/1
  def show
    render json: @response
  end

  # POST /responses
  def create
    @response = Response.new(response_params)
    if @response.save
      AdminUpdates.run(@response.question_uid)
      render json: @response, status: :created, location: @response
    else
      render json: @response.errors, status: :unprocessable_entity
    end
  end

  # POST /responses/create_or_increment
  def create_or_increment
    response = Response.where(text: response_params[:text], question_uid: response_params[:question_uid])[0]
    if !response
      response = Response.new(params_for_create)
      if response.save
        AdminUpdates.run(response.question_uid)
        render json: response, status: :created, location: response
      end
    else
      increment_counts(response)
    end
  end

  # PATCH/PUT /responses/1
  def update
    new_vals = response_params
    if new_vals[:concept_results]
      if new_vals[:concept_results].empty?
        new_vals[:concept_results] = nil
      else
        new_vals[:concept_results] = concept_results_to_boolean(new_vals[:concept_results])
      end
    end
    if @response.update(new_vals)
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
    @responses = Response.where(question_uid: params[:question_uid]).where.not(optimal: nil).where(parent_id: nil)
    render json: @responses
  end

  def get_health_of_question
    render json: health_of_question(params[:question_uid])
  end

  def get_grade_breakdown
    render json: optimality_counts_of_question(params[:question_uid])
  end

  def get_incorrect_sequences
    render json: IncorrectSequenceCalculator.get_incorrect_sequences_for_question(params[:question_uid])
  end

  def get_count_affected_by_incorrect_sequences
    used_sequences = params_for_get_count_affected_by_incorrect_sequences[:used_sequences] || []
    selected_sequences = params_for_get_count_affected_by_incorrect_sequences[:selected_sequences]
    responses = Response.where(question_uid: params[:question_uid], optimal: nil)
    non_blank_selected_sequences = selected_sequences.select { |ss| ss.length > 0}
    matched_responses_count = 0
    responses.each do |response|
      no_matching_used_sequences = used_sequences.none? { |us| s.length > 0 && Regexp.new(us).match(response.text) }
      matching_selected_sequence = non_blank_selected_sequences.any? do |ss|
        sequence_particles = ss.split('&&')
        sequence_particles.all? { |sp| sp.length > 0 && Regexp.new(sp).match(response.text)}
      end
      if no_matching_used_sequences && matching_selected_sequence
        matched_responses_count += 1
      end
    end
    render json: {matchedCount: matched_responses_count}
  end

  def get_count_affected_by_focus_points
    selected_sequences = params_for_get_count_affected_by_focus_points[:selected_sequences]
    responses = Response.where(question_uid: params[:question_uid])
    non_blank_selected_sequences = selected_sequences.select { |ss| ss.length > 0}
    matched_responses_count = 0
    responses.each do |response|
      match = non_blank_selected_sequences.any? do |ss|
        sequence_particles = ss.split('&&')
        sequence_particles.all? { |sp| sp.length > 0 && Regexp.new(sp, 'i').match(response.text)}
      end
      if match
        matched_responses_count += 1
      end
    end
    render json: {matchedCount: matched_responses_count}
  end

  def increment_counts(response)
    response.increment!(:count)
    increment_first_attempt_count(response)
    increment_child_count_of_parent(response)
    response.update_index_in_elastic_search
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_response
      @response = find_by_id_or_uid(params[:id])
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

    def params_for_get_count_affected_by_incorrect_sequences
      params.require(:data).permit!
    end

    def params_for_get_count_affected_by_focus_points
      params.require(:data).permit!
    end

    def find_by_id_or_uid(string)
      Integer(string || '')
      Response.find(string)
    rescue ArgumentError
      Response.find_by_uid(string)
    end

    def increment_first_attempt_count(response)
      params[:response][:is_first_attempt] == "true" ? response.increment!(:first_attempt_count) : nil
    end

    def concept_results_to_boolean(concept_results)
      concept_results.each do |key, val|
        concept_results[key] = val == 'true' || val == true
      end
    end

    def increment_child_count_of_parent(response)
      parent_id = response.parent_id
      parent_uid = response.parent_uid
      id = parent_id || parent_uid
      # id will be the first extant value or false. somehow 0 is being
      # used as when it shouldn't (possible JS remnant) so we verify that
      # id is truthy and not 0
      if id && id != 0
        parent = find_by_id_or_uid(id)
        parent.increment!(:child_count) unless parent.nil?
      end
    end
end
