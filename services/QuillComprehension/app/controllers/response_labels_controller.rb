class ResponseLabelsController < ApplicationController
  before_action :set_response_label, only: [:show, :edit, :update, :destroy]

  # GET /response_labels
  # GET /response_labels.json
  def index
    @response_labels = ResponseLabel.all
  end

  # GET /response_labels/1
  # GET /response_labels/1.json
  def show
  end

  # GET /response_labels/new
  def new
    @response_label = ResponseLabel.new
  end

  # GET /response_labels/1/edit
  def edit
  end

  # POST /response_labels
  # POST /response_labels.json
  def create
    @response_label = ResponseLabel.new(response_label_params)

    respond_to do |format|
      if @response_label.save
        format.html { redirect_to @response_label, notice: 'Response label was successfully created.' }
        format.json { render :show, status: :created, location: @response_label }
      else
        format.html { render :new }
        format.json { render json: @response_label.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /response_labels/1
  # PATCH/PUT /response_labels/1.json
  def update
    respond_to do |format|
      if @response_label.update(response_label_params)
        format.html { redirect_to @response_label, notice: 'Response label was successfully updated.' }
        format.json { render :show, status: :ok, location: @response_label }
      else
        format.html { render :edit }
        format.json { render json: @response_label.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /response_labels/1
  # DELETE /response_labels/1.json
  def destroy
    @response_label.destroy
    respond_to do |format|
      format.html { redirect_to response_labels_url, notice: 'Response label was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_response_label
      @response_label = ResponseLabel.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def response_label_params
      params.require(:response_label).permit(:name, :description)
    end
end
