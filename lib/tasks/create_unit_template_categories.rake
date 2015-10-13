namespace :unit_template_categories do
  task :create => :environment do
    create_unit_template_categories
  end

  def create_unit_template_categories
    data.each do |d|
      utc = UnitTemplateCategory.new(name: d[0], primary_color: d[1], secondary_color: d[2])
      utc.save!
    end
  end

  def data
      [
        %w(ELL #348fdf #014f92),
        %w(Elementary #9c2bde #560684),
        %w(Middle #ea9a1a #875a12),
        %w(High #ff4542 #c51916),
        %w(University #82bf3c #457818),
        %w(Themed #00c2a2 #027360)
      ]
  end
end