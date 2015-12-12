class Teachers::UnitTemplatesController < ApplicationController
  def index
    render json: UnitTemplate.all
      .includes(:author, activities: [topic: [:topic_category]])
      .map { |ut| UnitTemplateSerializer.new(ut).as_json(root: false) }
  end

  def show
    begin
      unit = UnitTemplate.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to(controller: 'teachers/classroom_manager', action: 'lesson_planner', tab: 'exploreActivityPacks')
    end
    @unit_template_id = params[:id]
  end
end
