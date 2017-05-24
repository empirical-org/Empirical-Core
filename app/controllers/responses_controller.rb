class ResponsesController < ApplicationController
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
      render json: @response, status: :created, location: @response
    else
      render json: @response.errors, status: :unprocessable_entity
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_response
      @response = find_by_id_or_uid(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def response_params
      params.fetch(:response, {})
    end

    def find_by_id_or_uid(string)
      Integer(string || '')
      Response.find(string)
    rescue ArgumentError
      Response.find_by_uid(string)
    end
end
