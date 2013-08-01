class LessonsController < ApplicationController
  before_filter :admin!

  def index
    @lessons = Lesson.all
  end

  def show
    @lesson = Lesson.find(params[:id])
  end

  def new
    @lesson = Lesson.new(rule_id: params[:rule])
  end

  def edit
    @lesson = Lesson.find(params[:id])
  end

  def create
    params[:lesson].delete(:answer_array_json)
    @lesson = Lesson.new(lesson_params)
    @lesson.body = params.delete(:answer_options) if params[:answer_options].present?

    if @lesson.save
      redirect_to rules_path, notice: 'Lesson was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @lesson = Lesson.find(params[:id])
    @lesson.body = params.delete(:answer_options) if params[:answer_options].present?
    params[:lesson].delete(:answer_array_json)

    if @lesson.update_attributes(lesson_params)
      redirect_to rules_path, notice: 'Lesson was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @lesson = Lesson.find(params[:id])
    @lesson.destroy
    redirect_to rules_path, notice: 'Lesson was deleted.'
  end

  protected

  def lesson_params
    params.require(:lesson).permit!
  end
end
