# frozen_string_literal: true

namespace :unit_template_categories do
  task :create => :environment do
    create_unit_template_categories
  end

  def create_unit_template_categories
    utc_data.each do |d|
      name = d[0]
      utc = UnitTemplateCategory.where(name: name)
      if utc.any?
        puts "#{name} already exists"
      else
        utc = UnitTemplateCategory.new(name: name, primary_color: d[1], secondary_color: d[2])
        if utc.save
          puts "saved #{name} successfully"
        else
          puts "failure saving #{name}"
        end
      end
    end
  end

  def utc_data
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