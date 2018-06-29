class QuestionSetsController < ApplicationController
  before_action :set_question_set, only: [:show, :edit, :update, :destroy]
  before_action :set_activity, only: [:index, :new, :create]
  # GET /question_sets
  # GET /question_sets.json
  def index
    @question_sets = @activity.question_sets
  end

  # GET /question_sets/1
  # GET /question_sets/1.json
  def show
  end

  # GET /question_sets/new
  def new
    @question_set = QuestionSet.new
  end

  # GET /question_sets/1/edit
  def edit
  end

  # POST /question_sets
  # POST /question_sets.json
  def create
    @question_set = QuestionSet.new(question_set_params)

    respond_to do |format|
      if @question_set.save
        format.html { redirect_to @activity, notice: 'Question set was successfully created.' }
        format.json { render :show, status: :created, location: @question_set }
      else
        format.html { render :new }
        format.json { render json: @question_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /question_sets/1
  # PATCH/PUT /question_sets/1.json
  def update
    respond_to do |format|
      if @question_set.update(question_set_params)
        format.html { redirect_to @question_set, notice: 'Question set was successfully updated.' }
        format.json { render :show, status: :ok, location: @question_set }
      else
        format.html { render :edit }
        format.json { render json: @question_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /question_sets/1
  # DELETE /question_sets/1.json
  def destroy
    @question_set.destroy
    respond_to do |format|
      format.html { redirect_to activity_question_sets_path(@question_set.activity_id), notice: 'Question set was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_question_set
      @question_set = QuestionSet.find(params[:id])
    end

    def set_activity
      @activity = Activity.find(params[:activity_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def question_set_params
      params.require(:question_set).permit(:activity_id, :prompt, :order)
    end
end
