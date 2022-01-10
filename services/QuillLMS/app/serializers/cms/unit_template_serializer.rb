# frozen_string_literal: true

class Cms::UnitTemplateSerializer < ActiveModel::Serializer
  attributes :id, :name, :author_id, :time, :unit_template_category_id, :grades, :flag, :order_number, :activity_info, :image_link, :readability, :diagnostics
  has_many :activities
end
