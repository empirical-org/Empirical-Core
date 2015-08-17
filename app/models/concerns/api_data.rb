module ApiData
  extend ActiveSupport::Concern

  def api_data

    #x = Section
    x = self
    data = self.all.map do |s|
      (Api::SimpleSerializer.new(s)).as_json(root: false)
    end


    data
  end
end