class Teachers::UnitTemplatesController < ApplicationController

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: UnitTemplate.all.map{|ut| UnitTemplateSerializer.new(ut).as_json(root: false)}
      end
    end
  end
end
