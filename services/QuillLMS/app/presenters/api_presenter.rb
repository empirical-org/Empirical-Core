# frozen_string_literal: true

class ApiPresenter

  def initialize(model)
    @model = model
  end

  def simple_index
    @model.all.map do |s|
      (Api::SimpleSerializer.new(s)).as_json(root: false)
    end
  end
end
