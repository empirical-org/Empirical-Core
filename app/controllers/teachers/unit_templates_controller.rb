class Teachers::UnitTemplatesController < ApplicationController

  def index
    render json: UnitTemplate.all
                  .includes(:author, :unit_template_category, activities: [{topic: [:topic_category]}, :classification])
                  .map{|ut| UnitTemplateSerializer.new(ut).as_json(root: false)}
  end

  def one_click_assign
    Units::Creator.one_click_assign(current_user, params[:id])
  end

  def show
    begin
      unit = UnitTemplate.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to(controller: "teachers/classroom_manager", action: "lesson_planner", tab: "exploreActivityPacks")
    end
    @unit_template_id = params[:id]
  end
end
