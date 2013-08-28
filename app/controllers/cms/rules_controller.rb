class CMS::RulesController < ApplicationController
  before_filter :admin!

  def index
    @categories = Category.all
  end

  def show
    @rule = Rule.find(params[:id])
  end

  def new
    @rule = Rule.new

    if params[:example].present? && @rule.examples.empty?
      @rule.examples.build
      @rule.examples.build
    end

    @category = params[:category]
  end

  def edit
    @rule = Rule.find(params[:id])

    if params[:example].present? && @rule.examples.empty?
      @rule.examples.build
      @rule.examples.build
    end

    @category = params[:category]
    @workbook = @rule.workbook
  end

  def create
    @rule = Rule.new(rule_params)

    if @rule.save
      redirect_to new_rule_path, notice: 'Rule created. Make another?'
    else
      render action: "new"
    end
  end

  def update
    @rule = Rule.find(params[:id])

    if @rule.update_attributes rule_params
      redirect_to cms_rules_path, notice: 'Rule was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @rule = Rule.find(params[:id])

    @rule.lessons.each do |lesson|
      lesson.destroy
    end

    @rule.destroy
    redirect_to rules_url
  end

  protected

  def rule_params
    params.require(:rule).permit!
  end
end
