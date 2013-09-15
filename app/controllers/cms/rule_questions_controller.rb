class CMS::RuleQuestionsController < ApplicationController
  before_filter :admin!

  def index
    @rule_questions = RuleQuestion.all
  end

  def show
    @rule_question = RuleQuestion.find(params[:id])
  end

  def new
    @rule_question = RuleQuestion.new(rule_id: params[:rule])
  end

  def edit
    @rule_question = RuleQuestion.find(params[:id])
  end

  def create
    params[:rule_question].delete(:answer_array_json)
    @rule_question = RuleQuestion.new(rule_question_params)
    @rule_question.body = params.delete(:answer_options) if params[:answer_options].present?

    if @rule_question.save
      redirect_to cms_rules_path, notice: 'Question was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @rule_question = RuleQuestion.find(params[:id])
    @rule_question.body = params.delete(:answer_options) if params[:answer_options].present?
    params[:rule_question].delete(:answer_array_json)

    if @rule_question.update_attributes(rule_question_params)
      redirect_to cms_rules_path, notice: 'RuleQuestion was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @rule_question = RuleQuestion.find(params[:id])
    @rule_question.destroy
    redirect_to cms_rules_path, notice: 'Question was deleted.'
  end

  protected

  def rule_question_params
    params.require(:rule_question).permit!
  end
end
