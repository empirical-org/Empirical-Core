class RulesController < ApplicationController
  def index
    @categories = Category.all
  end

  def show
    @rule = Rule.find(params[:id])
  end

  def new
    @rule = Rule.new
    @category = params[:category]
  end

  def edit
    @rule = Rule.find(params[:id])
    @category = params[:category]
    @workbook = @rule.workbook
  end

  def create
    @rule = Rule.new(rule_params)

    respond_to do |format|
      if @rule.save
        format.html { redirect_to new_rule_path, notice: 'Rule created.  Make another?' }
        format.json { render json: @rule, status: :created, location: @rule }
      else
        format.html { render action: "new" }
        format.json { render json: @rule.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @rule = Rule.find(params[:id])

    if @rule.update_attributes rule_params
      redirect_to rules_path, notice: 'Rule was successfully updated.'
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
