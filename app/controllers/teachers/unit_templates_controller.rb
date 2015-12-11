class Teachers::UnitTemplatesController < ApplicationController

  def index
    render json: UnitTemplate.all
                  .includes(:author, activities: [topic: [:topic_category]])
                  .map{|ut| UnitTemplateSerializer.new(ut).as_json(root: false)}
  end

  def show
    @unit_template_id = params[:id]
  end
end
