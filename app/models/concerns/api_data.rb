module ApiData
  extend ActiveSupport::Concern

  def api_data
    self.all.map do |s|
      (Api::SimpleSerializer.new(s)).as_json(root: false)
    end
  end
end