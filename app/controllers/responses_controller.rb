class ResponsesController < ApplicationController
  before_action :set_response, only: [:show, :update, :destroy, :increment_counts]

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
      render json: @response, status: :created, location: @response
    else
      render json: @response.errors, status: :unprocessable_entity
    end
  end

  # POST /responses/create_or_increment
  def create_or_increment
    @response = Response.find_by_text_and_question_uid(response_params[:text], response_params[:question_uid])
    if !@response
      @response = Response.new(response_params)
      if @response.save
        render json: @response, status: :created, location: @response
      end
    else
      increment_counts
    end
  end

  # PATCH/PUT /responses/1
  def update
    if @response.update(response_params)
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
    @responses = Response.where(question_uid: params[:question_uid]).where.not(optimal: nil)
    render json: @responses
  end

  def increment_counts
    @response.increment!(:count)
    increment_first_attempt_count
    increment_child_count_of_parent
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_response
      @response = find_by_id_or_uid(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def response_params
      params.require(:response).permit( :id, :uid, :parent_id, :parent_uid, :question_uid, :author, :text, :feedback, :count, :first_attempt_count, :child_count, :optimal, :weak, :concept_results, :created_at, :updated_at)
    end

    def find_by_id_or_uid(string)
      Integer(string || '')
      Response.find(string)
    rescue ArgumentError
      Response.find_by_uid(string)
    end

    def increment_first_attempt_count
      params[:is_first_attempt] ? @response.increment!(:first_attempt_count) : nil
    end

    def increment_child_count_of_parent
      parent_id = @response.parent_id
      parent_uid = @response.parent_uid
      if parent_id || parent_uid
        id = parent_id ? parent_id : parent_uid
        parent = find_by_id_or_uid(id)
        parent.increment!(:child_count)
      end
    end

end
