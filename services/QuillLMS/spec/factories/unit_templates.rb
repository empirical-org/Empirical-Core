# frozen_string_literal: true

# == Schema Information
#
# Table name: unit_templates
#
#  id                        :integer          not null, primary key
#  activity_info             :text
#  flag                      :string
#  grades                    :text
#  image_link                :string
#  name                      :string
#  order_number              :integer          default(999999999)
#  time                      :integer
#  created_at                :datetime
#  updated_at                :datetime
#  author_id                 :integer
#  unit_template_category_id :integer
#
# Indexes
#
#  index_unit_templates_on_activity_info              (activity_info)
#  index_unit_templates_on_author_id                  (author_id)
#  index_unit_templates_on_unit_template_category_id  (unit_template_category_id)
#
FactoryBot.define do
  factory :simple_unit_template, class: 'UnitTemplate'

  factory :unit_template do
    sequence(:name) do |i|
      loop do
        possible_name = "Unit Template #{i}"
        break possible_name unless UnitTemplate.exists?(name: possible_name)
      end
    end
    author                  { create(:author) }
    unit_template_category  { create(:unit_template_category) }

    factory :unit_template_with_activities do
      activities              { build_list(:activity, 3) }
    end
  end

end
