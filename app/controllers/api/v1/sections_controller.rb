class Api::V1:SectionsController < Api:ApiController

  def index
    data = Section.map do |s|
      (Api::SectionSerializer.new(s)).as_json(root: false)
    end
    render json: data
  end

end