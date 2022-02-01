# frozen_string_literal: true

namespace :unit_templates do
  task :create => :environment do
    create_unit_templates
  end

  def create_unit_templates
    ut_data.each do |d|
      create_unit_template d
    end
  end

  def create_unit_template arr
    author = Author.find_or_create_by name: "#{arr[0]} #{arr[1]}"
    UnitTemplate.create(author_id: author.id, name: arr[2], activity_ids: activity_ids, time: 40, unit_template_category_id: UnitTemplateCategory.first.id)
  end

  def activity_ids
    Activity.all[0..4].map(&:id)
  end

  def ut_data
    [
      %w(John Landis Cool),
      %w(Sarah Furth Great),
      %w(Sarah Furth Nice)
    ]
  end
end