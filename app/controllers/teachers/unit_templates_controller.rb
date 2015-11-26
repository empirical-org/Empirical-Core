class Teachers::UnitTemplatesController < ApplicationController

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: UnitTemplate.all
                                  .includes(:author, :activities => [:topic, :section])
                                  .map{|ut| UnitTemplateSerializer.new(ut).as_json(root: false)}
      end
    end
  end

  def show
    @unit_template_id = params[:id]
  end
end
